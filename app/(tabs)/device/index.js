// app/device/index.js
import { Stack } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DevicePage() {
  const [devices, setDevices] = useState([
    { id: '1', name: 'BLE_NAME', address: 'CF:D6:B5:27:FD:2E' },
  ]);

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
        <Image
          source={require('../../../assets/images/그룹 104.png')}
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
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 1) 상단 헤더 */}
      <ImageBackground
        source={require('../../../assets/images/그룹 5312.png')}
        style={styles.header}
        imageStyle={styles.headerBg}
        resizeMode="cover"
      >
        {/* 왼쪽: title + button */}
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>기기정보</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              runStutterSpin();
              setDevices([...devices]);
            }}
          >
            <Animated.Image
              source={require('../../../assets/images/그룹 3870.png')}
              style={[styles.refreshIcon, { transform: [{ rotate: spin }] }]}
            />
            <Text style={styles.refreshText}>다시 검색</Text>
          </TouchableOpacity>
        </View>
        {/* 오른쪽: phone icon */}
        <Image
          source={require('../../../assets/images/mobile.png')} // 실제 핸드폰 아이콘 경로로 변경
          style={styles.phoneIcon}
          resizeMode="contain"
        />
      </ImageBackground>

      {/* 2) 리스트 배경 */}
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
