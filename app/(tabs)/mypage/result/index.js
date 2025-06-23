import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Header from '../../../../components/ui/Header';

// 뒤로가기 아이콘 이미지
const ICON_PREVIOUS = require('../../../../assets/images/mypage/previous_arrow.png');

export default function CalendarScreen() {
  const router = useRouter();

  const today = new Date();
  const isoString = today.toISOString().split('T')[0];

  const [currentMonth, setCurrentMonth] = useState(isoString);
  const [selectedDate, setSelectedDate] = useState(isoString);

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
       <Header title="평가검사 결과" />
  
      {/* 달력 */}
      <Calendar
        style={styles.calendar}
        current={currentMonth}
        onMonthChange={month => setCurrentMonth(month.dateString)}
        onDayPress={day => setSelectedDate(day.dateString)}
        hideExtraDays={false}
        firstDay={7}
        monthFormat={'yyyy년 MM월'}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#4F6EF6',
            selectedTextColor: '#fff',
            marked: true,
            dotColor: '#4F6EF6',
          },
        }}
        theme={{
          arrowColor: '#000',
          textMonthFontSize: 18,
          textMonthFontWeight: 'bold',
          dayTextColor: '#000',
          todayTextColor: '#4F6EF6',
          selectedDayBackgroundColor: '#4F6EF6',
          selectedDayTextColor: '#fff',
          textDisabledColor: '#CCC',
          'stylesheet.calendar.header': {
            header: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 8,
            },
            monthText: {
              fontSize: 16,
              fontWeight: 'bold',
            },
          },
          'stylesheet.day.basic': {
            weekendText: {
              color: '#4F6EF6',
            },
          },
        }}
      />
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
    borderBottomColor: '#ccc',
    marginBottom: 5,
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
  calendar: {
    marginTop: 16,
  },
});