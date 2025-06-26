import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Button, Alert, ScrollView, Modal, StyleSheet, Dimensions } from 'react-native';
import BleScanner from '../../../components/bluetooth/BleScanner';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

// Buffer polyfill (Expo 환경)
if (typeof global.Buffer === 'undefined') global.Buffer = Buffer;

const CHAR_UUID_NOTIFY = "0000FFF1-0000-1000-8000-00805F9B34FB";
const CHAR_UUID_WRITE  = "0000FFF2-0000-1000-8000-00805F9B34FB";

export default function Device() {
  const [devices, setDevices] = useState([]);
  const [connectingId, setConnectingId] = useState(null);
  const [rawData, setRawData] = useState('');
  const [flexion, setFlexion] = useState(null);
  const [extension, setExtension] = useState(null);
  const [mode, setMode] = useState(null);
  const [connected, setConnected] = useState(null);
  const [writeChar, setWriteChar] = useState(null);
  const [showControl, setShowControl] = useState(false);

  const managerRef = useRef(new BleManager());

  // BLE 연결 및 데이터 수신
  const connect = async (device) => {
    setConnectingId(device.id);
    try {
      const connectedDevice = await managerRef.current.connectToDevice(device.id, { autoConnect: true });
      await connectedDevice.discoverAllServicesAndCharacteristics();

      const services = await connectedDevice.services();
      let foundNotify = null, foundWrite = null;
      for (const svc of services) {
        const chars = await svc.characteristics();
        for (const c of chars) {
          if (c.uuid.toUpperCase() === CHAR_UUID_NOTIFY) foundNotify = c;
          if (c.uuid.toUpperCase() === CHAR_UUID_WRITE) foundWrite = c;
        }
      }
      if (foundNotify) {
        foundNotify.monitor((err, char) => {
          if (err) {
            setRawData("Notify 오류");
            setFlexion(null); setExtension(null); setMode(null); return;
          }
          if (char?.value) {
            let buf = Buffer.from(char.value, 'base64');
            setRawData(buf.toString('hex'));
            if (buf.length >= 10) {
              setMode(buf[5]);
              setFlexion(buf[6]);
              setExtension(buf[7]);
            } else {
              setMode(null); setFlexion(null); setExtension(null);
            }
          }
        });
      }
      setWriteChar(foundWrite || null);
      setConnected(connectedDevice);
      setShowControl(true);
    } catch (e) {
      Alert.alert('연결 실패', e?.message || 'BLE 연결 오류');
      setConnected(null);
    }
    setConnectingId(null);
  };

  // START/STOP 명령
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

  // 화면 구성
  return (
    <View style={{ flex: 1, paddingTop: 48 }}>
      {/* BLE Scanner - 스캔만 */}
      <BleScanner onDevicesFound={setDevices} scanTimeout={8000} />

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
          <View style={{flexDirection:'row', marginTop:8}}>
            <TouchableOpacity
              onPress={sendStart}
              style={{backgroundColor:'#22c55e',borderRadius:8,padding:8,marginRight:8}}
              disabled={!writeChar}
            >
              <Text style={{color:'#fff'}}>START</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sendStop}
              style={{backgroundColor:'#e11d48',borderRadius:8,padding:8}}
              disabled={!writeChar}
            >
              <Text style={{color:'#fff'}}>STOP</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Modal: BLE 컨트롤용 */}
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
