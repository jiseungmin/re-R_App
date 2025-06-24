import { useRouter } from 'expo-router';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function PostTwoPopup({ onStart }) {
  const router = useRouter();
  
  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        {/* 콘텐츠 영역 */}
        <View style={styles.content}>
          <Image
            source={require('../../assets/images/healthcare_briefing.png')}
            style={styles.image}
          />
          <Text style={styles.desc}>
            전문의의 진단을 필요로 합니다.{'\n'}
            지금부터 모든 운동 프로그램은{'\n'} 
            전원 중단되며, 외래 병원에{'\n'}
            방문 및 정밀 진단 후에 다시{'\n'} 
            시작하실 수 있습니다.
          </Text>
          {/* <Text style={styles.desc}>
            진단결과 운동 진행에 어려움이{'\n'}
            있는 것으로 판단되어 운동의{'\n'} 
            강도를 낮추겠습니다. 이후의{'\n'}
            프로그램은 난이도가 조정된{'\n'} 
            훈련으로 이루어집니다.
          </Text> */}
        </View>

        {/* 하단 버튼 */}
        <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {
                    onStart(); // 팝업 닫기 or 전달받은 함수 실행
                    router.push('/exercise'); // 다음 화면으로 이동
                }}
                >
          <Image
            source={require('../../assets/images/사각형 974.png')}
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: width * 0.8,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    height: 400,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  desc: {
    marginTop:10,
    fontSize: 18,
    color: '#333',
    lineHeight: 22,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    position: 'relative',
  },
  buttonImage: {
    width: 300,
    height: 44,
    resizeMode: 'contain',
  },
  buttonText: {
    position: 'absolute',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
});
