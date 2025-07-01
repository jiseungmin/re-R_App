import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../../../components/ui/Header';

const CARD_PADDING = 16;
const CIRCLE_SIZE = 36;

const QUESTIONS = [
  {
    section: 'C. 부기',
    items: [
      {
        key: 'C1',
        label: 'C1',
        text: '지금 무릎에 부기가 있나요?\n있다면 어느정도 인가요?',
      }
    ],
  },
];

const TIPS = [
  '무릎 수술 주변부를 손 끝이 하해질 정도로 \n꾹 눌러주세요.',
  '누른 자국이 돌아오는 시간을 확인합니다.\n',
  '1. 자국이 거의 남지 않습니다.\n2. 자국이 빠르게 돌아옵니다.\n3. 자국이 천천히 돌아옵니다.',
];

export default function PainScaleScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState({ C1: null });

  const handleSelect = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const renderOptions = questionKey => {
    const nums = [1, 2, 3]; 
    return (
      <View style={styles.optionsRow}>
        {nums.map(i => (
          <OptionCircle
            key={i}
            value={i}
            selected={answers[questionKey] === i}
            onPress={() => handleSelect(questionKey, i)}
          />
        ))}
      </View>
    );
  };

  const allAnswered = Object.values(answers).every(v => v !== null);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="운동 후 무릎 상태 평가" />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {QUESTIONS.map(section => (
          <React.Fragment key={section.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            {section.items.map(q => (
              <View style={styles.card} key={q.key}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{q.label}</Text>
                </View>
                <Text style={styles.questionText}>{q.text}</Text>
                {renderOptions(q.key)}
              </View>
            ))}
          </React.Fragment>
        ))}

        {/* Tip Box */}
        <View style={styles.tipBox}>
            <Image
                source={require('../../../../../assets/images/그룹 5790.png')}
                style={styles.tipImage}
                resizeMode="contain"
            />
            <View style={styles.tipContent}>
                <Text style={styles.tipText}>{TIPS[0]}</Text>
                <Text style={styles.tipText}>{TIPS[1]}</Text>
                {TIPS[2].split('\n').map((line, idx) => (
                <Text key={idx} style={styles.tipText}>{line}</Text>
                ))}
            </View>
        </View>

        <TouchableOpacity
          style={[styles.nextButton, !allAnswered && styles.nextButtonDisabled]}
          disabled={!allAnswered}
          onPress={() => router.push('./statuscheck')}
        >
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function OptionCircle({ value, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.optionCircle, selected && styles.optionCircleSelected]}
      onPress={onPress}
    >
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {value}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 28,
    textDecorationLine: 'underline',
    fontWeight: '700',
    marginBottom: 32,
  },
  card: {
    position: 'relative',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    padding: CARD_PADDING,
    paddingTop: CARD_PADDING + 12,
    marginBottom: 24,
  },
  badge: {
    position: 'absolute',
    top: -6,
    left: -8,
    backgroundColor: '#FDE68A',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { fontSize: 16, fontWeight: '700', color: '#333' },
  questionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 12,
  },
  optionCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 1,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  optionCircleSelected: {
    backgroundColor: '#4F6EFF',
    borderColor: '#4F6EFF',
  },
  optionText: { fontSize: 16, color: '#333' },
  optionTextSelected: { color: '#fff' },

  tipBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  tipImage: {
    width: 70,
    height: 32,
    marginBottom:12,
    marginTop: 4,
},
  tipContent: {
    flex: 1,
},
  tipIcon: {
    fontSize: 16,
    color: '#FBBF24', 
    marginRight: 4,
  },
  tipLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F6EFF',
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    lineHeight: 20,
  },

  nextButton: {
    height: 48,
    width: '80%',
    borderRadius: 20,
    backgroundColor: '#4F6EFF',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  nextButtonDisabled: { backgroundColor: '#CACACA' },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
