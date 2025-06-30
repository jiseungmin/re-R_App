import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Button, FlatList, ImageBackground, Modal, PermissionsAndroid, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default function BLETestModal() {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [connectingId, setConnectingId] = useState(null);
  const [connected, setConnected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const managerRef = useRef(null);
  const spinValue = useRef(new Animated.Value(0)).current;

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }
  };

  const scan = async () => {
    setDevices([]);
    setScanning(true);
    if (!managerRef.current) managerRef.current = new BleManager();
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

  const connect = async (device) => {
    setConnectingId(device.id);
    try {
      if (!managerRef.current) managerRef.current = new BleManager();
      const connectedDevice = await managerRef.current.connectToDevice(device.id, { autoConnect: true });
      await connectedDevice.discoverAllServicesAndCharacteristics();
      setConnected(connectedDevice);
      setShowModal(true);
      Alert.alert('연결 성공', connectedDevice.name || connectedDevice.id);
    } catch (e) {
      Alert.alert('연결 실패', e?.message || '알 수 없는 오류');
      setConnected(null);
    }
    setConnectingId(null);
  };

  useEffect(() => {
    managerRef.current = new BleManager();
    return () => {
      managerRef.current?.destroy();
    };
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={require('../../../assets/images/그룹 5312.png')} style={{ flex: 1, paddingTop: 48 }}>
        <Button title={scanning ? '검색 중...' : 'BLE 기기 검색'} onPress={scan} disabled={scanning} />
        <Animated.View style={{ width: 40, height: 40, alignSelf: 'center', margin: 10, transform: [{ rotate: spin }] }}>
          <View style={{ width: 40, height: 40, backgroundColor: '#1568c7', borderRadius: 20 }} />
        </Animated.View>
        <FlatList
          data={devices}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => connect(item)}
              disabled={!!connectingId}
              style={{ padding: 20, borderBottomWidth: 1, borderColor: '#ddd' }}
            >
              <Text>{item.name || '(No Name)'}</Text>
              <Text style={{ fontSize: 12, color: '#888' }}>{item.id}</Text>
              {connectingId === item.id && <Text style={{ color: 'green' }}>연결 중...</Text>}
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>검색 결과 없음</Text>}
        />
        <Modal visible={showModal} animationType="slide" transparent={true} onRequestClose={() => setShowModal(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
            <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 14, minWidth: 260, alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>BLE 연결됨</Text>
              <Button title="닫기" onPress={() => setShowModal(false)} />
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
} 