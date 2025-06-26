import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Button, Alert, Platform, PermissionsAndroid, ScrollView
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const CHAR_UUID_NOTIFY = "0000FFF1-0000-1000-8000-00805F9B34FB"; // HLK Notify UUID

export default function BLETestScreen() {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [connectingId, setConnectingId] = useState(null);
  const [rawData, setRawData] = useState("");       // 원본 hex
  const [flexion, setFlexion] = useState(null);     // 구부림 각도
  const [extension, setExtension] = useState(null); // 펴짐 각도
  const [mode, setMode] = useState(null);           // 동작 모드 (ex: 0x51)
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

  // 연결 + Notify 수신
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
                setRawData("Notify 오류");
                return;
              }
              if (char?.value) {
                // base64 -> buffer
                let buf = Buffer.from(char.value, 'base64');
                // 전체 hex
                setRawData(buf.toString('hex'));
                // 패킷 길이 확인
                if (buf.length >= 10) {
                  // 예시: [0] 0xff [1] 0xfe [2] id [3] size [4] checksum [5] mode [6] flexion [7] extension
                  const header = buf.readUInt16BE(0); // 0xFFFE
                  const id = buf[2];
                  const size = buf[3];
                  const checksum = buf[4];
                  const modeVal = buf[5];
                  const flexVal = buf[6];
                  const extVal = buf[7];
                  setMode(modeVal);
                  setFlexion(flexVal); // (0~176도)
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
    </View>
  );
}
