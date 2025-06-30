import { Buffer } from 'buffer';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const CHAR_UUID_NOTIFY = "0000FFF1-0000-1000-8000-00805F9B34FB";
const CHAR_UUID_WRITE  = "0000FFF2-0000-1000-8000-00805F9B34FB";

export default function BLETestScreen() {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [connectingId, setConnectingId] = useState(null);
  const [rawData, setRawData] = useState("");
  const [flexion, setFlexion] = useState(null);
  const [extension, setExtension] = useState(null);
  const [mode, setMode] = useState(null);
  const [connected, setConnected] = useState(null);
  const [showControl, setShowControl] = useState(false);
  const [writeChar, setWriteChar] = useState(null);

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

  // 연결 + Notify 구독 + WriteChar 찾기
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

      {/* 연결 후 제어용 Modal */}
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
    </View>
  );
}