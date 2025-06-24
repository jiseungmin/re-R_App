import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.8;

export default function Exercise() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // 아이콘 이미지
  const UP_ICON = require('../../../assets/images/위로스크롤icon.png');
  const DOWN_ICON = require('../../../assets/images/위로스크롤icon.png'); // 아래로 아이콘 추가 필요

  // 더미 데이터
  const surgeryInfo = '수술 후 1주, 2일차';
  const exercisePlans = [
    {
      id: 1,
      title: '근력 및 전신운동 [1회차]',
      progress: 0,
      icon: require('../../../assets/images/그룹 5780.png'),
    },
    {
      id: 2,
      title: '관절각도 증진 훈련 [1회차]',
      progress: 0,
      icon: require('../../../assets/images/그룹 5781.png'),
    },
  ];
  const prescription = {
    userName: '홍길동',
    items: [
      {
        title: '관절각도 훈련 처방',
        description: '장비를 착용하여 \n“관절각도 증진훈련” (10분), 목표각도 90도',
      },
      {
        title: '근력 및 전신운동 처방',
        description: '가이드 영상을 보면서\n따라하시는 운동 (약 30분)',
      },
    ],
  };

  // 패널 슬라이드
  const togglePanel = () => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? PANEL_HEIGHT - 150 : 0, // 150: 패널 숨길 높이(아이콘만 남김)
      duration: 300,
      useNativeDriver: true,
    }).start(() => setIsOpen(prev => !prev));
  };

  return (
    <SafeAreaView style={styles.container}>
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
          </TouchableOpacity>
          <Text style={styles.headerText}>아버님의, {'\n'}건강한 하루를 응원해요!</Text>
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

      {/* 아래에서 올라오는 패널 */}
      <Animated.View
        style={[
          styles.bottomPanel,
          {
            transform: [{ translateY: slideAnim }],
            height: PANEL_HEIGHT,
          },
        ]}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 36 }}
          showsVerticalScrollIndicator={false}
        >
        {/* 처방(보고서) */}
          <TouchableOpacity
            activeOpacity={0.95}
            style={styles.prescriptionCardWrapper}
            onPress={togglePanel}
          >              
        {/* 위아래 아이콘 */}
          <Image
            source={isOpen ? DOWN_ICON : UP_ICON}
            style={styles.panelArrow}
          />
          {/* 수술 정보 */}
          <Text style={styles.surgeryText}>{surgeryInfo}</Text>
          {/* 운동 플랜 리스트 */}
          <View style={styles.planContainer}>
            {exercisePlans.map((item, idx) => (
              <View key={idx} style={styles.planItem}>
                <Image source={item.icon} style={styles.planIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.planTitle}>{item.title}</Text>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                  </View>
                </View>
                <TouchableOpacity style={styles.exerciseBtn}
                onPress={() => router.push('exercise/training')}
                >
                  <Text style={styles.exerciseBtnText}>운동하기</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          
            <ImageBackground
              source={require('../../../assets/images/그룹 5789.png')}
              style={styles.prescriptionCard}
              imageStyle={styles.prescriptionBg}
              resizeMode="stretch"
            >

              <View style={styles.prescriptionInner}>
                <Text style={styles.prescriptionTitle}>
                  {prescription.userName}님의 맞춤 처방입니다.
                </Text>
                <Text style={styles.prescriptionSub}>
                  아래 처방을 매일 2회(1회, 2회) 진행해주세요.
                </Text>
                {prescription.items.map((item, idx) => (
                  <View key={idx} style={styles.exerciseBox}>
                    <Text style={styles.exerciseLabel}>{item.title}</Text>
                    <Text style={styles.exerciseDetail}>{item.description}</Text>
                  </View>
                ))}
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
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
  mainImg: { width: '100%', height: 240, marginTop: 20 },
  /* 패널 */
  bottomPanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8faff',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.12, shadowRadius: 12,
    elevation: 20,
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
