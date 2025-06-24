import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EXERCISES } from '../../../../../../constants/Exercises_info';
import ExercisePauseOverlay from '../../../../../../components/exercise/ExercisePauseOverlay';
import ExerciseStopOverlay from '../../../../../../components/exercise/ExerciseStopOverlay';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';

const { width } = Dimensions.get('window');
const OVERLAY_HEIGHT = 80;

export default function VideoScreen() {
  const { ex } = useLocalSearchParams();
  const idx = Number(ex);
  const exercise = EXERCISES[idx];

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // 비디오 플레이어 초기화
  const player = useVideoPlayer(exercise.video, player => {
    console.log('[init] player created, loop=false, play start');
    player.loop = false;
    player.play();
  });

  const [currentTime, setCurrentTime] = useState(0);
 // 상태 & useRef로 최신값 추적
  const [currentRep, setCurrentRep] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);

  // 최신값 Ref
  const repRef = useRef(currentRep);
  const setRef = useRef(currentSet);
  const pausedRef = useRef(paused);
  const stoppedRef = useRef(stopped);

  // 상태 변경 시 Ref 동기화
  useEffect(() => { repRef.current = currentRep; }, [currentRep]);
  useEffect(() => { setRef.current = currentSet; }, [currentSet]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { stoppedRef.current = stopped; }, [stopped]);

  // 시간 업데이트
  useEvent(
    player,
    'timeUpdate',
    payload => {
      if (payload?.currentTime !== undefined) {
        setCurrentTime(payload.currentTime);
      }
    },
    [player]
  );
useEvent(
  player,
  'loaded',
  (payload) => {
    console.log('[Video loaded] duration:', payload?.duration);
  },
  [player]
);


// playToEnd
  useEvent(
    player,
    'playToEnd',
    () => {
      console.log('[playToEnd] fired! rep:', repRef.current, 'set:', setRef.current, 'paused:', pausedRef.current, 'stopped:', stoppedRef.current);

      if (repRef.current < exercise.repsPerSet) {
        setCurrentRep(prev => prev + 1);
        setTimeout(() => {
          if (!pausedRef.current && !stoppedRef.current) {
            console.log('>> 반복, player.replay() 실행');
            player.replay();
          }
        }, 0);
      } else if (setRef.current < exercise.totalSets) {
        setCurrentSet(prev => prev + 1);
        setCurrentRep(1);
        setTimeout(() => {
          if (!pausedRef.current && !stoppedRef.current) {
            console.log('>> 세트 변경, player.replay() 실행');
            player.replay();
          }
        }, 0);
      } else {
        console.log('>> 모든 반복과 세트 종료. 일시정지');
        setPaused(true);
        player.pause();
      }
    },
    [player, exercise.repsPerSet, exercise.totalSets]
  );



  // pause/play 제어
  useEffect(() => {
    if (!player) return;
    if (paused || stopped) {
      console.log('[effect] player.pause() 호출');
      player.pause();
    } else {
      console.log('[effect] player.play() 호출');
      player.play();
    }
  }, [paused, stopped, player]);

  // 탭바 숨김 처리
  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
      return () => navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
    }, [navigation])
  );

  // 진입 시 자동재생
  useEffect(() => {
    if (player) {
      console.log('[effect] 첫 마운트 or player 갱신: player.play() 호출');
      player.play();
    }
  }, [player]);

  // 재생 토글
  const togglePlay = () => {
    setPaused(p => {
      console.log('[togglePlay] paused:', !p);
      return !p;
    });
  };

  // 중단
  const handleStop = () => {
    console.log('[handleStop] 중단 버튼 클릭');
    setStopped(true);
  };

  // 오버레이 버튼 핸들러
  const handleResume = () => {
    console.log('[handleResume] 재개');
    setPaused(false);
  };
  const handleHome = () => {
    console.log('[handleHome] 홈으로');
    navigation.navigate('(tabs)', { screen: 'exercise' });
  };
  const handleCallClinic = () => console.log('[handleCallClinic] 외래 병원에 전화 연결');
  const handleCall119 = () => console.log('[handleCall119] 119에 전화 연결');
  const closeStopOverlay = () => {
    console.log('[closeStopOverlay] 중단 오버레이 닫기');
    setStopped(false);
  };

  // 운동 설명용 데이터
  const pauseOverlayData = {
    title: exercise.title,
    subtitle: exercise.subtitle || '',
    descriptionList: exercise.description,
  };

  useEffect(() => {
    console.log('[STATE] set:', currentSet, 'rep:', currentRep, 'paused:', paused, 'stopped:', stopped);
  }, [currentRep, currentSet, paused, stopped]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 비디오 풀스크린 */}
      <View style={StyleSheet.absoluteFill}>
        {player && (
          <VideoView
            player={player}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            nativeControls={false}
          />
        )}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => {}}
        />
      </View>

      {/* TOP OVERLAY */}
      <View
        style={[styles.topOverlay, { top: insets.top, height: OVERLAY_HEIGHT }]}
        pointerEvents="box-none"
      >
        <View style={styles.progressContainer}>
          <View style={styles.segmentRow}>
            <View style={[styles.segment, styles.segmentActive, styles.leftRadius]}>
              <Text style={styles.segmentText}>준비동작</Text>
            </View>
            <View style={[styles.segment, styles.segmentInactive]}>
              <Text style={styles.segmentText}>유지</Text>
            </View>
            <View style={[styles.segment, styles.segmentInactive, styles.rightRadius]}>
              <Text style={styles.segmentText}>마무리동작</Text>
            </View>
          </View>
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>{`Set ${currentSet}/${exercise.totalSets}`}</Text>
            <Text style={styles.counterText}>{`${currentRep}/${exercise.repsPerSet}회`}</Text>
          </View>
        </View>
        {!paused && !stopped && (
          <TouchableOpacity onPress={togglePlay} style={styles.iconButton}>
            <Image
              source={require('../../../../../../assets/images/stop_button.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
        {paused && !stopped && (
          <TouchableOpacity onPress={togglePlay} style={styles.iconButton}>
            <Image
              source={require('../../../../../../assets/images/play_button.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 중단 버튼 */}
      {!paused && !stopped && (
        <TouchableOpacity
          style={[styles.stopWrap, { bottom: insets.bottom + 16 }]}
          onPress={handleStop}
        >
          <ImageBackground
            source={require('../../../../../../assets/images/사각형 2040@2x 1.png')}
            style={styles.stopBtn}
            imageStyle={styles.btnRadius}
            resizeMode="stretch"
          >
            <Text style={styles.stopText}>중단</Text>
          </ImageBackground>
        </TouchableOpacity>
      )}

      {/* 일시정지 오버레이 */}
      {paused && !stopped && (
        <ExercisePauseOverlay
          title={pauseOverlayData.title}
          subtitle={pauseOverlayData.subtitle}
          descriptionList={pauseOverlayData.descriptionList}
          onResume={handleResume}
        />
      )}

      {/* 중단 오버레이 */}
      {stopped && (
        <ExerciseStopOverlay
          onResume={() => {
            closeStopOverlay();
            setPaused(false);
          }}
          onHome={() => {
            closeStopOverlay();
            handleHome();
          }}
          onCallClinic={handleCallClinic}
          onCall119={handleCall119}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  progressContainer: { flex: 1, alignItems: 'center' },
  segmentRow: { flexDirection: 'row', overflow: 'hidden' },
  segment: { paddingVertical: 4, paddingHorizontal: 12 },
  segmentActive: { backgroundColor: '#4CAF50' },
  segmentInactive: { backgroundColor: '#0057D9' },
  segmentText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  leftRadius: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
  rightRadius: { borderTopRightRadius: 20, borderBottomRightRadius: 20 },
  counterContainer: { marginTop: 4, alignItems: 'center' },
  counterText: { fontSize: 12, color: '#fff' },
  iconButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  icon: { width: 40, height: 40 },
  stopWrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  stopBtn: { width: width - 32, height: 48, justifyContent: 'center', alignItems: 'center' },
  btnRadius: { borderRadius: 24 },
  stopText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
