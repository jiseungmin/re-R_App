import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, FlatList, ImageBackground, PermissionsAndroid, Platform, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default function BLETestImageBg() {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [connectingId, setConnectingId] = useState(null);
  const [connected, setConnected] = useState(null);
  const managerRef = useRef(null);

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={require('../../../assets/images/그룹 5312.png')} style={{ flex: 1, paddingTop: 48 }}>
        <Button title={scanning ? '검색 중...' : 'BLE 기기 검색'} onPress={scan} disabled={scanning} />
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
      </ImageBackground>
    </SafeAreaView>
  );
} 