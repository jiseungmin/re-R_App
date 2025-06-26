import { useEffect, useRef } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
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
      try {
        await requestPermissions();
        found.clear();
        manager.startDeviceScan(null, null, (err, device) => {
          if (err) {
            Alert.alert("스캔 오류", err.message || String(err));
            return;
          }
          if (device && !found.has(device.id)) {
            found.set(device.id, {
              id: device.id,
              name: device.name || '(No Name)',
              address: device.id,
            });
            onDevicesFound(Array.from(found.values()));
          }
        });
        setTimeout(() => manager.stopDeviceScan(), scanTimeout);
      } catch (e) {
        Alert.alert("BLE 오류", e.message || String(e));
      }
    };

    startScan();
    return () => {
      manager.stopDeviceScan();
      manager.destroy();
    };
  }, [onDevicesFound, scanTimeout]);

  return null; // UI 없음
}
