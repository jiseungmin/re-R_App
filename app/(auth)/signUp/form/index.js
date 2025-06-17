import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SignUpFormScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isValid =
    name.trim().length > 0 &&
    phone.trim().length > 0 &&
    gender.length > 0 &&
    password.length >= 8 &&
    password.length <= 16 &&
    password === confirmPassword;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>아이디 생성</Text>

        {/* 이름 */}
        <View style={styles.field}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            placeholder="이름 입력"
            placeholderTextColor="#C7C7C7"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* 휴대폰번호 (ID) */}
        <View style={styles.field}>
          <Text style={styles.label}>휴대폰번호(ID)</Text>
          <TextInput
            style={styles.input}
            placeholder="휴대전화 번호 입력"
            placeholderTextColor="#C7C7C7"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* 성별 선택 */}
        <View style={styles.field}>
          <Text style={styles.label}>성별 선택</Text>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === '남성' && styles.genderSelected,
              ]}
              onPress={() => setGender('남성')}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === '남성' && styles.genderTextSelected,
                ]}
              >
                남성
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderButton,
                gender === '여성' && styles.genderSelected,
              ]}
              onPress={() => setGender('여성')}
            >
              <Text
                style={[
                  styles.genderText,
                  gender === '여성' && styles.genderTextSelected,
                ]}
              >
                여성
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 비밀번호 */}
        <View style={styles.field}>
          <Text style={styles.label}>비밀번호 (8자 이상, 16자 이내)</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 입력"
            placeholderTextColor="#C7C7C7"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* 비밀번호 확인 */}
        <View style={styles.field}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 확인용 입력"
            placeholderTextColor="#C7C7C7"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>
      </ScrollView>

      {/* Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: isValid ? '#6573E3' : '#CCCCCC' },
          ]}
          disabled={!isValid}
          onPress={() => router.push('/signUp/health')}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textDecorationLine: 'underline',
    color: '#333333',
    marginBottom: 32,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#444444',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
    fontSize: 16,
    color: '#333333',
    paddingVertical: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#888888',
    borderRadius: 4,
    overflow: 'hidden',
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  genderSelected: {
    backgroundColor: '#6573E3',
  },
  genderText: {
    fontSize: 14,
    color: '#333333',
  },
  genderTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  nextButton: {
    width: width - 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
