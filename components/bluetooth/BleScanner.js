// components/bluetooth/BleScanner.js
import { useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default function BleScanner({ onDevicesFound, scanTimeout = 8000 }) {
  const managerRef = useRef(null);

  useEffect(() => {
    const manager = new BleManager();
    managerRef.current = manager;
    const found = new Map();

    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
      }
    };

    const startScan = async () => {
      try {
        await requestPermissions();
        found.clear();
        
        manager.startDeviceScan(null, null, (error, device) => {
          if (error) {
            console.error("BLE 스캔 오류:", error.message);
            return;
          }
          if (device && device.id) {
            if (!found.has(device.id)) {
              found.set(device.id, device);
              // onDevicesFound에 객체 배열로 전달
              onDevicesFound(Array.from(found.values()));
            }
          }
        });
        
        setTimeout(() => {
          manager.stopDeviceScan();
        }, scanTimeout);
      } catch (e) {
        console.error("BLE 스캔 시작 오류:", e.message);
      }
    };

    startScan();
    
    return () => {
      if (managerRef.current) {
        managerRef.current.stopDeviceScan();
        managerRef.current.destroy();
      }
    };
  }, [onDevicesFound, scanTimeout]);

  return null; // UI 없음
}
