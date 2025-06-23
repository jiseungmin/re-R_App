// app/(tabs)/kneeAngleManual.js
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Header from '../../../../components/ui/Header';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function KneeAngleManual() {
  const router = useRouter();
  const [angle, setAngle] = useState('');

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView style={styles.inner}>
          {/* Header */}
          <Header title="무릎각도 수동측정" />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title & Illustration */}
            <View style={styles.content}>
              <Text style={styles.title}>무릎각도 수동측정</Text>
              <Text style={styles.subtitle}>다음과 같이 각도를 재주세요</Text>
              <Image
                source={require('../../../../assets/images/checkMyHealth/knee_manual.png')}
                style={styles.image}
              />
            </View>

            {/* Input Card */}
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>
                측정 후 최대 각도를{'\n'}입력해 주십시오.
              </Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  value={angle}
                  onChangeText={setAngle}
                  returnKeyType="done"
                  onSubmitEditing={Keyboard.dismiss}
                />
                <Text style={styles.suffix}>Deg</Text>
              </View>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Keyboard.dismiss();
                console.log('각도:', angle);
                router.push('./PainTest')
              }}
            >
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1 },
  backBtn: { width: 28, justifyContent: 'center' },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 20, // 키보드 있을 때도 스크롤 여유
    backgroundColor: '#fff', // ← 흰색 배경
  },

  content: {
    alignItems: 'center',
    paddingTop: 24,
  },
  title: { fontSize: 24, fontWeight: '700', color: '#000' },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 64,
    textAlign: 'center',
  },
  image: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.5,
    resizeMode: 'contain',
    marginBottom: 32,
  },

  inputCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 80,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 4,
    fontSize: 18,
    textAlign: 'center',
  },
  suffix: {
    fontSize: 18,
    color: '#444',
    marginLeft: 8,
    fontWeight: '700',
  },

  button: {
    backgroundColor: '#4f6dff',
    borderRadius: 24,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
