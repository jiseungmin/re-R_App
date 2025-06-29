import { Buffer } from 'buffer';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const CHAR_UUID_NOTIFY = "0000FFF1-0000-1000-8000-00805F9B34FB";
const CHAR_UUID_WRITE  = "0000FFF2-0000-1000-8000-00805F9B34FB";

export default function useBleConnection() {
  const [connected, setConnected] = useState(null);
  const [connectingId, setConnectingId] = useState(null);
  const [rawData, setRawData] = useState("");
  const [flexion, setFlexion] = useState(null);
  const [extension, setExtension] = useState(null);
  const [mode, setMode] = useState(null);
  const [writeChar, setWriteChar] = useState(null);
  const [showControl, setShowControl] = useState(false);

  const managerRef = useRef(null);

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

  const disconnect = () => {
    setConnected(null);
    setConnectingId(null);
    setRawData("");
    setFlexion(null);
    setExtension(null);
    setMode(null);
    setWriteChar(null);
    setShowControl(false);
  };

  return {
    connected,
    connectingId,
    rawData,
    flexion,
    extension,
    mode,
    writeChar,
    showControl,
    setShowControl,
    connect,
    sendStart,
    sendStop,
    disconnect
  };
} 