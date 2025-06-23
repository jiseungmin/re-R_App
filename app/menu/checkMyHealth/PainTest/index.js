// app/(tabs)/PainScaleScreen.js
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
  View
} from 'react-native';
import PainPopup from '../../../../components/popup/painPopup';
import Header from '../../../../components/ui/Header';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = SCREEN_WIDTH;

export default function PainScaleScreen() {
  const router = useRouter();
  const [showPopup, setShowPopup] = useState(false);

  // 화면 진입시 팝업 열기
  useEffect(() => {
    setShowPopup(true);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
    {/* Header */}
       <Header title="통증 테스트" />
      <Modal
        visible={showPopup}
        animationType="fade"
        transparent
        statusBarTranslucent
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            {/* PainPopup 컴포넌트에 onClose 핸들러 전달 */}
            <PainPopup onStart={() => setShowPopup(false)} />
          </View>
        </View>
      </Modal>
      
  

      {/* Description */}
      <View style={styles.descBox}>
        <Text style={styles.descText}>
          통증이 없을 때는 <Text style={styles.zero}>"0"</Text>{'\n'}
          참을 수 없는 통증을 <Text style={styles.ten}>"10"{'\n'}</Text>이라고 했을 때,{'\n'}
          해당하는 통증 정도를{'\n'} 선택해 주세요
        </Text>
      </View>

      {/* Pain scale 이미지 */}
      <Image
        source={require('../../../../assets/images/pain.png')}
        style={styles.scaleImage}
        resizeMode="contain"
      />

      {/* Submit */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('./PainTest/movepain')}
      >
        <Text style={styles.buttonText}>측정하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    marginBottom: 64,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  descBox: {
    backgroundColor: '#F2F2F2',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 32,
  },
  descText: {
    textAlign: 'center',
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: 0.5,
    color: '#333',
    fontWeight: '500',
  },
  zero: {
    color: '#4F6EFF',
    fontWeight: '700',
  },
  ten: {
    color: '#FF4E42',
    fontWeight: '700',
  },
  scaleImage: {
    width: BAR_WIDTH * 0.9,
    height: BAR_WIDTH * 0.9,
    marginTop:-50
  },
  button: {
    width: BAR_WIDTH * 0.8,
    height: 48,
    backgroundColor: '#4F6EFF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -40,    // 버튼만 이미지 쪽으로 끌어당깁니다
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  popupOverlay: {
    flex: 1,
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
