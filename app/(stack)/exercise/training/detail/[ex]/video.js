import React from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EXERCISES } from '../../../../../../constants/Exercises_info';
import VideoPlayerContainer from '../../../../../../components/exercise/VideoPlayerContainer';
import VideoPlayerUI from '../../../../../../components/exercise/VideoPlayerUI';

export default function VideoScreen() {
  const { ex } = useLocalSearchParams();
  const idx = Number(ex);
  const exercise = EXERCISES[idx];
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const pauseOverlayData = {
    title: exercise.title,
    subtitle: exercise.subtitle || '',
    descriptionList: exercise.description,
  };

  // VideoPlayerContainer에 render props 패턴으로 UI를 전달
  return (
    <VideoPlayerContainer
      videoSource={exercise.video}
      repsPerSet={exercise.repsPerSet}
      prepTime={exercise.prepTime}           // 추가
      cooldownTime={exercise.cooldownTime}   // 추가
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
        />
      )}
    />
  );
}
