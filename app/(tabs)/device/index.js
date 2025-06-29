import { Buffer } from 'buffer';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SERVICE_UUID = null; // All service scan
const CHAR_UUID_NOTIFY = "0000FFF1-0000-1000-8000-00805F9B34FB";
const CHAR_UUID_WRITE  = "0000FFF2-0000-1000-8000-00805F9B34FB";

export default function Device() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [connectingId, setConnectingId] = useState(null);
  const [rawData, setRawData] = useState("");
  const [flexion, setFlexion] = useState(null);
  const [extension, setExtension] = useState(null);
  const [mode, setMode] = useState(null);
  const [writeChar, setWriteChar] = useState(null);

  const spinValue = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const managerRef = useRef(null);

  // 스핀 애니메이션
  const runStutterSpin = () => {
    spinValue.setValue(0);
    Animated.sequence([
      Animated.timing(spinValue, { toValue: 60, duration: 300, useNativeDriver: true }),
      Animated.delay(100),
      Animated.timing(spinValue, { toValue: 180, duration: 300, useNativeDriver: true }),
      Animated.delay(100),
      Animated.timing(spinValue, { toValue: 360, duration: 400, useNativeDriver: true }),
    ]).start();
  };
  const spin = spinValue.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });

  // 권한 요청
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }
    // iOS는 plist에 기입 필요
  };

  // BLE 스캔 시작 (기기 누적형)
  const startScan = async () => {
    setDevices([]);
    setConnectedDevice(null);
    setRawData("");
    setFlexion(null);
    setExtension(null);
    setMode(null);
    setWriteChar(null);
    setScanning(true);
    runStutterSpin();

    if (!managerRef.current) managerRef.current = new BleManager();
    await requestPermissions();

    managerRef.current.startDeviceScan(null, null, (error, device) => {
      if (error) {
        setScanning(false);
        Alert.alert("스캔 오류", error.message);
        return;
      }
      if (device && device.id) {
        setDevices(prev => {
          if (prev.find(d => d.id === device.id)) return prev;
          return [...prev, device];
        });
      }
    });

    setTimeout(() => {
      managerRef.current?.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  // 기기 연결 및 서비스/특성 탐색
  const connectToDevice = async (device) => {
    setConnectingId(device.id);
    try {
      if (!managerRef.current) managerRef.current = new BleManager();
      const connected = await managerRef.current.connectToDevice(device.id, {autoConnect: true});
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(connected);

      // 특성 찾기
      const services = await connected.services();
      let notifyFound = false;
      let writeFound = null;

      for (const svc of services) {
        const chars = await svc.characteristics();
        for (const c of chars) {
          if (c.uuid.toUpperCase() === CHAR_UUID_NOTIFY) {
            // Notify 구독
            c.monitor((err, char) => {
              if (err) {
                setRawData("Notify 오류");
                return;
              }
              if (char?.value) {
                let buf = Buffer.from(char.value, 'base64');
                setRawData(buf.toString('hex'));
                if (buf.length >= 10) {
                  const modeVal = buf[5];
                  const flexVal = buf[6];
                  const extVal = buf[7];
                  setMode(modeVal);
                  setFlexion(flexVal);
                  setExtension(extVal);
                } else {
                  setMode(null);
                  setFlexion(null);
                  setExtension(null);
                }
              }
            });
            notifyFound = true;
          }
          if (c.uuid.toUpperCase() === CHAR_UUID_WRITE) {
            writeFound = c;
          }
        }
      }
      setWriteChar(writeFound);
      if (!notifyFound) Alert.alert("Notify UUID 미발견", "Notify 캐릭터리스틱이 없습니다.");
    } catch (e) {
      Alert.alert('연결 실패', e?.message || "BLE 연결 오류");
      setConnectedDevice(null);
    }
    setConnectingId(null);
  };

  // START/STOP 명령 보내기
  const sendStart = async () => {
    try {
      if (!writeChar) throw new Error("쓰기 특성을 찾을 수 없습니다.");
      const arr = [0xaa, 0x64, 0x01, 0x02, 0xd1];
      const data = Buffer.from(arr).toString('base64');
      await writeChar.writeWithResponse(data);
      Alert.alert('전송 완료', 'START 프로토콜 전송!');
    } catch (e) {
      Alert.alert('전송 실패', e?.message || 'Start 전송 오류');
    }
  };

  const sendStop = async () => {
    try {
      if (!writeChar) throw new Error("쓰기 특성을 찾을 수 없습니다.");
      const arr = [0xaa, 0x64, 0x00, 0x02, 0xd4];
      const data = Buffer.from(arr).toString('base64');
      await writeChar.writeWithResponse(data);
      Alert.alert('전송 완료', 'STOP 프로토콜 전송!');
    } catch (e) {
      Alert.alert('전송 실패', e?.message || 'Stop 전송 오류');
    }
  };

  // 새로고침 버튼
  const onRefresh = () => {
    startScan();
  };

  // 언마운트 시 BLE 매니저 정리
  useEffect(() => {
    managerRef.current = new BleManager();
    return () => {
      managerRef.current?.destroy();
    };
  }, []);

  // 첫 진입시 자동 스캔
  useEffect(() => {
    startScan();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* 헤더 */}
      <ImageBackground
        source={require('../../../assets/images/그룹 5312.png')}
        style={styles.header}
        imageStyle={styles.headerBg}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>기기정보</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Animated.Image
              source={require('../../../assets/images/그룹 3870.png')}
              style={[styles.refreshIcon, { transform: [{ rotate: spin }] }]}
            />
            <Text style={styles.refreshText}>다시 검색</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../../../assets/images/mobile.png')}
          style={styles.phoneIcon}
          resizeMode="contain"
        />
      </ImageBackground>

      {/* 검색 중 안내 */}
      {scanning ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>기기 검색 중...</Text>
        </View>
      ) : (
        // 기기 리스트
        <ImageBackground
          source={require('../../../assets/images/사각형 2154.png')}
          style={styles.listBg}
          imageStyle={styles.listRadius}
        >
          <FlatList
            data={devices}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.cardBg,
                  connectedDevice && connectedDevice.id === item.id && { backgroundColor: '#d9f99d' }
                ]}
                onPress={() => connectToDevice(item)}
                activeOpacity={0.7}
                disabled={connectingId || (connectedDevice && connectedDevice.id === item.id)}
              >
                <View style={styles.deviceCard}>
                  <Image
                    source={require('../../../assets/images/phone.png')}
                    style={styles.deviceIcon}
                  />
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{item.name || '(No Name)'}</Text>
                    <Text style={styles.deviceAddress}>{item.id}</Text>
                    {connectingId === item.id && <Text style={{color:'#34d399'}}>연결 중...</Text>}
                    {connectedDevice && connectedDevice.id === item.id && <Text style={{color:'#22c55e'}}>연결됨</Text>}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:24 }}>기기를 찾을 수 없습니다.</Text>}
          />
        </ImageBackground>
      )}

      {/* 연결 상태 및 명령 송신/Notify 표시 */}
      {connectedDevice && (
        <View style={[styles.dataContainer, { marginBottom: insets.bottom + 16 }]}>
          <Text style={styles.dataTitle}>연결됨: {connectedDevice.name || '(No Name)'}</Text>
          <Text style={styles.dataText}>ID: {connectedDevice.id}</Text>
          <Text style={styles.dataText}>패킷(raw): {rawData}</Text>
          {mode !== null && (
            <View style={{marginTop: 6}}>
              <Text style={styles.dataText}>모드: {mode} ({'0x'+mode.toString(16)})</Text>
              <Text style={styles.dataText}>Flexion(구부림): {flexion} 도</Text>
              <Text style={styles.dataText}>Extension(펴짐): {extension} 도</Text>
            </View>
          )}
          <View style={{flexDirection:'row', marginTop:8}}>
            <TouchableOpacity
              onPress={sendStart}
              style={{backgroundColor:'#22c55e',borderRadius:8,padding:8,marginRight:8}}
              disabled={!writeChar}
            >
              <Text style={{color:'#fff'}}>START</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sendStop}
              style={{backgroundColor:'#e11d48',borderRadius:8,padding:8}}
              disabled={!writeChar}
            >
              <Text style={{color:'#fff'}}>STOP</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    width: SCREEN_WIDTH,
    aspectRatio: 375 / 180,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  headerBg: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerLeft: { flexDirection: 'column' },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '400',
    marginTop: 30,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 10,
  },
  refreshIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    resizeMode: 'contain',
  },
  refreshText: {
    fontSize: 14,
    color: '#000',
  },
  phoneIcon: {
    width: '60%',
    height: '60%',
    marginTop: 16,
    marginRight: -50,
  },

  listBg: {
    flex: 1,
    margin: 10,
    paddingTop: 16,
  },
  listRadius: {
    borderRadius: 16,
  },
  listContent: {
    paddingBottom: 24,
  },

  cardBg: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    height: 64,
    justifyContent: 'center',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
    resizeMode: 'contain',
  },
  deviceInfo: { flex: 1 },
  deviceName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  deviceAddress: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },

  dataContainer: {
    padding: 16,
    backgroundColor: '#eef',
    marginHorizontal: 10,
    borderRadius: 10,
  },
  dataTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  dataText: { fontSize: 12, color: '#333', marginBottom: 8 },
});
