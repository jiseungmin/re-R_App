import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet, View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLLAPSED_HEIGHT = SCREEN_HEIGHT * 0.29; // 닫혔을 때(23%)
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.8;   // 열렸을 때(80%)

export default function SlideUpPrescriptionPanel({
  isOpen, surgeryInfo, exercisePlans, prescription, togglePanel, onStartExercise
}) {
  // height Animated Value
  const heightAnim = useRef(new Animated.Value(COLLAPSED_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isOpen ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
      duration: 350, // 속도 조절
      useNativeDriver: false,
    }).start();
  }, [isOpen]);

  return (
    <Animated.View style={[styles.bottomPanel, { height: heightAnim }]}>
      <View style={styles.panelBg}>
        <TouchableOpacity style={styles.handleArea} onPress={togglePanel} activeOpacity={0.9}>
          <Image
            source={require('../../assets/images/위로스크롤icon.png')}
            style={[
              styles.handleIcon,
              { transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }
            ]}
          />
        </TouchableOpacity>

        <View style={styles.surgeryBox}>
          <Text style={styles.surgeryText}>{surgeryInfo}</Text>
        </View>

        <View style={styles.planContainer}>
          {exercisePlans.slice(0, 2).map((item) => (
            <View key={item.id} style={styles.planItem}>
              <Image source={item.icon} style={styles.planIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.planTitle}>{item.title}</Text>
                <View style={styles.progressBarWrap}>
                  <View style={styles.progressBarBG} />
                  <View style={[styles.progressBarFG, { width: `${item.progress}%` }]} />
                </View>
              </View>
              <TouchableOpacity style={styles.exerciseBtn} onPress={() => onStartExercise(item)}>
                <Image
                  source={require('../../assets/images/사각형 2181.png')}
                  style={styles.exerciseBtnImg}
                />
                <Text style={styles.exerciseBtnText}>운동하기</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.prescriptionCardWrapper}>
          <View style={styles.prescriptionCard}>
            <Image
              source={require('../../assets/images/그룹 5789.png')}
              style={styles.prescriptionBg}
              resizeMode="stretch"
            />
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
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bottomPanel: {
    position: 'absolute',
    left: -10, right: -10, bottom: 10,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    overflow: 'visible',
    zIndex: 10,
  },
  panelBg: {
    flex: 1,
    width: '100%',
    backgroundColor: '#E7F1FB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: 1000,
  },
  handleArea: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 2,
  },
  handleIcon: {
    width: 36, height: 36, opacity: 0.88,
  },
  surgeryBox: {
    width: '92%',
    alignSelf: 'center',
    marginBottom: 10,
    backgroundColor: '#fff', borderRadius: 12,
    elevation: 1,
    paddingVertical: 8,
    marginTop: 0,
  },
  surgeryText: {
    fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#222',
  },
  planContainer: {
    width: '92%',
    alignSelf: 'center',
    marginBottom: 6,
  },
  planItem: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 10,
    backgroundColor: '#fff', borderRadius: 15,
    paddingVertical: 7, paddingHorizontal: 8,
    elevation: 2, shadowOpacity: 0.02,
  },
  planIcon: {
    width: 30, height: 30, marginRight: 10,
  },
  planTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 2, color: '#444' },
  progressBarWrap: {
    marginTop: 3, marginBottom: 1,
    height: 8, justifyContent: 'center',
  },
  progressBarBG: {
    backgroundColor: '#EBEBEB', height: 8, borderRadius: 4, width: '100%', position: 'absolute',
  },
  progressBarFG: {
    backgroundColor: '#378AFF', height: 8, borderRadius: 4,
    position: 'absolute', left: 0, top: 0, bottom: 0,
  },
  exerciseBtn: {
    marginLeft: 8,
    width: 68,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  exerciseBtnImg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  exerciseBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    zIndex: 1,
  },
  prescriptionCardWrapper: {
    width: '96%',
    alignItems: 'center',
    marginTop: 0,
  },
  prescriptionCard: {
    width: '96%', aspectRatio: 335 / 340,
    minHeight: 310, alignSelf: 'center',
    justifyContent: 'flex-start', overflow: 'hidden',
    position: 'relative',
    paddingTop: 10,
    borderRadius: 20,
  },
  prescriptionBg: {
    width: '100%', height: '100%',
    borderRadius: 16,
    position: 'absolute',
    left: 0, top: 0,
  },
  prescriptionInner: {
    flex: 1, paddingHorizontal: 20, paddingTop: 38,
  },
  prescriptionTitle: {
    fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#222', textAlign: 'center',
  },
  prescriptionSub: {
    fontSize: 13, marginBottom: 10, color: '#444', textAlign: 'center',
  },
  exerciseBox: {
    marginBottom: 7,
  },
  exerciseLabel: {
    fontWeight: 'bold', fontSize: 14, marginBottom: 2, color: '#333', textAlign: 'center'
  },
  exerciseDetail: {
    fontSize: 13, color: '#555', lineHeight: 18, textAlign: 'center'
  },
});
