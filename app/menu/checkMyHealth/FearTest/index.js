import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EvaluationCompletePopup from '../../../../components/popup/completePopup';

export default function App() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const options = ['겁이 많다', '보통이다', '겁이 없는 편'];

  return (
    <SafeAreaView style={styles.container}>
      {/* 모달 */}
      <Modal
        visible={showPopup}
        animationType="fade"
        transparent
        onRequestClose={() => setShowPopup(false)}
      >
        <EvaluationCompletePopup
          onViewResult={() => {
            setShowPopup(false);
            console.log("결과보기 클릭됨");
            router.push('/evalresult'); // 예: 결과 페이지 이동
          }}
          onLater={() => {
            setShowPopup(false);
            console.log("나중에 보기 클릭됨");
          }}
        />
      </Modal>

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>겁 테스트</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 질문 */}
      <Text style={styles.questionText}>Q. 평소에 겁이 많은 편인가요?</Text>

      {/* 옵션 */}
      <View style={styles.content}>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption(option)}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option && styles.selectedOptionText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 제출 버튼 */}
      <TouchableOpacity
        style={[styles.nextButton, !selectedOption && styles.nextButtonDisabled]}
        disabled={!selectedOption}
        onPress={() => setShowPopup(true)}
      >
        <Text style={styles.nextButtonText}>제출</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  questionText: {
    marginTop: 20,
    marginLeft: 20,
    fontSize: 25,
    fontWeight: '900',
    textDecorationLine: 'underline',
    marginBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  optionButton: {
    width: '60%',
    paddingVertical: 20,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    alignSelf: 'center',
  },
  selectedOption: {
    backgroundColor: '#4F6EFF',
    borderColor: '#4F6EFF',
  },
  optionText: {
    fontSize: 25,
    color: '#000',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '700',
  },
  nextButton: {
    height: 48,
    width: '80%',
    borderRadius: 20,
    backgroundColor: '#4F6EFF',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  nextButtonDisabled: {
    backgroundColor: '#CACACA',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
