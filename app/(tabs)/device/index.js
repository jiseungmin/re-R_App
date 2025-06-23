import { Stack } from 'expo-router';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import BleScanner from '../../../components/bluetooth/BleScanner';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';                             // for Base64 conversion
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const OVERLAY_HEIGHT = 80;

export default function Device() {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [incomingData, setIncomingData] = useState(null);
  const [scanning, setScanning] = useState(false);

  const managerRef = useRef(new BleManager());
  const writeCharRef = useRef(null);

  const spinValue = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  // 스핀 애니메이션
  const runStutterSpin = () => {
    spinValue.setValue(0);
    Animated.sequence([
      Animated.timing(spinValue, { toValue: 60,  duration: 300, useNativeDriver: true }),
      Animated.delay(100),
      Animated.timing(spinValue, { toValue: 180, duration: 300, useNativeDriver: true }),
      Animated.delay(100),
      Animated.timing(spinValue, { toValue: 360, duration: 400, useNativeDriver: true }),
    ]).start();
  };
  const spin = spinValue.interpolate({ inputRange: [0,360], outputRange: ['0deg','360deg'] });

  // BLE 스캔 트리거
  const onRefresh = () => {
    setDevices([]);
    setConnectedDevice(null);
    setIncomingData(null);
    writeCharRef.current = null;
    setScanning(true);
    runStutterSpin();
  };

  // BleScanner → 디바이스 목록 업데이트
  const onDevicesFound = useCallback(found => {
    setDevices(found);
    setScanning(false);
  }, []);

  // 기기 선택 → 연결, 서비스·특성 탐색, START 전송, Notify 구독
  const connectToDevice = async device => {
    try {
      const manager = managerRef.current;
      const connected = await manager.connectToDevice(device.id);
      await connected.discoverAllServicesAndCharacteristics();
      setConnectedDevice(device);

      const services = await connected.services();
      for (const svc of services) {
        const chars = await svc.characteristics();
        for (const c of chars) {
          const u = c.uuid.toUpperCase();
          if (u.includes('FFF1')) {
            // Notification
            c.monitor((err, char) => {
              if (err) return console.warn(err);
              const buf = Buffer.from(char.value, 'base64');
              setIncomingData(buf.toString('hex'));
            });
          }
          if (u.includes('FFF2')) {
            // Write 용 특성 저장
            writeCharRef.current = c;
          }
        }
      }

      // START 명령 전송
      if (writeCharRef.current) {
        const startCmd = Buffer.from([0xAA,0x64,0x01,0x02,0xD1]).toString('base64');
        await writeCharRef.current.writeWithResponse(startCmd);
      }
    } catch (e) {
      console.warn('Connect Error', e);
    }
  };

  // STOP 명령 전송
  const sendStop = async () => {
    if (writeCharRef.current) {
      const stopCmd = Buffer.from([0x7B,0x01,0x01,0x00,0xAA,0x2C]).toString('base64');
      await writeCharRef.current.writeWithResponse(stopCmd);
      setIncomingData(null);
      setConnectedDevice(null);
      writeCharRef.current = null;
    }
  };

  // 템플릿 헤더 숨기기
  useEffect(() => {
    managerRef.current; // ensure manager created
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

      {/* BLE 스캐너(백그라운드) */}
      {scanning && <BleScanner onDevicesFound={onDevicesFound} />}

      {/* 기기 리스트 */}
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
              style={styles.cardBg}
              onPress={() => connectToDevice(item)}
              activeOpacity={0.7}
            >
              <View style={styles.deviceCard}>
                <Image
                  source={require('../../../assets/images/phone.png')}
                  style={styles.deviceIcon}
                />
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{item.name}</Text>
                  <Text style={styles.deviceAddress}>{item.address}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />
      </ImageBackground>

      {/* 연결 상태 & 수신 데이터 */}
      {connectedDevice && (
        <View style={[styles.dataContainer, { marginBottom: insets.bottom + 16 }]}>
          <Text style={styles.dataTitle}>연결됨: {connectedDevice.name}</Text>
          <Text style={styles.dataText}>수신 데이터: {incomingData ?? '대기 중...'}</Text>
          <TouchableOpacity style={styles.stopBtnWrap} onPress={sendStop}>
            <Text style={styles.stopBtnText}>중단</Text>
          </TouchableOpacity>
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
    height: 64,            // 고정 높이
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

  stopBtnWrap: {
    backgroundColor: '#ff4444',
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  stopBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
