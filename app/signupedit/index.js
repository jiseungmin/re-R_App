// MemberInfoEditScreen.js
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function MemberInfoEditScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [hasCondition, setHasCondition] = useState(null);
  const [hadSurgery, setHadSurgery]     = useState(null);

  // ▶ 수술일자용 DatePicker 상태
  const [surgeryDate, setSurgeryDate]       = useState(new Date('2025-05-19'));
  const [showSurgeryPicker, setShowSurgeryPicker] = useState(false);

  const [preKneeAngle, setPreKneeAngle] = useState('');

  // 날짜 포맷: YYYY.MM.DD
  const formatDate = d => {
    const y   = d.getFullYear();
    const m   = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  };

  const renderRadio = (value, setter) => (
    <View style={styles.radioGroup}>
      {['예','아니요'].map(label => {
        const selected = (label==='예') === value;
        return (
          <TouchableOpacity
            key={label}
            style={styles.radioBtn}
            onPress={() => setter(label==='예')}
          >
            <Ionicons
              name={ selected ? 'radio-button-on' : 'radio-button-off' }
              size={20}
              color={ selected ? '#007AFF' : '#999' }
            />
            <Text style={[styles.radioLabel, selected && { color:'#007AFF' }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>회원정보수정</Text>

        {/* 이름 */}
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          placeholder="이름 입력"
          value={name}
          onChangeText={setName}
        />

        {/* 휴대폰 */}
        <Text style={styles.label}>휴대폰번호 (ID)</Text>
        <TextInput
          style={styles.input}
          placeholder="휴대폰번호 입력"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        {/* 비밀번호 */}
        <Text style={styles.label}>비밀번호 : 8자 이상</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 입력 (변경시)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* 비밀번호 확인 */}
        <Text style={styles.label}>비밀번호 확인</Text>
        <TextInput
          style={styles.input}
          placeholder="비밀번호 입력 확인 (변경시)"
          secureTextEntry
          value={confirmPw}
          onChangeText={setConfirmPw}
        />

        {/* 기저질환 */}
        <Text style={styles.label}>가지고 계신 기저질환이 있으신가요?</Text>
        {renderRadio(hasCondition, setHasCondition)}

        {/* 수술 여부 */}
        <Text style={styles.label}>현재 무릎수술을 받으셨나요?</Text>
        {renderRadio(hadSurgery, setHadSurgery)}

        {/* 수술일자 변경 (Date Picker) */}
        <Text style={styles.label}>수술일자 변경</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowSurgeryPicker(true)}
        >
          <Text style={{ fontSize:16, color:'#333' }}>
            {formatDate(surgeryDate)} (변동없음)
          </Text>
        </TouchableOpacity>

        {/* 수술 전 무릎 각도 변경: hadSurgery === true 일 때만 보이도록 */}
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
      </ScrollView>

      {/* DateTimePicker */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff' },
  content:   { padding:16, paddingBottom:32 },

  title: { fontSize:20, fontWeight:'bold', textAlign:'center', marginBottom:24 },

  label: { fontSize:14, fontWeight:'500', marginBottom:4, color:'#333' },
  input: {
    borderBottomWidth:1,
    borderBottomColor:'#ccc',
    paddingVertical:12,
    marginBottom:16
  },

  radioGroup: { flexDirection:'row', marginBottom:16 },
  radioBtn:   { flexDirection:'row', alignItems:'center', marginRight:24 },
  radioLabel: { marginLeft:6, fontSize:16, color:'#555' }
});
