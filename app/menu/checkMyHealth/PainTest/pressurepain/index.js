// app/(tabs)/PainScaleScreen.js
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Header from '../../../../../components/ui/Header';

const CARD_PADDING = 16;
const CIRCLE_SIZE = 36;

const QUESTIONS = [
  {
    section: 'C. 압박통증',
    items: [
      {
        key: 'C1',
        label: 'C1',
        text: '수술 부위 혹은 주변부를 꾹 눌렀을 때 (손톱 끝이 하얘지도록) 통증이 어느 정도 인가요?',
      },
    ],
  },
];

export default function PainScaleScreen() {
  const router = useRouter();
  const [answers, setAnswers] = useState({ C1: null });

  const handleSelect = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const renderOptions = questionKey => {
    const nums = Array.from({ length: 11 }, (_, i) => i);
    return (
      <>
        <View style={styles.optionsRow}>
          {nums.slice(0, 5).map(i => (
            <OptionCircle
              key={i}
              value={i}
              selected={answers[questionKey] === i}
              onPress={() => handleSelect(questionKey, i)}
            />
          ))}
        </View>
        <View style={[styles.optionsRow, { marginTop: 8 }]}>  
          {nums.slice(5).map(i => (
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

  const renderQuestionText = (text) => {
    const keywords = ['시작', '중간', '마지막'];

    let modifiedText = text;
    keywords.forEach(keyword => {
      modifiedText = modifiedText.replace(
        keyword,
        `<blue>${keyword}</blue>`
      );
    });

    const parts = modifiedText.split(/<blue>|<\/blue>/);

    return (
      <Text style={styles.questionText}>
        {parts.map((part, index) => (
          <Text key={index} style={index % 2 === 1 ? styles.highlight : null}>
            {part}
          </Text>
        ))}
      </Text>
    );
  };

  const allAnswered = Object.values(answers).every(v => v !== null);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="통증 테스트" />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {QUESTIONS.map(section => (
          <React.Fragment key={section.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            {section.items.map(q => (
              <View style={styles.card} key={q.key}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{q.label}</Text>
                </View>
                {renderQuestionText(q.text)}
                {renderOptions(q.key)}
              </View>
            ))}
          </React.Fragment>
        ))}

         <TouchableOpacity
          style={[styles.nextButton, !allAnswered && styles.nextButtonDisabled]}
          disabled={!allAnswered}
          onPress={() => router.push('/menu/checkMyHealth/FearTest')}
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
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#EEE' },
  headerTitle: { fontSize: 18, fontWeight: '500' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 28, textDecorationLine: 'underline', fontWeight: '700', marginTop: 24, marginBottom: 32 },
  card: { position: 'relative', backgroundColor: '#F2F2F2', borderRadius: 12, padding: CARD_PADDING, paddingTop: CARD_PADDING + 12, marginBottom: 24 },
  badge: { position: 'absolute', top: -6, left: -8, backgroundColor: '#FDE68A', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 16, fontWeight: '700', color: '#333' },
  questionText: { fontSize: 16, color: '#333', lineHeight: 24, fontWeight: '700', marginBottom: 12 },
  highlight: { color: '#4F6EFF', fontWeight: '700' },
  optionsRow: { width: '100%', flexDirection: 'row', justifyContent: 'space-evenly' },
  optionCircle: { width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: CIRCLE_SIZE / 2, borderWidth: 1, borderColor: '#CCC', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  optionCircleSelected: { backgroundColor: '#4F6EFF', borderColor: '#4F6EFF' },
  optionText: { fontSize: 16, color: '#333' },
  optionTextSelected: { color: '#fff' },
  nextButton: { height: 48, width: '80%', borderRadius: 20, backgroundColor: '#4F6EFF', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  nextButtonDisabled: { backgroundColor: '#CACACA' },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});