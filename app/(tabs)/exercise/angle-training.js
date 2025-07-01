import { useNavigation } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function AngleTraining() {
  // 예시 데이터 (실제 데이터 연동 필요)
  const userAngle = 110;
  const targetAngle = 100;
  const speed = 0;
  const time = 0;
  const currentCount = 6;
  const totalCount = 3;
  const isSuccess = userAngle >= targetAngle;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>관절각도 증진 훈련</Text>
      <Text style={styles.subtitle}>목표 각도까지 도달해 보세요</Text>
      <View style={styles.tipBox}>
        <Image source={require('../../../assets/images/그룹 5702.png')} style={styles.tipImg} />
        <View style={{ flex: 1, marginLeft: 12, justifyContent: 'center' }}>
          <View style={styles.tipRow}>
            <Image source={require('../../../assets/images/그룹 5790.png')} style={styles.tipIconImg} />
            <Text style={styles.tipText}>발바닥을 벽에 대고 발바닥을 천천히 내려보세요</Text>
          </View>
        </View>
      </View>
      <View style={[styles.statusBox, isSuccess ? styles.statusSuccess : styles.statusFail]}>
        <Text style={[styles.statusText, isSuccess ? styles.statusTextSuccess : styles.statusTextFail]}>
          {isSuccess ? '잘 하고 있어요!' : '조금만 더 열심히!'}
        </Text>
      </View>
      <View style={styles.graphBox}>
        <View style={styles.graphStack}>
          <Image source={require('../../../assets/images/그룹 5392.png')} style={styles.graphBgImg} />
          <Image source={require('../../../assets/images/그룹 5421.png')} style={styles.graphHalfImg} />
          <Image source={require('../../../assets/images/그룹 5376.png')} style={styles.graphArcImg} />
        </View>
      </View>
      <View style={styles.angleRow}>
        <View style={styles.angleCol}>
          <Text style={styles.angleLabel}>사용자 최대각도</Text>
          <Text style={styles.angleValue}>{userAngle}°</Text>
        </View>
        <View style={styles.angleCol}>
          <Text style={styles.angleLabel}>목표 각도</Text>
          <Text style={styles.angleValue}>{targetAngle}°</Text>
        </View>
      </View>
      <View style={styles.infoGrid}>
        <View style={styles.infoCell}><Text style={styles.infoLabel}>속도</Text><Text style={styles.infoValue}>{speed}°/min</Text></View>
        <View style={styles.infoCell}><Text style={styles.infoLabel}>시간</Text><Text style={styles.infoValue}>{time}초</Text></View>
        <View style={styles.infoCell}><Text style={styles.infoLabel}>현재 횟수</Text><Text style={styles.infoValue}>{currentCount}개</Text></View>
        <View style={styles.infoCell}><Text style={styles.infoLabel}>총 횟수</Text><Text style={styles.infoValue}>{totalCount}개</Text></View>
      </View>
      <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.doneBtnText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#222', textAlign: 'center', marginTop: 16 },
  subtitle: { fontSize: 16, color: '#222', textAlign: 'center', marginTop: 8, marginBottom: 12 },
  tipBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F7FB', borderRadius: 16, padding: 12, marginBottom: 12 },
  tipImg: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#eee' },
  tipRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  tipIconImg: { width: 40, height: 20, resizeMode: 'contain', marginRight: 6 },
  tipText: { fontSize: 14, color: '#222', flex: 1 },
  statusBox: { borderRadius: 8, paddingVertical: 10, marginVertical: 10, alignItems: 'center', borderWidth: 2 },
  statusSuccess: { backgroundColor: '#E6F9E6', borderColor: '#00C851' },
  statusFail: { backgroundColor: '#FDEDED', borderColor: '#FF4444' },
  statusText: { fontSize: 18, fontWeight: 'bold' },
  statusTextSuccess: { color: '#00C851' },
  statusTextFail: { color: '#FF4444' },
  graphBox: { alignItems: 'center', marginVertical: 12 },
  graphStack: { width: width * 0.6, height: width * 0.35, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  graphBgImg: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'contain' },
  graphHalfImg: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'contain' },
  graphArcImg: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'contain' },
  angleRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 },
  angleCol: { alignItems: 'center', flex: 1 },
  angleLabel: { fontSize: 13, color: '#888', marginBottom: 2 },
  angleValue: { fontSize: 20, fontWeight: 'bold', color: '#222' },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, marginBottom: 16 },
  infoCell: { width: '50%', alignItems: 'center', marginVertical: 6 },
  infoLabel: { fontSize: 13, color: '#888' },
  infoValue: { fontSize: 16, fontWeight: 'bold', color: '#222', marginTop: 2 },
  doneBtn: { backgroundColor: '#2276F3', borderRadius: 24, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  doneBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
}); 