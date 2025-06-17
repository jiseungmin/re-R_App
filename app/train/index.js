// app/trainingResult.js
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    FlatList,
    ImageBackground,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function TrainingResult() {
  const router = useRouter();

  // 일별 탭
  const [tab, setTab] = useState(0);
  // 주차 Picker
  const [week, setWeek] = useState('1주차');
  const weeks = ['1주차','2주차','3주차','4주차'];

  // 데이터
  const weeklyData = []; // 비어있으면 placeholder 렌더
  const dailyData = [
    {
      date: '2025년 5월 21일',
      items: [
        '관절각도 증진 훈련 [1회차] 4%',
        '근력 및 전신운동 [1회차] 100%'
      ],
      score: 52
    }
  ];

  // 맨 위 부터 스크롤 영역
  const ListHeader = () => (
    <>
      {/* 1) 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>훈련 결과</Text>
      </View>

      {/* 2) 점수영역 */}
      <ImageBackground
        source={require('../../assets/images/group5805.png')}
        style={styles.scoreBg}
        resizeMode="cover"
      >
        <Text style={styles.scoreText}>
          00
          <Text style={styles.scoreUnit}>점</Text>
        </Text>
      </ImageBackground>

      {/* 3) 주차별 달성도 */}
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
          <View style={styles.weeklyChart}>
            {/* YourWeeklyChart data={weeklyData} */}
          </View>
        )}
      </View>

      {/* 4) 일별 달성도 헤더 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="checkbox-outline" size={20} color="#4F6EF6" />
          <Text style={styles.sectionTitle}>일별 달성도</Text>
        </View>
        {/* 탭 */}
        <View style={styles.tabs}>
          {['훈련 점수','훈련 시간'].map((label, i) => (
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
        {/* 주차 Picker */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={week}
            onValueChange={v => setWeek(v)}
            style={styles.picker}
            mode="dropdown"
            itemStyle={styles.pickerItem}
          >
            {weeks.map(w => <Picker.Item key={w} label={w} value={w} />)}
          </Picker>
        </View>
      </View>
    </>
  );

  const renderDaily = ({ item }) => (
    <View style={styles.dailyItem}>
      <View style={styles.dailyTextArea}>
        <Text style={styles.dailyDate}>{item.date}</Text>
        {item.items.map((txt, idx) => (
          <Text key={idx} style={styles.dailyText}>· {txt}</Text>
        ))}
      </View>
      <View style={styles.dailyScoreBox}>
        <Text style={styles.dailyScore}>
          {tab === 0 ? item.score : '00:00'}
        </Text>
        {tab === 0 && <Text style={styles.dailyScoreUnit}>점</Text>}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={dailyData}
        keyExtractor={(item, i) => item.date + i}
        ListHeaderComponent={ListHeader}
        renderItem={renderDaily}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff' },

  /* FlatList 자체가 flex:1 이어야 scroll 동작 */
  list: { flex:1 },
  listContent: { paddingHorizontal:16, paddingBottom:32 },

  /* 1) 헤더 */
  header: {
    height:56, justifyContent:'center', alignItems:'center', position:'relative'
  },
  backBtn: { position:'absolute', left:16, top:16 },
  headerTitle: { fontSize:18, fontWeight:'bold' },

  /* 2) 점수 */
  scoreBg: { width:'100%', height:120, justifyContent:'center', alignItems:'center' },
  scoreText: { fontSize:32, fontWeight:'bold', color:'#fff' },
  scoreUnit: { fontSize:18, color:'#fff' },

  /* 3) 주차별 달성도 */
  weeklySection: { marginVertical:16 },
  sectionHeader: { flexDirection:'row', alignItems:'center', marginBottom:8 },
  sectionTitle: { fontSize:16, fontWeight:'600', marginLeft:8, color:'#333' },
  weeklyPlaceholder: {
    height:180, backgroundColor:'#f9f9f9',
    borderRadius:8, justifyContent:'center',
    alignItems:'center', paddingHorizontal:16
  },
  placeholderTitle: { fontSize:18, fontWeight:'600', color:'#999', marginBottom:4 },
  placeholderSub: { fontSize:14, color:'#999', textAlign:'center', lineHeight:20 },
  weeklyChart: { height:180, marginBottom:16 },

  /* 4) 일별 달성도 탭 & picker */
  section: { marginBottom:16 },
  tabs: { flexDirection:'row', borderRadius:4, overflow:'hidden', marginBottom:12 },
  tab: { flex:1, paddingVertical:8, backgroundColor:'#f5f5f5', alignItems:'center' },
  tabActive: { backgroundColor:'#4F6EF6' },
  tabText: { fontSize:14, color:'#555' },
  tabTextActive: { color:'#fff', fontWeight:'600' },
  pickerWrapper: { borderWidth:1, borderColor:'#ccc', borderRadius:4, marginBottom:16 },
  picker: { height:50, width:'100%' },
  pickerItem: { height:50, fontSize:14 },

  /* 리스트 아이템 */
  dailyItem: { flexDirection:'row', alignItems:'flex-start' },
  dailyTextArea: { flex:1 },
  dailyDate: { fontSize:14, fontWeight:'600', color:'#333', marginBottom:4 },
  dailyText: { fontSize:13, color:'#555', lineHeight:20 },
  dailyScoreBox: {
    width:64, height:48, backgroundColor:'#f0f0f0',
    borderRadius:4, alignItems:'center', justifyContent:'center'
  },
  dailyScore: { fontSize:16, fontWeight:'600', color:'#333' },
  dailyScoreUnit: { fontSize:12, color:'#333' },

  /* 구분선 */
  itemSeparator: { height:4, backgroundColor:'#eee', marginVertical:8 }
});
