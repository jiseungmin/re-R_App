import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PostTwoPopup from '../../../../../components/popup/posttwoPopup';
import Header from '../../../../../components/ui/Header';

const QUESTIONS = [
  '종아리에서 통증이 느껴지시나요?',
  '무릎 아래로 열감 통증이 있나요?',
  '무릎 근처가 불편하거나 뻐근한가요?',
  '가슴 주위가 아프거나 숨이 가쁜가요?',
  '무릎 관절이 느슨하게 느껴지시나요?',
  '해당 없음',
];

export default function SymptomAssessmentScreen() {
  const router = useRouter();
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const toggleSelection = (index) => {
    if (index === 5) {
      // '해당 없음' 선택
      if (selectedIndexes.includes(5)) {
        // 이미 선택되어 있다면 해제
        setSelectedIndexes([]);
      } else {
        // 해당 없음만 단독 선택
        setSelectedIndexes([5]);
      }
    } else {
      // 일반 항목 선택 시
      if (selectedIndexes.includes(index)) {
        // 이미 선택되어 있다면 해제
        const newIndexes = selectedIndexes.filter((i) => i !== index);
        setSelectedIndexes(newIndexes);
      } else {
        // 해당 없음이 선택된 상태라면 제거 후 추가
        const newIndexes = selectedIndexes.filter((i) => i !== 5);
        setSelectedIndexes([...newIndexes, index]);
      }
    }
  };

  const isOtherSelected = selectedIndexes.some(i => i >= 0 && i <= 4);
  const isAnySelected = selectedIndexes.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={showPopup}
        animationType="fade"
        transparent
        statusBarTranslucent
        onRequestClose={() => setShowPopup(false)}
      >
        <View style={styles.popupOverlay}>
          <View style={styles.popupContainer}>
            <PostTwoPopup onStart={() => setShowPopup(false)} />
          </View>
        </View>
      </Modal>

      <Header title="운동 후 무릎 상태 평가" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>상태이상 평가 진단</Text>

        {QUESTIONS.map((item, index) => {
          const selected = selectedIndexes.includes(index);
          const disabled = index === 5 && isOtherSelected; // '해당 없음' 비활성 조건

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionRow,
                disabled && { opacity: 0.4 },
              ]}
              onPress={() => {
                if (!disabled) toggleSelection(index);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.optionText}>{item}</Text>
              <Image
                source={
                  selected
                    ? require('../../../../../assets/images/그룹 4818.png')
                    : require('../../../../../assets/images/그룹 4294.png')
                }
                style={styles.circleImage}
              />
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[styles.button, !isAnySelected && styles.buttonDisabled]}
          disabled={!isAnySelected}
          onPress={() => setShowPopup(true)}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  circleImage: {
    width: 24,
    height: 24,
    marginLeft: 12,
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontSize: 28,
    textDecorationLine: 'underline',
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F5',
    marginBottom: 12,
  },
  optionText: { fontSize: 16, color: '#333', flex: 1 },
  button: {
    marginTop: 84,
    height: 48,
    backgroundColor: '#4F6EFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
});
