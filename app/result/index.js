import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function App() {
  const [currentMonth, setCurrentMonth] = useState('2025-05-01');
  const [selectedDate, setSelectedDate] = useState('2025-05-21');

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {/* navigation.goBack() 등 */}}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>평가검사 결과</Text>
      </View>

      {/* 달력 */}
      <Calendar
        // 보여줄 달력의 기준 날짜
        current={currentMonth}
        // 이전/다음 달 이동 시 호출
        onMonthChange={month => setCurrentMonth(month.dateString)}
        // 날짜 선택 시 호출
        onDayPress={day => setSelectedDate(day.dateString)}
        // 이전/다음 달 날짜도 보여주기
        hideExtraDays={false}
        // 주 시작 요일: 일요일(7)부터
        firstDay={7}
        // 헤더의 월 표시 형식
        monthFormat={'yyyy년 MM월'}
        // 선택된 날짜 표시
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#4F6EF6',
            selectedTextColor: '#fff',
            marked: true,
            dotColor: '#4F6EF6'
          }
        }}
        // 테마 커스터마이징
        theme={{
          arrowColor: '#000',
          textMonthFontSize: 18,
          textMonthFontWeight: 'bold',
          dayTextColor: '#000',
          todayTextColor: '#4F6EF6',
          selectedDayBackgroundColor: '#4F6EF6',
          selectedDayTextColor: '#fff',
          textDisabledColor: '#CCC',
          // 헤더(월+화살표) 레이아웃
          'stylesheet.calendar.header': {
            header: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 8
            },
            monthText: {
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          // 주말(토) 텍스트 색 변경
          'stylesheet.day.basic': {
            weekendText: {
              color: '#4F6EF6'
            }
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12
  }
});
