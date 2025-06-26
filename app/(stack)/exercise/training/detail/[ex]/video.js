import React from 'react';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EXERCISES } from '../../../../../../constants/Exercises_info';
import VideoPlayerContainer from '../../../../../../components/exercise/VideoPlayerContainer';
import VideoPlayerUI from '../../../../../../components/exercise/VideoPlayerUI';

export default function VideoScreen() {
  const params = useLocalSearchParams();
  const idx = params.step ? Number(params.step) : 0; // step 파라미터 기준
  const skipped = params.skipped ? JSON.parse(params.skipped) : [];
  const exercise = EXERCISES[idx];
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();

  // 다음 설명 페이지로 이동 (자동)
const goNextDetail = () => {
  const next = idx + 1;
  if (next >= EXERCISES.length) {
    router.replace('/exercise/training/program');
  } else {
    router.push({
      pathname: `/exercise/training/detail/${EXERCISES[next].id}`,
      params: { step: next, skipped: JSON.stringify(skipped) }
    });
  }
};


  const pauseOverlayData = {
    title: exercise.title,
    subtitle: exercise.subtitle || '',
    descriptionList: exercise.description,
  };

  return (
    <VideoPlayerContainer
      videoSource={exercise.video}
      repsPerSet={exercise.repsPerSet}
      prepTime={exercise.prepTime}
      cooldownTime={exercise.cooldownTime}
      totalSets={exercise.totalSets}
      render={containerProps => (
        <VideoPlayerUI
          {...containerProps}
          insets={insets}
          exercise={exercise}
          pauseOverlayData={pauseOverlayData}
          handleResume={() => containerProps.setPaused(false)}
          handleHome={() => navigation.navigate('(tabs)', { screen: 'exercise' })}
          handleCallClinic={() => console.log('외래 병원에 전화 연결')}
          handleCall119={() => console.log('119에 전화 연결')}
          closeStopOverlay={() => containerProps.setStopped(false)}
          togglePlay={() => containerProps.setPaused(prev => !prev)}
          handleStop={() => containerProps.setStopped(true)}
          onComplete={goNextDetail} // ✅ 이 부분!
          onSkip={() => {
            // 필요하다면 스킵도 지원
            const next = idx + 1;
            const nextSkipped = [...skipped, idx];
            if (next >= EXERCISES.length) {
              router.replace('/exercise/training/program');
            } else {
              router.push({
                pathname: `/exercise/training/detail/${EXERCISES[next].id}`,
                params: { step: next, skipped: JSON.stringify(nextSkipped) }
              });
            }
          }}
        />
      )}
    />
  );
}
