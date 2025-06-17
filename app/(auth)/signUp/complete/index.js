import { useRouter } from 'expo-router';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const unstable_noLayout = true;

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 축하 메시지 */}
        <Text style={styles.greeting}>jiseungmin님,</Text>
        <Text style={styles.greeting}>가입을 축하합니다!</Text>

        {/* 일러스트 이미지 */}
        <Image
        
          source={require('../../../../assets/images/SignUp/complete.png')} // 적절한 경로와 파일명으로 교체하세요
          style={styles.image}
          resizeMode="contain"
        />

        {/* 시작하기 버튼 */}
        <TouchableOpacity style={styles.button} onPress={() => router.push('/exercise')}>
          <Text style={styles.buttonText}>시작하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 300,
    marginVertical: 24,
  },
  button: {
    backgroundColor: '#6573E3',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
