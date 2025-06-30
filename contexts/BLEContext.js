import { Buffer } from 'buffer';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { bleManager, BLEUtils } from '../lib/BLE';

const CHAR_UUID_NOTIFY = "0000FFF1-0000-1000-8000-00805F9B34FB";
const CHAR_UUID_WRITE  = "0000FFF2-0000-1000-8000-00805F9B34FB";

const BLEContext = createContext();

export const useBLE = () => {
  const context = useContext(BLEContext);
  if (!context) {
    throw new Error('useBLE must be used within a BLEProvider');
  }
  return context;
};

export const BLEProvider = ({ children }) => {
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

    bleManager.startDeviceScan(null, null, (error, device) => {
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
      bleManager.stopDeviceScan();
      setScanning(false);
    }, 8000);
  };

  // 연결 + Notify 구독 + WriteChar 찾기
  const connect = async (device) => {
    setConnectingId(device.id);
    try {
      const connectedDevice = await bleManager.connectToDevice(device.id, { autoConnect: true });
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

  // 연결 해제
  const disconnect = async () => {
    try {
      if (connected) {
        await connected.cancelConnection();
        setConnected(null);
        setShowControl(false);
        setWriteChar(null);
        setRawData("");
        setMode(null);
        setFlexion(null);
        setExtension(null);
      }
    } catch (e) {
      Alert.alert('연결 해제 실패', e?.message || '알 수 없는 오류');
    }
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

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 스캔 중지
      BLEUtils.stopScan();
    };
  }, []);

  const value = {
    devices,
    scanning,
    connectingId,
    rawData,
    flexion,
    extension,
    mode,
    connected,
    showControl,
    setShowControl,
    scan,
    connect,
    disconnect,
    sendStart,
    sendStop,
  };

  return (
    <BLEContext.Provider value={value}>
      {children}
    </BLEContext.Provider>
  );
}; 