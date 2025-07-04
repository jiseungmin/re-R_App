import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  SafeAreaView, StyleSheet,
  Text, TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CountdownOverlay from '../../../../../components/popup/CountdownOverlay';
import { EXERCISES } from '../../../../../constants/Exercises_info';

const { width } = Dimensions.get('window');

export default function Detail() {
  // 쿼리에서 step, skipped 받아오기
  const params = useLocalSearchParams();
  const step = params.step ? Number(params.step) : 0;
  const skipped = params.skipped ? JSON.parse(params.skipped) : [];

  const exercise = EXERCISES[step];
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [countdown, setCountdown] = useState(0);

  // 카운트다운 후 영상 페이지로
  const handleStart = () => {
    setCountdown(5);
    let n = 5;
    const interval = setInterval(() => {
      n -= 1;
      if (n > 0) setCountdown(n);
      else {
        clearInterval(interval);
        setCountdown(0);
        // step, skipped 상태 유지
        router.push({
          pathname: `/exercise/training/detail/${step}/video`,
          params: { step, skipped: JSON.stringify(skipped) }
        });
      }
    }, 1000);
  };

  // 건너뛰기 → 다음 설명페이지
  const handleSkip = () => {
    Alert.alert(
      '건너뛰기',
      '이 운동을 건너뛰시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: () => {
            const next = step + 1;
            // skipped 추가
            const nextSkipped = [...skipped, step];
            if (next >= EXERCISES.length) {
              // 모든 운동 끝나면 리스트(Program)로 이동
              router.replace('/exercise/training/program');
            } else {
              // 다음 운동 설명으로
              router.replace({
                pathname: `/exercise/training/detail/${EXERCISES[next].id}`,
                params: { step: next, skipped: JSON.stringify(nextSkipped) }
              });
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>{`${step + 1}. ${exercise.title}`}</Text>
        <View style={styles.descBox}>
          <Text style={styles.descHeader}>[운동 설명]</Text>
          {exercise.description.map((t, i) => (
            <Text key={i} style={styles.descText}>{`${i + 1}. ${t}`}</Text>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={[styles.startWrap, { bottom: insets.bottom + 60 }]}
        onPress={handleStart}
        disabled={countdown > 0}
      >
        <ImageBackground
          source={require('../../../../../assets/images/사각형 2.png')}
          style={styles.startBtn}
          imageStyle={styles.btnRadius}
          resizeMode="stretch"
        >
          <Text style={styles.startText}>시작하기</Text>
        </ImageBackground>
      </TouchableOpacity>
      {countdown > 0 && <CountdownOverlay count={countdown} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  body: { flex: 1, padding: 16, justifyContent: 'center' },
  stepText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FF66', // 초록색
    marginBottom: 16,
    textAlign: 'center',
  },
  descBox: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginBottom: 24,
  },
  descHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  descText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'left',
  },
  startWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  startBtn: {
    width: width - 32,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnRadius: { borderRadius: 25 },
  startText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
