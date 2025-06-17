import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MedicalHistoryScreen() {
  const router = useRouter();

  const [hasCondition, setHasCondition] = useState(null);
  const [hadSurgery, setHadSurgery] = useState(null);
  const [surgeryDate, setSurgeryDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [maxKneeAngle, setMaxKneeAngle] = useState('');

  const today = new Date();
  const isDateInvalid = surgeryDate < new Date(today.setHours(0, 0, 0, 0));

  const formattedDate = `${surgeryDate.getFullYear()}.${String(
    surgeryDate.getMonth() + 1
  ).padStart(2, '0')}.${String(surgeryDate.getDate()).padStart(2, '0')}`;

  const canSubmit =
    hasCondition !== null &&
    hadSurgery !== null &&
    !isDateInvalid &&
    (hadSurgery === false || maxKneeAngle.trim().length > 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>병력확인</Text>

        {/* Q1 */}
        <Text style={styles.question}>
          Q. 가지고 계신 기저질환이 있으신가요?{' '}
          <Text style={styles.required}>(필수)</Text>
        </Text>
        <View style={styles.radioRow}>
          <TouchableOpacity style={styles.radioOption} onPress={() => setHasCondition(true)}>
            <View style={[styles.radioCircle, hasCondition === true && styles.radioChecked]}>
              {hasCondition === true && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.radioLabel}>예</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioOption} onPress={() => setHasCondition(false)}>
            <View style={[styles.radioCircle, hasCondition === false && styles.radioChecked]}>
              {hasCondition === false && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.radioLabel}>아니오</Text>
          </TouchableOpacity>
        </View>

        {/* Q2 */}
        <Text style={styles.question}>
          Q. 현재 무릎수술을 받으셨나요?{' '}
          <Text style={styles.required}>(필수)</Text>
        </Text>
        <View style={styles.radioRow}>
          <TouchableOpacity style={styles.radioOption} onPress={() => setHadSurgery(true)}>
            <View style={[styles.radioCircle, hadSurgery === true && styles.radioChecked]}>
              {hadSurgery === true && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.radioLabel}>예</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioOption} onPress={() => setHadSurgery(false)}>
            <View style={[styles.radioCircle, hadSurgery === false && styles.radioChecked]}>
              {hadSurgery === false && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.radioLabel}>아니오</Text>
          </TouchableOpacity>
        </View>

        {/* Q3: Date Picker */}
        <Text style={styles.question}>Q. 수술 날짜를 입력해주세요</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowPicker(true)}>
          <Text style={styles.dateText}>{formattedDate} ▼</Text>
        </TouchableOpacity>
        {isDateInvalid && <Text style={styles.errorText}>선택일정이 오늘보다 이전일 수 없습니다.</Text>}

        {/* Q4: Max Knee Angle (조건부 렌더링) */}
        {hadSurgery === true && (
          <>
            <Text style={styles.question}>Q. 수술 이전의 최대 무릎 각도를 입력해주세요.</Text>
            <TextInput
              style={styles.textInput}
              placeholder="예: 30"
              keyboardType="numeric"
              value={maxKneeAngle}
              onChangeText={setMaxKneeAngle}
            />
          </>
        )}
      </ScrollView>

      {/* Date Picker Modal */}
      {showPicker && (
        <Modal transparent animationType="fade">
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={surgeryDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={(_, date) => {
                  setShowPicker(false);
                  if (date) setSurgeryDate(date);
                }}
                style={styles.picker}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: canSubmit ? '#6573E3' : '#CCCCCC' }]}
          disabled={!canSubmit}
          onPress={() => router.push('/signUp/complete')}
        >
          <Text style={styles.submitText}>가입완료</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 64,
    // section 간 마진
    gap: 8,
  },
  sectionTitle: { fontSize: 28, fontWeight: '800', textDecorationLine: 'underline', marginBottom: 24, color: '#000' },
  question: { fontSize: 16, color: '#333', marginBottom: 12 },
  required: { color: '#6573E3' },
  radioRow: { flexDirection: 'row', marginBottom: 24 },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginRight: 32 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#CCC', alignItems: 'center', justifyContent: 'center' },
  radioChecked: { backgroundColor: '#6573E3', borderColor: '#6573E3' },
  checkMark: { color: '#FFF', fontSize: 12 },
  radioLabel: { marginLeft: 6, fontSize: 14, color: '#333' },
  dateInput: { width: '100%', borderWidth: 1, borderColor: '#CCC', borderRadius: 4, padding: 12, marginBottom: 16 },
  dateText: { fontSize: 16, color: '#333' },
  textInput: { width: '100%', borderWidth: 1, borderColor: '#CCC', borderRadius: 4, padding: 12, fontSize: 16, color: '#333', marginBottom: 16 },
  errorText: { color: '#E53935', fontSize: 12, marginBottom: 16 },
  pickerOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  pickerContainer: { backgroundColor: '#FFF' },
  picker: { backgroundColor: '#FFF' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#EEE' },
  submitButton: { paddingVertical: 14, borderRadius: 24, alignItems: 'center' },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
