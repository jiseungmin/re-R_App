// components/bluetooth/BleScanner.js
import { useEffect, useRef } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default function BleScanner({ onDevicesFound, scanTimeout = 8000 }) {
  const managerRef = useRef(new BleManager());

  useEffect(() => {
    const manager = managerRef.current;
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
      await requestPermissions();
      found.clear();
      manager.startDeviceScan(null, null, (err, device) => {
        if (err) return console.warn('BLE Scan Error', err);
        if (device && !found.has(device.id)) {
          found.set(device.id, {
            id: device.id,
            name: device.name || '(No Name)',
            address: device.id,
          });
          onDevicesFound(Array.from(found.values()));
        }
      });

      // 지정 시간 후 스캔 중단
      setTimeout(() => manager.stopDeviceScan(), scanTimeout);
    };

    startScan();
    return () => {
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, [onDevicesFound, scanTimeout]);

  return null; // UI 없음
}
