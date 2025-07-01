import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../../../components/ui/Header';

const CARD_PADDING = 16;
const CIRCLE_SIZE = 36;

const QUESTIONS = [
  {
    section: 'B. 열감',
    items: [
      {
        key: 'B1',
        label: 'B1',
        text: '지금 무릎에 열감이 있나요?\n있다면 어느정도 인가요?',
      }
    ],
  },
];

const TIPS = [
  '손등으로 무릎 주변의 온도를 확인해주세요.',
  '열을 쟀을 때 느껴지는 정도를 숫자로 표시합니다.',
  '0(정상체온) ~ 10(극도로 뜨거움)',
];

export default function PainScaleScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState({ B1: null });

  const handleSelect = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const renderOptions = questionKey => {
    const nums = Array.from({ length: 11 }, (_, i) => i);
    return (
      <>
        <View style={styles.optionsRow}>
          {nums.slice(0, 6).map(i => (
            <OptionCircle
              key={i}
              value={i}
              selected={answers[questionKey] === i}
              onPress={() => handleSelect(questionKey, i)}
            />
          ))}
        </View>
        <View style={[styles.optionsRow, { marginTop: 8 }]}>
          {nums.slice(6).map(i => (
            <OptionCircle
              key={i}
              value={i}
              selected={answers[questionKey] === i}
              onPress={() => handleSelect(questionKey, i)}
            />
          ))}
        </View>
      </>
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

        {/* 도움 설명 */}
        <View style={styles.tipBox}>
          {TIPS.map((tip, idx) => (
            <View key={idx} style={styles.tipRow}>
              <Image source={require('../../../../../assets/images/그룹 5926.png')} style={styles.tipIcon} />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* 다음 버튼 */}
        <TouchableOpacity
          style={[styles.nextButton, !allAnswered && styles.nextButtonDisabled]}
          disabled={!allAnswered}
          onPress={() => router.push('./postbookkeeping')}
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
  contentContainer: { padding: 20, paddingBottom: 60 },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    textDecorationLine: 'underline',
    marginTop: 24,
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
  tipBox: { marginTop: 8, marginBottom: 24 },
  tipRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  tipIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: '#4F6EFF',
  },
  tipText: { fontSize: 14, color: '#333', flexShrink: 1 },
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
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
