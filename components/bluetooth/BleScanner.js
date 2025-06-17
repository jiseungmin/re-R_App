import { useEffect, useRef, useState } from 'react';
import { FlatList, Image, ImageBackground, PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

export default function BleScanner({ onDevicesFound, onScanComplete }) {
  const [devices, setDevices] = useState([]);
  const bleManagerRef = useRef(null);

  useEffect(() => {
    bleManagerRef.current = new BleManager();

    requestPermissions().then(() => {
      startScan();
    });

    return () => {
      bleManagerRef.current?.stopDeviceScan();
      bleManagerRef.current?.destroy();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    }
  };

  const startScan = () => {
    const found = new Map();

    bleManagerRef.current?.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn('BLE Scan Error:', error);
        return;
      }

      if (device && device.name && !found.has(device.id)) {
        found.set(device.id, {
          id: device.id,
          name: device.name,
          address: device.localName || device.id,
        });

        const foundList = Array.from(found.values());
        setDevices(foundList);
        onDevicesFound?.(foundList);
      }
    });

    setTimeout(() => {
      bleManagerRef.current?.stopDeviceScan();
      onScanComplete?.();
    }, 10000);
  };

  const renderItem = ({ item }) => (
    <ImageBackground
      source={require('../../assets/images/사각형 900.png')}
      style={styles.cardBg}
      imageStyle={styles.cardRadius}
      resizeMode="stretch"
    >
      <View style={styles.deviceCard}>
        <Image
          source={require('../../assets/images/previous_arrow.png')}
          style={styles.deviceIcon}
        />
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{item.name}</Text>
          <Text style={styles.deviceAddress}>{item.address}</Text>
        </View>
      </View>
    </ImageBackground>
  );

  return (
    <FlatList
      data={devices}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
    listContent: { paddingBottom: 24 },
    cardBg: { width: '100%', paddingTop: 15, paddingBottom: 15 },
    cardRadius: { borderRadius: 16 },
    deviceCard: { flexDirection: 'row', alignItems: 'center' },
    deviceIcon: {
      width: 32,
      height: 32,
      marginLeft: 12,
      marginRight: 12,
      resizeMode: 'contain',
    },
    deviceInfo: { flex: 1 },
    deviceName: { fontSize: 14, fontWeight: '350', color: '#333' },
    deviceAddress: { fontSize: 8, color: '#666', marginTop: 1, marginBottom: 4 },
  });
  