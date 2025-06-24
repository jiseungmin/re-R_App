import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function PostOnePopup({ onStart }) {
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
            진단정보를 저장했습니다.{'\n'}
            2시간 뒤에 다시 설문이{'\n'} 
            필요하오니, 알림을 받으시면{'\n'}설문에 참여해주십시오.
          </Text>
        </View>

        {/* 하단 버튼 */}
        <TouchableOpacity style={styles.buttonContainer} onPress={onStart}>
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
