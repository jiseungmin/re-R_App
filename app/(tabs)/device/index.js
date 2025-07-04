import { Buffer } from 'buffer';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Button,
  Dimensions, FlatList, Image, ImageBackground, Modal,
  PermissionsAndroid, Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHAR_UUID_NOTIFY = "0000FFF1-0000-1000-8000-00805F9B34FB";
const CHAR_UUID_WRITE  = "0000FFF2-0000-1000-8000-00805F9B34FB";

// 전역 BleManager (비권장)
const globalManager = new BleManager();

export default function Device() {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [connectingId, setConnectingId] = useState(null);
  const [connected, setConnected] = useState(null);
  const [showControl, setShowControl] = useState(false);
  const [rawData, setRawData] = useState("");
  const [flexion, setFlexion] = useState(null);
  const [extension, setExtension] = useState(null);
  const [writeChar, setWriteChar] = useState(null);
  const [mode, setMode] = useState(null);

  const spinValue = useRef(new Animated.Value(0)).current;
  const managerRef = useRef(null);

  // 권한 요청
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }
  };

  // BLE 스캔
  const scan = async () => {
    setDevices([]);
    setScanning(true);
    await requestPermissions();
    globalManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        setScanning(false);
        Alert.alert('스캔 오류', error.message);
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
      globalManager?.stopDeviceScan();
      setScanning(false);
    }, 8000);
  };

  // 연결만 테스트
  const connect = async (device) => {
    setConnectingId(device.id);
    try {
      if (!managerRef.current) managerRef.current = new BleManager();
      const connectedDevice = await managerRef.current.connectToDevice(device.id, { autoConnect: true });
      await connectedDevice.discoverAllServicesAndCharacteristics();

      // 모든 서비스 → 캐릭터리스틱
      const services = await connectedDevice.services();
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
      setConnected(connectedDevice);
      setShowControl(true);
      if (!notifyFound) Alert.alert("Notify UUID 미발견", "Notify 캐릭터리스틱이 없습니다.");
    } catch (e) {
      Alert.alert('연결 실패', e?.message || '알 수 없는 오류');
      setConnected(null);
    }
    setConnectingId(null);
  };

  // START 명령
  const sendStart = async () => {
    try {
      if (!writeChar) throw new Error("쓰기 특성을 찾을 수 없습니다.");
      const arr = [0xaa, 0x64, 0x01, 0x02, 0xd1];
      const data = Buffer.from(arr).toString('base64');
      await writeChar.writeWithResponse(data);
      Alert.alert('START', 'START 명령 전송 완료');
    } catch (e) {
      Alert.alert('전송 실패', e?.message || 'Start 전송 오류');
    }
  };
  // STOP 명령
  const sendStop = async () => {
    try {
      if (!writeChar) throw new Error("쓰기 특성을 찾을 수 없습니다.");
      const arr = [0xaa, 0x64, 0x00, 0x02, 0xd4];
      const data = Buffer.from(arr).toString('base64');
      await writeChar.writeWithResponse(data);
      Alert.alert('STOP', 'STOP 명령 전송 완료');
    } catch (e) {
      Alert.alert('전송 실패', e?.message || 'Stop 전송 오류');
    }
  };

  // BLE 매니저 초기화/정리
  useEffect(() => {
    managerRef.current = new BleManager();
    return () => {
      managerRef.current?.destroy();
    };
  }, []);

  // 화면 진입시 자동 스캔
  useEffect(() => {
    scan();
  }, []);

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
  useEffect(() => { if (scanning) runStutterSpin(); }, [scanning]);
  const spin = spinValue.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });

  // UI (device 스타일)
  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../../assets/images/그룹 5312.png')} style={styles.header} imageStyle={styles.headerBg}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>BLE 연결</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={scan}>
            <Animated.Image source={require('../../../assets/images/그룹 3870.png')} style={[styles.refreshIcon, { transform: [{ rotate: spin }] }]} />
            <Text style={styles.refreshText}>다시 검색</Text>
          </TouchableOpacity>
        </View>
        <Image source={require('../../../assets/images/mobile.png')} style={styles.phoneIcon} resizeMode="contain" />
      </ImageBackground>

      {/* 연결 성공 시 디바이스 정보 화면 */}
      {connected ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <View style={{backgroundColor:'#f7f7f7', borderRadius:16, padding:24, width:'90%', alignItems:'center', marginTop:32}}>
            <View style={{flexDirection:'row', alignItems:'center', width:'100%', justifyContent:'space-between', marginBottom:12}}>
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <View style={{width:10, height:10, borderRadius:5, backgroundColor:'#22c55e', marginRight:6}} />
                <Text style={{fontWeight:'bold'}}>연결됨</Text>
              </View>
              <View style={{flexDirection:'row', gap:8}}>
                <TouchableOpacity style={{backgroundColor:'#FFB84D', borderRadius:8, paddingHorizontal:12, paddingVertical:4, marginRight:8}}>
                  <Text style={{color:'#fff', fontWeight:'bold'}}>보정</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{backgroundColor:'#FF6B6B', borderRadius:8, paddingHorizontal:12, paddingVertical:4}} onPress={()=>{setConnected(null); setShowControl(false);}}>
                  <Text style={{color:'#fff', fontWeight:'bold'}}>연결해제</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Image source={require('../../../assets/images/그룹 5769.png')} style={{width:160, height:160, marginVertical:12}} resizeMode="contain" />
            <Text style={{fontSize:18, fontWeight:'bold', marginBottom:4}}>{connected.name || '(No Name)'}</Text>
            <Text style={{fontSize:13, color:'#888', marginBottom:16}}>{connected.id}</Text>
            <TouchableOpacity style={{borderWidth:2, borderColor:'#1a237e', borderRadius:10, paddingVertical:12, paddingHorizontal:24, marginTop:8, width:'100%'}} onPress={()=>{
              // 튜토리얼 화면 이동 구현 필요 (navigation)
            }}>
              <Text style={{fontSize:18, fontWeight:'bold', textAlign:'center'}}>기기 착용 방법 확인</Text>
            </TouchableOpacity>

            {/* 연결 테스트 버튼 */}
            <TouchableOpacity
              style={{borderWidth:2, borderColor:'#22c55e', borderRadius:10, paddingVertical:12, paddingHorizontal:24, marginTop:16, width:'100%', backgroundColor:'#e6f9f0'}}
              onPress={async () => {
                try {
                  await sendStart();
                  setTimeout(async () => {
                    await sendStop();
                  }, 1000);
                } catch (e) {
                  Alert.alert('연결 테스트 실패', e?.message || '오류');
                }
              }}
              disabled={!writeChar}
            >
              <Text style={{fontSize:18, fontWeight:'bold', textAlign:'center', color:'#22c55e'}}>연결 테스트</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        scanning ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>기기 검색 중...</Text>
          </View>
        ) : (
          <ImageBackground source={require('../../../assets/images/사각형 2154.png')} style={styles.listBg} imageStyle={styles.listRadius}>
            <FlatList
              data={devices}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.cardBg,
                  ]}
                  onPress={() => connect(item)}
                  activeOpacity={0.7}
                  disabled={!!connectingId}
                >
                  <View style={styles.deviceCard}>
                    <Image source={require('../../../assets/images/phone.png')} style={styles.deviceIcon} />
                    <View style={styles.deviceInfo}>
                      <Text style={styles.deviceName}>{item.name || '(No Name)'}</Text>
                      <Text style={styles.deviceAddress}>{item.id}</Text>
                      {connectingId === item.id && <Text style={{color:'#34d399'}}>연결 중...</Text>}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:24 }}>기기를 찾을 수 없습니다.</Text>}
            />
          </ImageBackground>
        )
      )}

      {/* 데이터 출력 */}
      {connected && (
        <ScrollView style={{ margin: 20, padding: 10, borderWidth: 1, borderColor: '#aaa', borderRadius: 8, maxHeight: 140 }}>
          <Text style={{ fontWeight: 'bold' }}>패킷(raw): {rawData}</Text>
          {mode !== null && (
            <View style={{marginTop:6}}>
              <Text>모드: {mode} ({'0x'+mode.toString(16)})</Text>
              <Text>Flexion(구부림): {flexion} 도</Text>
              <Text>Extension(펴짐): {extension} 도</Text>
            </View>
          )}
        </ScrollView>
      )}

      <Modal
        visible={showControl}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowControl(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.2)'
        }}>
          <View style={{
            backgroundColor: '#fff', padding: 24, borderRadius: 14, minWidth: 260, alignItems: 'center'
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>BLE 장치 제어</Text>
            {/* 실시간 각도/모드 출력 */}
            {mode !== null && (
              <View style={{marginBottom: 12, alignItems: 'center'}}>
                <Text>모드: {mode} ({'0x'+mode.toString(16)})</Text>
                <Text>Flexion(구부림): {flexion} 도</Text>
                <Text>Extension(펴짐): {extension} 도</Text>
              </View>
            )}
            <Button title="START 명령 전송" onPress={sendStart} disabled={!writeChar}/>
            <View style={{ height: 8 }} />
            <Button title="STOP 명령 전송" onPress={sendStop} disabled={!writeChar}/>
            <View style={{ height: 14 }} />
            <Button title="닫기" color="#aaa" onPress={() => setShowControl(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { width: SCREEN_WIDTH, aspectRatio: 375 / 180, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 24 },
  headerBg: { borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
  headerLeft: { flexDirection: 'column' },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '400', marginTop: 30 },
  refreshButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20, marginTop: 10 },
  refreshIcon: { width: 16, height: 16, marginRight: 6, resizeMode: 'contain' },
  refreshText: { fontSize: 14, color: '#000' },
  phoneIcon: { width: '60%', height: '60%', marginTop: 16, marginRight: -50 },
  listBg: { flex: 1, margin: 10, paddingTop: 16 },
  listRadius: { borderRadius: 16 },
  listContent: { paddingBottom: 24 },
  cardBg: { backgroundColor: '#f7f7f7', borderRadius: 12, padding: 12, marginVertical: 6, height: 64, justifyContent: 'center' },
  deviceCard: { flexDirection: 'row', alignItems: 'center' },
  deviceIcon: { width: 32, height: 32, marginRight: 12, resizeMode: 'contain' },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: 14, fontWeight: '500', color: '#333' },
  deviceAddress: { fontSize: 10, color: '#666', marginTop: 2 },
});
