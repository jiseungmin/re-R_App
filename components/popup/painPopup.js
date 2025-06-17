import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function KneeAnglePopup({ onStart }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        {/* 콘텐츠 영역 */}
        <View style={styles.content}>
          <Image
            source={require('../../assets/images/그룹 4806.png')}
            style={styles.image}
          />
          <Text style={styles.title}>〈무릎각도 측정〉</Text>
          <Text style={styles.desc}>
            첫번째 검사로 <Text style={{ fontWeight: 'bold', color: '#007bff' }}>무릎각도</Text>를{'\n'}
            측정해 보겠습니다.
          </Text>
        </View>

        {/* 하단 버튼 */}
        <TouchableOpacity style={styles.buttonContainer} onPress={onStart}>
          <Image
            source={require('../../assets/images/사각형 974.png')}
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>시작하기</Text>
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
    marginTop: 20,
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
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
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
