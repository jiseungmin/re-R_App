import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 버튼 폭 비율
const BUTTON_WIDTH = SCREEN_WIDTH * 0.38;
const BUTTON_HEIGHT = BUTTON_WIDTH * 0.4;

export default function HealthIntroCard({ onNext, onBack }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        {/* 일러스트 + 추천드립니다 + 아이콘 */}
        <View style={styles.illustrationWrap}>
          <Image
            source={require('../../../../assets/images/그룹 3949.png')}
            style={styles.illustration}
          />
          <View style={styles.titleOverlay}>
            <Text style={styles.title}>추천드립니다</Text>
            <Image
              source={require('../../../../assets/images/그룹 3957.png')}
              style={styles.topIcon}
            />
          </View>
        </View>

        {/* 밑줄 */}
        <View style={styles.separator} />

        {/* 설명 */}
        <Text style={styles.desc}>
          홍길동님에게 꼭 필요한 훈련을{'\n'}
          알려드리기 전에 몇 가지 검사가{'\n'}
          필요합니다.{'\n\n'}
          어렵지 않으니 다음 3가지 평가를{'\n'}
          모두 응답해주세요!
        </Text>

        {/* 버튼 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.imageButton}> 
            <Image
              source={require('../../../../assets/images/사각형 49.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.backButtonText}>돌아가기</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('./Description')} style={styles.imageButton}>
            <Image
              source={require('../../../../assets/images/사각형 960.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  centerContent: {
    alignItems: 'center',
    width: '100%',
  },
  illustrationWrap: {
    width: SCREEN_WIDTH * 0.8,      
    height: SCREEN_WIDTH * 0.5,    
    marginBottom: 16,              
    position: 'relative',
  },
  illustration: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: -36,                    
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,                   
    color: '#222',
  },
  topIcon: {
    width: 24,                      
    height: 24,
    resizeMode: 'contain',
  },
  separator: {
    width: SCREEN_WIDTH * 0.75,     
    marginTop: 24,                  
    height: 1.5,                    
    backgroundColor: '#ccc',
    marginBottom: 16,
  },
  desc: {
    fontSize: 16,                   
    color: '#444',
    textAlign: 'left',
    lineHeight: 24,                 
    marginBottom: 20,
    paddingLeft: 8,
    width: SCREEN_WIDTH * 0.8,      
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.85,     
    marginTop: 16,
  },
  imageButton: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    resizeMode: 'contain',
  },
  backButtonText: {
    position: 'absolute',
    fontSize: 16,                   
    color: '#000',
    fontWeight: '600',
  },
  nextButtonText: {
    position: 'absolute',
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
