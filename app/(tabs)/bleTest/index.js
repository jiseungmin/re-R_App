import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, Alert, Platform, PermissionsAndroid, ScrollView } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const CHAR_UUID_NOTIFY = "0000FFF1-0000-1000-8000-00805F9B34FB"; // HLK의 notify UUID

export default function BLETestScreen() {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [connectingId, setConnectingId] = useState(null);
  const [notifyData, setNotifyData] = useState(""); // 데이터 수신 값
  const [connected, setConnected] = useState(null);

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

  // 연결 + 데이터(Notify) 수신
  const connect = async (device) => {
    setConnectingId(device.id);
    try {
      if (!managerRef.current) managerRef.current = new BleManager();
      const connectedDevice = await managerRef.current.connectToDevice(device.id, { autoConnect: true });
      await connectedDevice.discoverAllServicesAndCharacteristics();

      // 모든 서비스 → 모든 캐릭터리스틱 → Notify UUID 찾기
      const services = await connectedDevice.services();
      let notifyFound = false;
      for (const svc of services) {
        const chars = await svc.characteristics();
        for (const c of chars) {
          if (c.uuid.toUpperCase() === CHAR_UUID_NOTIFY) {
            // Notify 구독
            c.monitor((err, char) => {
              if (err) {
                setNotifyData("Notify 오류");
                return;
              }
              if (char?.value) {
                // Base64 to UTF8
                let buf = Buffer.from(char.value, 'base64');
                let str = buf.toString('utf8'); // 필요시 'hex'로
                setNotifyData(str);
              }
            });
            notifyFound = true;
          }
        }
      }
      setConnected(connectedDevice);
      if (!notifyFound) Alert.alert("Notify UUID 미발견", "Notify 캐릭터리스틱이 없습니다.");
      else Alert.alert('연결 성공', device.name || device.id);
    } catch (e) {
      Alert.alert('연결 실패', e?.message || '알 수 없는 오류');
      setConnected(null);
    }
    setConnectingId(null);
  };

  // 초기화/정리
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

  return (
    <View style={{ flex: 1, paddingTop: 48 }}>
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
      {/* 데이터 출력 */}
      {connected && (
        <ScrollView style={{ margin: 20, padding: 10, borderWidth: 1, borderColor: '#aaa', borderRadius: 8, maxHeight: 120 }}>
          <Text style={{ fontWeight: 'bold' }}>Notify 값 (실시간):</Text>
          <Text>{notifyData}</Text>
        </ScrollView>
      )}
    </View>
  );
}
