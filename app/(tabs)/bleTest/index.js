import React, { useEffect, useRef } from 'react';
import {
  Animated, Dimensions,
  FlatList,
  Image, ImageBackground,
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView, StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBLE } from '../../../contexts/BLEContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CHAR_UUID_NOTIFY = "0000FFF1-0000-1000-8000-00805F9B34FB";
const CHAR_UUID_WRITE  = "0000FFF2-0000-1000-8000-00805F9B34FB";

export default function BLETestScreen() {
  const spinValue = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  // BLE Context 사용
  const {
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
  } = useBLE();

  // 스핀 애니메이션
  const runStutterSpin = () => {
    spinValue.setValue(0);
    Animated.sequence([
      Animated.timing(spinValue, { toValue: 60, duration: 300, useNativeDriver: true }),
      Animated.delay(100),
      Animated.timing(spinValue, { toValue: 180, duration: 300, useNativeDriver: true }),
      Animated.delay(100),
      Animated.timing(spinValue, { toValue: 360, duration: 400, useNativeDriver: true }),
    ]).start();
  };
  const spin = spinValue.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });

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

  // 스캔 상태 변경 시 애니메이션 실행
  useEffect(() => {
    if (scanning) {
      runStutterSpin();
    }
  }, [scanning]);

  // 화면 진입시 자동 스캔
  useEffect(() => {
    scan();
  }, []);

  // 새로고침 버튼
  const onRefresh = () => {
    scan();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <ImageBackground
        source={require('../../../assets/images/그룹 5312.png')}
        style={styles.header}
        imageStyle={styles.headerBg}
      >
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>BLE 테스트</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
            <Animated.Image
              source={require('../../../assets/images/그룹 3870.png')}
              style={[styles.refreshIcon, { transform: [{ rotate: spin }] }]}
            />
            <Text style={styles.refreshText}>다시 검색</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../../../assets/images/mobile.png')}
          style={styles.phoneIcon}
          resizeMode="contain"
        />
      </ImageBackground>

      {/* 검색 중 안내 */}
      {scanning ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>기기 검색 중...</Text>
        </View>
      ) : (
        // 기기 리스트
        <ImageBackground
          source={require('../../../assets/images/사각형 2154.png')}
          style={styles.listBg}
          imageStyle={styles.listRadius}
        >
          <FlatList
            data={devices}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.cardBg,
                  connected && connected.id === item.id && { backgroundColor: '#d9f99d' }
                ]}
                onPress={() => connect(item)}
                activeOpacity={0.7}
                disabled={connectingId || (connected && connected.id === item.id)}
              >
                <View style={styles.deviceCard}>
                  <Image
                    source={require('../../../assets/images/phone.png')}
                    style={styles.deviceIcon}
                  />
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{item.name || '(No Name)'}</Text>
                    <Text style={styles.deviceAddress}>{item.id}</Text>
                    {connectingId === item.id && <Text style={{color:'#34d399'}}>연결 중...</Text>}
                    {connected && connected.id === item.id && <Text style={{color:'#22c55e'}}>연결됨</Text>}
                  </View>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:24 }}>기기를 찾을 수 없습니다.</Text>}
          />
        </ImageBackground>
      )}

      {/* 연결 상태 및 데이터 표시 */}
      {connected && (
        <View style={[styles.dataContainer, { marginBottom: insets.bottom + 16 }]}>
          <Text style={styles.dataTitle}>연결됨: {connected.name || '(No Name)'}</Text>
          <Text style={styles.dataText}>ID: {connected.id}</Text>
          <Text style={styles.dataText}>패킷(raw): {rawData}</Text>
          {mode !== null && (
            <View style={{marginTop: 6}}>
              <Text style={styles.dataText}>모드: {mode} ({'0x'+mode.toString(16)})</Text>
              <Text style={styles.dataText}>Flexion(구부림): {flexion} 도</Text>
              <Text style={styles.dataText}>Extension(펴짐): {extension} 도</Text>
            </View>
          )}
        </View>
      )}

      {/* 연결 후 제어용 Modal */}
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
            backgroundColor: '#fff', 
            padding: 24, 
            borderRadius: 14, 
            minWidth: 260, 
            alignItems: 'center'
          }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>BLE 장치 제어</Text>
            {/* 실시간 각도/모드 출력 */}
            {mode !== null && (
              <View style={{marginBottom: 12, alignItems: 'center'}}>
                <Text>모드: {mode} ({'0x'+mode.toString(16)})</Text>
                <Text>Flexion(구부림): {flexion} 도</Text>
                <Text>Extension(펴짐): {extension} 도</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={sendStart}
              style={{
                backgroundColor: '#22c55e',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
                marginBottom: 8,
                minWidth: 120,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>START</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sendStop}
              style={{
                backgroundColor: '#ef4444',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
                marginBottom: 8,
                minWidth: 120,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>STOP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                disconnect();
                setShowControl(false);
              }}
              style={{
                backgroundColor: '#6b7280',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 8,
                minWidth: 120,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>연결 해제</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  headerLeft: { flexDirection: 'column' },
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
    marginTop: 10,
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
  phoneIcon: {
    width: '60%',
    height: '60%',
    marginTop: 16,
    marginRight: -50,
  },

  listBg: {
    flex: 1,
    margin: 10,
    paddingTop: 16,
  },
  listRadius: {
    borderRadius: 16,
  },
  listContent: {
    paddingBottom: 24,
  },

  cardBg: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    height: 64,
    justifyContent: 'center',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIcon: {
    width: 32,
    height: 32,
    marginRight: 12,
    resizeMode: 'contain',
  },
  deviceInfo: { flex: 1 },
  deviceName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  deviceAddress: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },

  dataContainer: {
    padding: 16,
    backgroundColor: '#eef',
    marginHorizontal: 10,
    borderRadius: 10,
  },
  dataTitle: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  dataText: { fontSize: 12, color: '#333', marginBottom: 8 },
});
