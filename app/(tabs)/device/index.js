import React, { useState, useRef } from 'react';
import {
  SafeAreaView, View, Text, StyleSheet, ImageBackground, Image,
  Animated, TouchableOpacity, FlatList, Dimensions
} from 'react-native';
import { Stack } from 'expo-router';
import BleScanner from '../../../components/bluetooth/BleScanner'; // ⬅ 추가

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Device() {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);

  const spinValue = useRef(new Animated.Value(0)).current;

  const runStutterSpin = () => {
    spinValue.setValue(0);
    Animated.sequence([
      Animated.timing(spinValue, { toValue: 60, duration: 400, useNativeDriver: true }),
      Animated.delay(200),
      Animated.timing(spinValue, { toValue: 180, duration: 400, useNativeDriver: true }),
      Animated.delay(200),
      Animated.timing(spinValue, { toValue: 270, duration: 400, useNativeDriver: true }),
      Animated.delay(200),
      Animated.timing(spinValue, { toValue: 720, duration: 720, useNativeDriver: true }),
      Animated.delay(200),
    ]).start(() => spinValue.setValue(0));
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const renderItem = ({ item }) => (
    <ImageBackground
      source={require('../../../assets/images/사각형 900.png')}
      style={styles.cardBg}
      imageStyle={styles.cardRadius}
      resizeMode="stretch"
    >
      <View style={styles.deviceCard}>
        <Image source={require('../../../assets/images/그룹 4321.png')} style={styles.deviceIcon} />
        <View style={styles.deviceInfo}>
          <Text style={styles.deviceName}>{item.name}</Text>
          <Text style={styles.deviceAddress}>{item.address}</Text>
        </View>
      </View>
    </ImageBackground>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 헤더 */}
      <ImageBackground
        source={require('../../../assets/images/그룹 5312.png')}
        style={styles.header}
        imageStyle={styles.headerBg}
        resizeMode="cover"
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>기기정보</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              runStutterSpin();
              setScanning(true); // BLE 검색 트리거
            }}
          >
            <Animated.Image
              source={require('../../../assets/images/그룹 3870.png')}
              style={[styles.refreshIcon, { transform: [{ rotate: spin }] }]}
            />
            <Text style={styles.refreshText}>다시 검색</Text>
          </TouchableOpacity>
        </View>
        <Image source={require('../../../assets/images/mobile.png')} style={styles.phoneIcon} resizeMode="contain" />
      </ImageBackground>

      {/* 기기 리스트 */}
      <ImageBackground
        source={require('../../../assets/images/사각형 2154.png')}
        style={styles.listBg}
        imageStyle={styles.listRadius}
        resizeMode="stretch"
      >
        <FlatList
          data={devices}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </ImageBackground>

      {/* BLE 검색 컴포넌트 (비시각적) */}
      {scanning && (
        <BleScanner onDevicesFound={(foundDevices) => {
          // foundDevices가 배열일 때는 기존 코드 유지
          // 단일 기기일 경우 배열에 추가
          if (Array.isArray(foundDevices)) {
            setDevices(foundDevices);
          } else {
            setDevices(prevDevices => {
              const exists = prevDevices.find(d => d.id === foundDevices.id);
              if (exists) return prevDevices;
              return [...prevDevices, foundDevices];
            });
          }
          setScanning(false);
        }} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    width: SCREEN_WIDTH,
    aspectRatio: 375 / 180,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  headerBg: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '400',
    marginTop: 30,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop:30
  },
  refreshIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    resizeMode: 'contain',
  },
  refreshText: {
    fontSize: 14,
    color: '#000',
  },

  listBg: {
    flex: 1,
    marginTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10,
    marginRight: 10,     // 헤더의 '다시 검색' 버튼이 겹치도록
    paddingTop: 16,
  },
  listRadius: {
    borderRadius: 16,
  },
  listContent: {
    paddingBottom: 24,
  },

  cardBg: {
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15,
  },

  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIcon: {
    width: 32,
    height: 32,
    marginLeft: 12,
    marginRight: 12,
    resizeMode: 'contain',
  },
  deviceInfo: { flex: 1 },
  deviceName: {
    fontSize: 14,
    fontWeight: '350',
    color: '#333',
  },
    phoneIcon: {
    width: '60%',
    height: '60%',
    marginTop: 16,
    marginRight: -50,
  },
  deviceAddress: {
    fontSize: 8,
    color: '#666',
    marginTop: 1,
    marginBottom: 4,
  },
});

