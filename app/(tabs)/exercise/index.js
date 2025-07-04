import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomPanel from '../../../components/BottomPanel'; // 상대 경로 주의!
import { exercisePlans } from '../../../data/exercisePlans';
import { prescription } from '../../../data/prescription';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.8;

export default function Exercise() {
  const router = useRouter();
  const [bottomPanelType, setBottomPanelType] = useState('slide');
  //'slide', 'measure', 'consult'
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [panelOpen, setPanelOpen] = useState(false);

  // (슬라이드 패널) 패널 토글
  const togglePanel = () => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? PANEL_HEIGHT - 150 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsOpen(prev => !prev));
  };

  // (측정) 버튼
  const handleMeasure = () => alert('측정 시작');
  // (진료) 버튼
  const handleConsult = () => alert('진료 완료');
  const handleCall = () => alert('전화');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 헤더 */}
      <ImageBackground
        source={require('../../../assets/images/group5805.png')}
        style={styles.header}
        imageStyle={styles.headerBgImage}
      > 
        <View style={styles.menuWithText}>
          <TouchableOpacity onPress={() => router.push('/menu')}>
            <ImageBackground
              source={require('../../../assets/images/그룹 104.png')}
              style={styles.menuIcon}
              resizeMode="contain"
            />
      {/* <TouchableOpacity onPress={() => router.push('/exercise/tutorial')} style={{margin: 16, padding: 12, backgroundColor: '#2196F3', borderRadius: 8}}>
        <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>튜토리얼 보기</Text>
      </TouchableOpacity> */}
          </TouchableOpacity>
          <Text style={styles.headerText}>홍길동님의, {'\n'}건강한 하루를 응원해요!</Text>
        </View>
        <View style={{ flex: 1 }} />
        <Image
          source={require('../../../assets/images/group3945.png')}
          style={styles.headerIllustration}
          resizeMode="contain"
        />
      </ImageBackground>
      <Image
        source={require('../../../assets/images/group4800.png')}
        style={styles.mainImg}
        resizeMode="contain"
      />

     

       <BottomPanel
        type={bottomPanelType}
        isOpen={isOpen}
        slideAnim={slideAnim}
        PANEL_HEIGHT={PANEL_HEIGHT}
        surgeryInfo="수술 후 1주, 2일차"
        exercisePlans={exercisePlans}
        prescription={prescription}
        togglePanel={togglePanel}
        onStartExercise={() => router.push('exercise/training')}
        onPress={handleMeasure}
        onConsult={handleConsult}
        onCall={handleCall}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    width: '100%', height: 180, paddingTop: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerBgImage: { borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerText: {
    flex: 1, color: '#fff', fontSize: 16, lineHeight: 24, marginLeft: 20,
  },
  headerIllustration: {
    width: 110, height: 110, marginRight: 10, marginTop: 40,
  },
  menuIcon: {
    width: 20, height: 20, marginLeft: 20, marginTop: 50, marginBottom: 15,
  },
  mainImg: { width: '100%', height: 280, marginTop: 60 },
  /* 패널 */
  bottomPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8faff',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.12, shadowRadius: 12,
    elevation: 50,
    zIndex: 10,
  },
  surgeryText: {
    fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginVertical: 12, color: '#333',
  },
  planContainer: {
    paddingHorizontal: 16, marginBottom: 5,
  },
  planItem: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 12,
  },
  planIcon: {
    width: 40, height: 40, marginRight: 12,
  },
  planTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 2, color: '#444' },
  progressBar: {
    height: 6, backgroundColor: '#ddd', borderRadius: 3, marginTop: 4, width: '100%',
  },
  progressFill: {
    height: 6, backgroundColor: '#4AA8FF', borderRadius: 3,
  },
  exerciseBtn: {
    backgroundColor: '#4AA8FF', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8,
  },
  exerciseBtnText: { color: '#fff', fontSize: 12 },
  // 처방(보고서)
  prescriptionCardWrapper: {
    marginTop: 10,
    alignItems: 'center',
  },
  prescriptionCard: {
    width: '93%', aspectRatio: 335 / 340, minHeight: 340,
    alignSelf: 'center', justifyContent: 'flex-start', overflow: 'hidden',
    position: 'relative',
  },
  panelArrow: {
    width: 32, height: 32,
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    zIndex: 10,
    opacity: 0.88,
  },
  prescriptionBg: {
    width: '100%', height: '100%',
    borderRadius: 14,
  },
  prescriptionInner: {
    flex: 1, paddingHorizontal: 30, paddingTop: 54, // 아이콘과 간격
  },
  prescriptionTitle: {
    fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#222', textAlign: 'left',
  },
  prescriptionSub: {
    fontSize: 13, marginBottom: 10, color: '#444', textAlign: 'left',
  },
  exerciseBox: {
    marginBottom: 6,
  },
  exerciseLabel: {
    fontWeight: 'bold', fontSize: 14, marginBottom: 2, color: '#333',
  },
  exerciseDetail: {
    fontSize: 13, color: '#555', lineHeight: 18,
  },
});
