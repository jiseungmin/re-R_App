import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import KneeAnglePopup from '../../../../components/popup/anglePopup';
import Header from '../../../../components/ui/Header';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function KneeAngleMeasurement() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  // 화면 진입시 팝업 열기
  useEffect(() => {
    setShowPopup(true);
  }, []);

  return (
    <>
      {/* Modal을 최상단에, 상태바까지 덮도록 statusBarTranslucent 추가 */}
      <Modal
        visible={showPopup}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <KneeAnglePopup onStart={() => setShowPopup(false)} />
          </View>
        </View>
      </Modal>

      <SafeAreaView style={styles.container}>
        {/* 1. Header */}
        <Header title="무릎 각도" />

        {/* 2. Content */}
        <View style={styles.content}>
          {/* 2-1. Title area */}
          <View style={styles.titleArea}>
            <Text style={styles.mainTitle}>측정하기</Text>
            <Text style={styles.subtitle}>측정 설명 내용</Text>
          </View>

          {/* 2-2. Illustration box */}
          <View style={styles.imageBox}>
            <Image
              source={require('../../../../assets/images/그룹 3974.png')}
              style={styles.kneeImage}
            />
            <Text style={styles.caption}>
              무릎을 최대한 <Text style={styles.highlight}>굽혀</Text> 보세요
            </Text>
          </View>

          {/* 2-3. 측정하기 버튼 */}
          <TouchableOpacity
            style={styles.measureButton}
            onPress={() => router.push('./kneeAngleScreen')}
            activeOpacity={0.8}
          >
            <Text style={styles.measureButtonText}>측정하기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  titleArea: {
    width: '100%',
    marginTop: 40,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textDecorationLine: 'underline',
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    marginTop: 16,
  },
  imageBox: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
  },
  kneeImage: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.4,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  caption: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  highlight: {
    color: '#4f6dff',
    fontWeight: 'bold',
  },
  measureButton: {
    width: '90%',
    height: 48,
    backgroundColor: '#4f6dff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 64,
  },
  measureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // 팝업 오버레이: 절대 위치로 최상단부터 바닥까지 완전히 덮기
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
});
