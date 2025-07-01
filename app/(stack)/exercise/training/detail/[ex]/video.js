import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import VideoPlayerContainer from '../../../../../../components/exercise/VideoPlayerContainer';
import VideoPlayerUI from '../../../../../../components/exercise/VideoPlayerUI';
import { EXERCISES } from '../../../../../../constants/Exercises_info';

export default function VideoScreen() {
  const params = useLocalSearchParams();
  const idx = params.step ? Number(params.step) : 0; // step 파라미터 기준
  const skipped = params.skipped ? JSON.parse(params.skipped) : [];
  const exercise = EXERCISES[idx];
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  const [showComplete, setShowComplete] = useState(false);
  const [skipUnmount, setSkipUnmount] = useState(false); // skip 시 언마운트용 상태 추가

  // 다음 설명 페이지로 이동 (자동)
  const goNextDetail = () => {
    const next = idx + 1;
    if (next >= EXERCISES.length) {
      // 운동 다 끝나면 평가 페이지로 이동
      router.replace('/menu/checkMyHealth/PostExercise/postpain');
    } else {
      router.push({
        pathname: `/exercise/training/detail/${EXERCISES[next].id}`,
        params: { step: next, skipped: JSON.stringify(skipped) }
      });
    }
  };

  // 워밍업(비디오 없는 경우)에서도 건너뛰기 지원
  function handleSkip() {
    Alert.alert(
      '건너뛰기',
      '이 운동을 건너뛰시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '확인',
          onPress: () => {
            setSkipUnmount(true); // skip 시 언마운트 트리거
            const next = idx + 1;
            const nextSkipped = [...skipped, idx];
            if (next >= EXERCISES.length) {
              // 마지막 운동인 경우
              Alert.alert(
                '운동 완료',
                '마지막 운동이 끝났습니다.',
                [
                  {
                    text: '확인',
                    onPress: () => {
                      router.replace('/menu/checkMyHealth/PostExercise/postpain');
                    }
                  }
                ]
              );
            } else {
              router.push({
                pathname: `/exercise/training/detail/${EXERCISES[next].id}`,
                params: { step: next, skipped: JSON.stringify(nextSkipped) }
              });
            }
          }
        }
      ]
    );
  }

  const pauseOverlayData = {
    title: exercise.title,
    subtitle: exercise.subtitle || '',
    descriptionList: exercise.description,
  };

  // 5분 카운트 타이머 컴포넌트
  function FiveMinTimer({ onComplete }) {
    const [seconds, setSeconds] = useState(300);
    const [paused, setPaused] = useState(false);
    const [stopped, setStopped] = useState(false);
    useEffect(() => {
      if (paused || stopped) return;
      if (seconds <= 0) {
        if (onComplete) onComplete();
        return;
      }
      const timer = setInterval(() => setSeconds(s => s - 1), 1000);
      return () => clearInterval(timer);
    }, [seconds, paused, stopped]);
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    // 영상 영역에만 시간 표시
    return (
      <>
        <VideoPlayerUI
          player={null}
          currentRep={1}
          currentSet={1}
          repsPerSet={1}
          totalSets={1}
          paused={paused}
          stopped={stopped}
          setPaused={setPaused}
          setStopped={setStopped}
          onSkip={handleSkip}
          insets={insets}
          pauseOverlayData={pauseOverlayData}
          handleResume={() => setPaused(false)}
          handleHome={() => {
            setSkipUnmount(true);
            setTimeout(() => navigation.navigate('(tabs)', { screen: 'exercise' }), 0);
          }}
          handleCallClinic={() => {}}
          handleCall119={() => {}}
          closeStopOverlay={() => setStopped(false)}
          togglePlay={() => setPaused(prev => !prev)}
          handleStop={() => setStopped(true)}
          currentPhase={'prep'}
          phaseElapsed={300 - seconds}
          phaseDuration={300}
          phases={[{ key: 'prep', label: '준비', duration: 300 }]}
          skipDisabled={false}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 48, color: '#fff', fontWeight: 'bold', textShadowColor: '#000', textShadowOffset: {width: 2, height: 2}, textShadowRadius: 4 }}>{min}:{sec.toString().padStart(2, '0')}</Text>
            <Text style={{ fontSize: 24, color: '#fff', marginTop: 16, textShadowColor: '#000', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 }}>워밍업 중입니다</Text>
          </View>
        </VideoPlayerUI>
        {showComplete && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 280 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 16 }}>모든 프로그램을 전부 완료하셨습니다</Text>
              <Text style={{ fontSize: 16, color: '#444', marginBottom: 24 }}>메인화면으로 돌아갑니다.</Text>
              <TouchableOpacity onPress={() => router.replace('/menu/checkMyHealth/PostExercise/postpain')} style={{ backgroundColor: '#4f6dff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32 }}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </>
    );
  }

  // video가 없으면 5분 타이머만 보여주기
  if (!exercise.video) {
    if (skipUnmount) return null; // skip 시 언마운트
    return <FiveMinTimer onComplete={goNextDetail} />;
  }

  return (
    <>
      <VideoPlayerContainer
        videoSource={exercise.video}
        repsPerSet={exercise.repsPerSet}
        prepTime={exercise.prepTime}
        cooldownTime={exercise.cooldownTime}
        stayTime={exercise.stayTime}
        totalSets={exercise.totalSets}  
        restBetweenSets={exercise.restBetweenSets}
        onComplete={goNextDetail}
        render={containerProps => (
          <VideoPlayerUI
            {...containerProps}
            insets={insets}
            exercise={exercise}
            pauseOverlayData={pauseOverlayData}
            handleResume={() => containerProps.setPaused(false)}
            handleHome={() => {
              setSkipUnmount(true);
              setTimeout(() => navigation.navigate('(tabs)', { screen: 'exercise' }), 0);
            }}
            handleCallClinic={() => console.log('외래 병원에 전화 연결')}
            handleCall119={() => console.log('119에 전화 연결')}
            closeStopOverlay={() => containerProps.setStopped(false)}
            togglePlay={() => containerProps.setPaused(prev => !prev)}
            handleStop={() => containerProps.setStopped(true)}
            onSkip={handleSkip}
            skipDisabled={false}
          />
        )}
      />
      {showComplete && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, alignItems: 'center', width: 280 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#222', marginBottom: 16 }}>모든 프로그램을 전부 완료하셨습니다</Text>
            <Text style={{ fontSize: 16, color: '#444', marginBottom: 24 }}>메인화면으로 돌아갑니다.</Text>
            <TouchableOpacity onPress={() => router.replace('/menu/checkMyHealth/PostExercise/postpain')} style={{ backgroundColor: '#4f6dff', borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32 }}>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}
