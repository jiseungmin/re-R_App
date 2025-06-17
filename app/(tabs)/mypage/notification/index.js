import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const offSwitch = require('../../../../assets/images/notification/그룹 5957.png');
const onSwitch = require('../../../../assets/images/notification/그룹 5958.png');

// 뒤로가기 아이콘 이미지
const ICON_PREVIOUS = require('../../../../assets/images/mypage/previous_arrow.png');


export default function AlarmSettingsScreen() {
  const router = useRouter();
  // 토글 상태
  const [firstEnabled, setFirstEnabled] = useState(false);
  const [secondEnabled, setSecondEnabled] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);

  // 시간 상태 & DatePicker 표시 여부
  const [firstTime, setFirstTime] = useState(new Date());
  const [showFirstPicker, setShowFirstPicker] = useState(false);

  const [secondTime, setSecondTime] = useState(new Date());
  const [showSecondPicker, setShowSecondPicker] = useState(false);

  // 다시 알림 간격 & Modal 표시 여부
  const [reminderInterval, setReminderInterval] = useState(10);
  const [showReminderPicker, setShowReminderPicker] = useState(false);

  // 시각 포맷 함수
  const formatTime = (date) => {
    let h = date.getHours();
    const m = date.getMinutes();
    const ampm = h < 12 ? '오전' : '오후';
    h = h % 12 || 12;
    const mm = m < 10 ? '0' + m : m;
    const hh = h < 10 ? '0' + h : h;
    return { time: `${hh}:${mm}`, ampm };
  };

  const f1 = formatTime(firstTime);
  const f2 = formatTime(secondTime);

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
              <TouchableOpacity
                onPress={() => router.push('/mypage')}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Image source={ICON_PREVIOUS} style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>알림시간 설정</Text>
              <View style={{ width: 24 }} />
      </View>

      {/* 본문 */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* 1회차 운동 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>1회차 운동</Text>
            <TouchableOpacity onPress={() => setFirstEnabled((v) => !v)}>
              <Image source={firstEnabled ? onSwitch : offSwitch} style={styles.switchImage} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.timeRow}
            onPress={() => {
              setShowFirstPicker(true);
              setShowSecondPicker(false);
              setShowReminderPicker(false);
            }}
          >
            <Text style={styles.timeText}>{f1.time}</Text>
            <Text style={styles.amPmText}>{f1.ampm}</Text>
          </TouchableOpacity>
        </View>

        {/* 2회차 운동 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>2회차 운동</Text>
            <TouchableOpacity onPress={() => setSecondEnabled((v) => !v)}>
              <Image source={secondEnabled ? onSwitch : offSwitch} style={styles.switchImage} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.timeRow}
            onPress={() => {
              setShowSecondPicker(true);
              setShowFirstPicker(false);
              setShowReminderPicker(false);
            }}
          >
            <Text style={styles.timeText}>{f2.time}</Text>
            <Text style={styles.amPmText}>{f2.ampm}</Text>
          </TouchableOpacity>
        </View>

        {/* 다시 알림 */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>다시 알림 (운동 미완료시)</Text>
            <TouchableOpacity onPress={() => setReminderEnabled((v) => !v)}>
              <Image source={reminderEnabled ? onSwitch : offSwitch} style={styles.switchImage} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.timeRow}
            onPress={() => {
              setShowReminderPicker(true);
              setShowFirstPicker(false);
              setShowSecondPicker(false);
            }}
          >
            <Text style={styles.timeText}>{reminderInterval}</Text>
            <Text style={styles.amPmText}>분 후</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Pickers */}
      {showFirstPicker && (
        <DateTimePicker
          value={firstTime}
          mode="time"
          display="spinner"
          onChange={(e, sel) => {
            setShowFirstPicker(false);
            if (sel) setFirstTime(sel);
          }}
        />
      )}
      {showSecondPicker && (
        <DateTimePicker
          value={secondTime}
          mode="time"
          display="spinner"
          onChange={(e, sel) => {
            setShowSecondPicker(false);
            if (sel) setSecondTime(sel);
          }}
        />
      )}

      {/* Reminder Modal */}
      <Modal visible={showReminderPicker} transparent animationType="fade" onRequestClose={() => setShowReminderPicker(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setShowReminderPicker(false)}>
          <View style={styles.modalContent}>
            {[5, 10, 15, 30].map((min) => (
              <TouchableOpacity key={min} style={styles.modalOption} onPress={() => { setReminderInterval(min); setShowReminderPicker(false); }}>
                <Text style={styles.modalOptionText}>{min}분 후</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 5
  },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '600', color: '#000' },
  content: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#eee', padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '500' },
  switchImage: { width: 51, height: 31, resizeMode: 'contain' },
  timeRow: { flexDirection: 'row', alignItems: 'flex-end' },
  timeText: { fontSize: 32, fontWeight: 'bold' },
  amPmText: { fontSize: 16, marginLeft: 4, marginBottom: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 8, paddingVertical: 8, width: 200 },
  modalOption: { paddingVertical: 12 },
  modalOptionText: { textAlign: 'center', fontSize: 16 },
});
