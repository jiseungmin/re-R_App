import { useRouter } from 'expo-router';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LandingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../../assets/images/landing/그룹 5409.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Illustration */}
      <Image
        source={require('../../assets/images/landing/그룹 5295.png')}
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Buttons */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/exercise')}
        >
          <Text style={styles.primaryText}>둘러보기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/signIn')}
        >
          <Text style={styles.secondaryText}>로그인 및 회원가입</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    alignSelf: "center",
    tintColor: '#6573E3',
    marginTop: 20,
  },
  illustration: {
    flex: 1,
    width: '80%',
  },
  buttonGroup: {
    width: '100%',
    paddingHorizontal: 24,
    marginBottom: 60,
  },
  primaryButton: {
    backgroundColor: '#6573E3',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#6573E3',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    color: '#6573E3',
    fontSize: 16,
    fontWeight: '600',
  },
});
