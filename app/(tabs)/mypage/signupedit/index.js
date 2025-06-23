import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Header from '../../../../components/ui/Header';

// 뒤로가기 아이콘 이미지
const ICON_PREVIOUS = require('../../../../assets/images/mypage/previous_arrow.png');

export default function MemberInfoEditScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [hasCondition, setHasCondition] = useState(null);
  const [hadSurgery, setHadSurgery] = useState(null);

  const [surgeryDate, setSurgeryDate] = useState(new Date('2025-05-19'));
  const [showSurgeryPicker, setShowSurgeryPicker] = useState(false);

  const [preKneeAngle, setPreKneeAngle] = useState('');

  const formatDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  };

  const renderRadio = (value, setter) => (
    <View style={styles.radioGroup}>
      {['예', '아니요'].map((label) => {
        const selected = (label === '예') === value;
        return (
          <TouchableOpacity
            key={label}
            style={styles.radioBtn}
            onPress={() => setter(label === '예')}
          >
            <Ionicons
              name={selected ? 'radio-button-on' : 'radio-button-off'}
              size={20}
              color={selected ? '#007AFF' : '#999'}
            />
            <Text style={[styles.radioLabel, selected && { color: '#007AFF' }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <Header title="회원정보수정" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            placeholder="이름 입력"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>휴대폰번호 (ID)</Text>
          <TextInput
            style={styles.input}
            placeholder="휴대폰번호 입력"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>비밀번호 : 8자 이상</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 입력 (변경시)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.label}>비밀번호 확인</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호 입력 확인 (변경시)"
            secureTextEntry
            value={confirmPw}
            onChangeText={setConfirmPw}
          />

          <Text style={styles.label}>가지고 계신 기저질환이 있으신가요?</Text>
          {renderRadio(hasCondition, setHasCondition)}

          <Text style={styles.label}>현재 무릎수술을 받으셨나요?</Text>
          {renderRadio(hadSurgery, setHadSurgery)}

          <Text style={styles.label}>수술일자 변경</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowSurgeryPicker(true)}
          >
            <Text style={styles.inputText}>
              {formatDate(surgeryDate)} (변동없음)
            </Text>
          </TouchableOpacity>

          {hadSurgery && (
            <>
              <Text style={styles.label}>수술 전 무릎 각도 변경</Text>
              <TextInput
                style={styles.input}
                placeholder="각도 입력"
                keyboardType="numeric"
                value={preKneeAngle}
                onChangeText={setPreKneeAngle}
              />
            </>
          )}

           <TouchableOpacity
          style={styles.submitButton}
          onPress={() => {
            // TODO: handle submit logic
          }}
        >
          <Text style={styles.submitButtonText}>정보 수정 완료</Text>
        </TouchableOpacity>
        </ScrollView>

        {showSurgeryPicker && (
          <DateTimePicker
            value={surgeryDate}
            mode="date"
            display="spinner"
            onChange={(e, selected) => {
              setShowSurgeryPicker(false);
              if (selected) setSurgeryDate(selected);
            }}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 5
  },
  content: { padding: 16, paddingBottom: 32 },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 12,
    marginBottom: 16,
  },
  inputText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  radioGroup: { flexDirection: 'row', marginBottom: 16 },
  radioBtn: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
  radioLabel: { marginLeft: 6, fontSize: 16, fontWeight: 'bold', color: '#555' },
  submitButton: {
    marginTop: 20,
    backgroundColor: '#6573E3',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});