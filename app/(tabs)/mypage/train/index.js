import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Header from '../../../../components/ui/Header';

const scoreBg = require('../../../../assets/images/mypage/trian/그룹 5431.png');
const ICON_PREVIOUS = require('../../../../assets/images/mypage/previous_arrow.png');

export default function TrainingResult() {
  const router = useRouter();

  // 일별 탭
  const [tab, setTab] = useState(0);
  // 주차 Dropdown
  const [week, setWeek] = useState('1주차');
  const [showWeekDropdown, setShowWeekDropdown] = useState(false);
  const weeks = ['1주차', '2주차', '3주차', '4주차'];

  // 데이터
  const weeklyData = [];
  const dailyData = [
    {
      date: '2025년 5월 21일',
      items: [
        '관절각도 증진 훈련 [1회차] 4%',
        '근력 및 전신운동 [1회차] 100%',
      ],
      score: 52,
    },
  ];

  const renderDaily = (item, index) => (
    <View key={index} style={styles.dailyItem}>
      <View style={styles.dailyTextArea}>
        <Text style={styles.dailyDate}>{item.date}</Text>
        {item.items.map((txt, idx) => (
          <Text key={idx} style={styles.dailyText}>
            · {txt}
          </Text>
        ))}
      </View>
      <View style={styles.dailyScoreBox}>
        <Text style={styles.dailyScore}>
          {tab === 0 ? `${item.score} 점` : '00:00'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <Header title="훈련 결과" />

      {/* 본문 스크롤 */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        {/* 점수영역 (ImageBackground로 교체) */}
        <ImageBackground source={scoreBg} style={styles.scoreBg} resizeMode="cover">
          <Text style={styles.scoreText}>
            00<Text style={styles.scoreUnit}>  점</Text>
          </Text>
        </ImageBackground>

        {/* 주차별 달성도 */}
        <View style={styles.weeklySection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkbox-outline" size={20} color="#4F6EF6" />
            <Text style={styles.sectionTitle}>주차별 달성도</Text>
          </View>
          {weeklyData.length === 0 ? (
            <View style={styles.weeklyPlaceholder}>
              <Text style={styles.placeholderTitle}>기록이 없습니다.</Text>
              <Text style={styles.placeholderSub}>
                1주간의 데이터가 수집될 때까지 기다려주세요.
              </Text>
            </View>
          ) : (
            <View style={styles.weeklyChart}>{/* WeeklyChart */}</View>
          )}
        </View>

        {/* 일별 달성도 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="checkbox-outline" size={20} color="#4F6EF6" />
            <Text style={styles.sectionTitle}>일별 달성도</Text>
          </View>

          {/* 탭 */}
          <View style={styles.tabs}>
            {['훈련 점수', '훈련 시간'].map((label, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.tab, tab === i && styles.tabActive]}
                onPress={() => setTab(i)}
              >
                <Text style={[styles.tabText, tab === i && styles.tabTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 주차 Dropdown */}
          <View style={styles.pickerWrapper}>
            <TouchableOpacity
              style={styles.dropdownToggle}
              onPress={() => setShowWeekDropdown((v) => !v)}
            >
              <Text style={styles.dropdownText}>{week}</Text>
              <Ionicons
                name={showWeekDropdown ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
            {showWeekDropdown && (
              <View style={styles.dropdownList}>
                {weeks.map((w) => (
                  <TouchableOpacity
                    key={w}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setWeek(w);
                      setShowWeekDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{w}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* 일별 리스트 */}
          {dailyData.map(renderDaily)}
        </View>
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
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 5
  },
  backBtn: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 16,
    justifyContent: 'center',
    padding: 8,
    zIndex: 1,
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 32 },

  scoreBg: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',  // ImageBackground 모서리 라운드
    marginVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: { fontSize: 64, fontWeight: 'bold', color: '#fff' },
  scoreUnit: { fontSize: 18, color: '#fff' },

  weeklySection: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginLeft: 8, color: '#333' },
  weeklyPlaceholder: {
    height: 180,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  placeholderTitle: { fontSize: 18, fontWeight: '600', color: '#999', marginBottom: 4 },
  placeholderSub: { fontSize: 14, color: '#999', textAlign: 'center', lineHeight: 20 },
  weeklyChart: { height: 180, marginBottom: 16 },

  section: { marginTop: 8, marginBottom: 16 },
  tabs: { flexDirection: 'row', borderRadius: 4, overflow: 'hidden', marginBottom: 12 },
  tab: { flex: 1, paddingVertical: 8, backgroundColor: '#f5f5f5', alignItems: 'center' },
  tabActive: { backgroundColor: '#4F6EF6' },
  tabText: { fontSize: 14, color: '#555' },
  tabTextActive: { color: '#fff', fontWeight: '600' },

  pickerWrapper: { marginBottom: 16 },
  dropdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  dropdownText: { fontSize: 14, color: '#333' },
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 4,
  },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 12 },
  dropdownItemText: { textAlign: 'center', fontSize: 16, fontWeight: 'bold', color: '#333' },

  dailyItem: { flexDirection: 'row', marginTop: 8, marginBottom: 16 },
  dailyTextArea: { flex: 1 },
  dailyDate: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 },
  dailyText: { fontSize: 13, color: '#555', lineHeight: 20 },
  dailyScoreBox: {
    width: 84,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyScore: { fontSize: 16, fontWeight: '600', color: '#333' },
  dailyScoreUnit: { fontSize: 12, color: '#333' },
});
