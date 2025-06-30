import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated, Dimensions, FlatList, Image, ImageBackground, Modal,
    PermissionsAndroid, Platform,
    SafeAreaView, StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHAR_UUID_NOTIFY = "0000FFF1-0000-1000-8000-00805F9B34FB";
const CHAR_UUID_WRITE  = "0000FFF2-0000-1000-8000-00805F9B34FB";

export default function BLETest3() {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [connectingId, setConnectingId] = useState(null);
  const [connected, setConnected] = useState(null);
  const [showControl, setShowControl] = useState(false);

  // useRef로 한 번만 생성
  const managerRef = useRef(null);
  if (!managerRef.current) managerRef.current = new BleManager();
  const spinValue = useRef(new Animated.Value(0)).current;

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
    managerRef.current.startDeviceScan(null, null, (error, device) => {
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
      managerRef.current?.stopDeviceScan();
      setScanning(false);
    }, 8000);
  };

  // 연결만 테스트
  const connect = async (device) => {
    setConnectingId(device.id);
    try {
      const connectedDevice = await managerRef.current.connectToDevice(device.id, { autoConnect: true });
      await connectedDevice.discoverAllServicesAndCharacteristics();
      setConnected(connectedDevice);
      setShowControl(true);
    } catch (e) {
      Alert.alert('연결 실패', e?.message || '알 수 없는 오류');
      setConnected(null);
    }
    setConnectingId(null);
  };

  // 연결 해제
  const disconnect = async () => {
    try {
      if (connected) {
        await connected.cancelConnection();
        setConnected(null);
        setShowControl(false);
      }
    } catch (e) {
      Alert.alert('연결 해제 실패', e?.message || '알 수 없는 오류');
    }
  };

  // BLE 매니저 정리
  useEffect(() => {
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
          <Text style={styles.headerTitle}>BLE 연결 테스트3</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={scan}>
            <Animated.Image source={require('../../../assets/images/그룹 3870.png')} style={[styles.refreshIcon, { transform: [{ rotate: spin }] }]} />
            <Text style={styles.refreshText}>다시 검색</Text>
          </TouchableOpacity>
        </View>
        <Image source={require('../../../assets/images/mobile.png')} style={styles.phoneIcon} resizeMode="contain" />
      </ImageBackground>
      {scanning ? (
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
                  connected && connected.id === item.id && { backgroundColor: '#d9f99d' }
                ]}
                onPress={() => connect(item)}
                activeOpacity={0.7}
                disabled={connectingId || (connected && connected.id === item.id)}
              >
                <View style={styles.deviceCard}>
                  <Image source={require('../../../assets/images/phone.png')} style={styles.deviceIcon} />
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{item.name || '(No Name)'}</Text>
                    <Text style={styles.deviceAddress}>{item.id}</Text>
                    {connectingId === item.id && <Text style={{color:'#34d399'}}>연결 중...</Text>}
                    {connected && connected.id === item.id && <Text style={{color:'#22c55e'}}>연결됨</Text>}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:24 }}>기기를 찾을 수 없습니다.</Text>}
          />
        </ImageBackground>
      )}
      <Modal visible={showControl} animationType="slide" transparent={true} onRequestClose={() => setShowControl(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 14, minWidth: 260, alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>BLE 장치 제어</Text>
            <TouchableOpacity onPress={disconnect} style={{ backgroundColor: '#6b7280', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, minWidth: 120, alignItems: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>연결 해제</Text>
            </TouchableOpacity>
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