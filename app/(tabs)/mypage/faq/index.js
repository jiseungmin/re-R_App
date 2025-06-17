// app/faq/index.js
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
export const unstable_noLayout = true;
const FAQ_DATA = [
  {
    id: '1',
    question: '[사용방법]장비가 연결이 안돼요.',
    answer:
      '장비 연결이 안될 시 장비 없이 측정해도 괜찮습니다. “장비 없이 수동 입력하기”를 누르고 각도 측정 가이드를 참고하여 각도 입력해주시면 장비 없이 사용 가능합니다.',
  },
  {
    id: '2',
    question: '[사용방법]장비 없이 사용 가능할까요?',
    answer:
      '네, 장비 없이도 수동 입력을 통해 사용하실 수 있습니다. 앱 내 “수동 입력” 모드를 선택하고 지시에 따라 입력해주세요.',
  },
  {
    id: '3',
    question: '[사용방법]비밀번호를 바꾸고 싶어요. 어떻게 변경하나요?',
    answer:
      '마이페이지 → 회원정보 수정 메뉴에서 “비밀번호 변경” 버튼을 눌러 새로운 비밀번호를 설정하실 수 있습니다.',
  },
  {
    id: '4',
    question: '[사용방법]수술일자를 잘못 입력했어요. 어디서 수정하나요?',
    answer:
      '마이페이지 → 회원정보 수정 → 개인정보 항목에서 수술일자를 다시 입력하시면 자동으로 저장됩니다.',
  },
  {
    id: '5',
    question: '[건강정보](수술 전) 무릎 인공관절은 어떤 수술인가요?',
    answer:
      '무릎 인공관절 수술은 손상된 관절을 제거하고 금속 및 폴리머로 된 인공 부품으로 교체하는 수술입니다.',
  },
  {
    id: '6',
    question: '[건강정보](수술 전) 인공관절은 어떤 재질로 되어있나요?',
    answer:
      '대개 티타늄 또는 코발트-크롬 합금과 폴리에틸렌(고분자) 소재로 구성되어 있습니다.',
  },
  {
    id: '7',
    question: '[건강정보](수술 전) 인공관절의 수명이 궁금해요.',
    answer:
      '평균 15~20년 정도 사용 가능하며, 환자 활동량에 따라 차이가 있을 수 있습니다.',
  },
  {
    id: '8',
    question: '[건강정보](수술 전) 수술 후 회복 기간은 얼마나 걸리나요?',
    answer:
      '일반적으로 4~6주 정도 보행 회복에 소요되며, 완전한 회복까지는 3~6개월이 걸립니다.',
  },
  {
    id: '9',
    question: '[건강정보](수술 후) 인공관절 수술 후 주의해야 할 점은?',
    answer:
      '무리한 운동은 삼가고, 정기 검진을 통해 관절 상태를 확인하며 감염 예방을 위해 상처 부위를 청결히 관리해야 합니다.',
  },
  {
    id: '10',
    question: '[건강정보](수술 후) 무릎에 좋은 습관과 운동 방법은?',
    answer:
      '수술 후 가벼운 스트레칭과 수중 걷기, 자전거 타기 등이 도움이 됩니다. 통증이 심할 땐 즉시 중단하세요.',
  },
  {
    id: '11',
    question: '[건강정보](수술 후) 인공관절 수술 후 샤워와 목욕은 언제부터 가능한가요?',
    answer:
      '수술 후 2~3일 경부터 상처 주위에 방수가 가능한 커버를 사용해 샤워하실 수 있습니다. 욕조 목욕은 2주 후부터 권장됩니다.',
  },
];

export default function FAQPage() {
  const router = useRouter();
  const [openId, setOpenId] = useState(null);

  const toggleItem = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/mypage')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>자주 묻는 질문</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* FAQ 리스트 */}
      <ScrollView contentContainerStyle={styles.list}>
        {FAQ_DATA.map((item) => {
          // 질문 앞의 [xxx] 부분과 나머지 분리
          const match = item.question.match(/^(\[.*?\])\s*/);
          const prefix = match ? match[1] : '';
          const rest = match ? item.question.slice(match[0].length) : item.question;

          return (
            <View key={item.id} style={styles.item}>
              <TouchableOpacity
                style={styles.questionRow}
                activeOpacity={0.7}
                onPress={() => toggleItem(item.id)}
              >
                <Text style={styles.questionText}>
                  {prefix.length > 0 && (
                    <Text style={styles.questionPrefix}>{prefix}</Text>
                  )}
                  {rest}
                </Text>
                <Ionicons
                  name={openId === item.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
              {openId === item.id && (
                <Text style={styles.answerText}>{item.answer}</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },

  list: {
    paddingVertical: 2,
  },
  item: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  questionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  questionPrefix: {
    color: '#006FFD',  // 대괄호 안 텍스트를 파란색으로
  },
  answerText: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});