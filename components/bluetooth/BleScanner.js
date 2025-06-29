// components/bluetooth/BleScanner.js
import { useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default function BleScanner({ 
  onDevicesFound, 
  onScanningChange, 
  scanTimeout = 8000,
  autoStart = true 
}) {
  const managerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);

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
      setIsScanning(true);
      onScanningChange?.(true);
      
      if (!managerRef.current) {
        managerRef.current = new BleManager();
      }
      
      await requestPermissions();
      
      const found = new Map();
      
      managerRef.current.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error("BLE 스캔 오류:", error.message);
          setIsScanning(false);
          onScanningChange?.(false);
          return;
        }
        if (device && device.id) {
          if (!found.has(device.id)) {
            found.set(device.id, device);
            onDevicesFound(Array.from(found.values()));
          }
        }
      });
      
      setTimeout(() => {
        if (managerRef.current) {
          managerRef.current.stopDeviceScan();
        }
        setIsScanning(false);
        onScanningChange?.(false);
      }, scanTimeout);
    } catch (e) {
      console.error("BLE 스캔 시작 오류:", e.message);
      setIsScanning(false);
      onScanningChange?.(false);
    }
  };

  const stopScan = () => {
    if (managerRef.current) {
      managerRef.current.stopDeviceScan();
    }
    setIsScanning(false);
    onScanningChange?.(false);
  };

  useEffect(() => {
    if (autoStart) {
      startScan();
    }
    
    return () => {
      if (managerRef.current) {
        managerRef.current.stopDeviceScan();
        managerRef.current.destroy();
      }
    };
  }, [autoStart]);

  return {
    startScan,
    stopScan,
    isScanning
  };
}
