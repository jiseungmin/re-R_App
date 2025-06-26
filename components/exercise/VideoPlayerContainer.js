import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { useVideoPlayer } from 'expo-video';
import { useIsFocused } from '@react-navigation/native';


export default function VideoPlayerContainer({
  videoSource,
  repsPerSet=1,
  totalSets =1,
  restTime = 1, // 휴식 시간 (초)
  onComplete,
  render,
}) {
  // 상태
  const [currentRep, setCurrentRep] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restCountdown, setRestCountdown] = useState(0);

  // refs 최신 상태 유지용
  const repRef = useRef(currentRep);
  const setRef = useRef(currentSet);
  const pausedRef = useRef(paused);
  const stoppedRef = useRef(stopped);
  const isRestingRef = useRef(isResting);
  const restCountdownRef = useRef(restCountdown);
  const isFocused = useIsFocused();

  useEffect(() => { repRef.current = currentRep; }, [currentRep]);
  useEffect(() => { setRef.current = currentSet; }, [currentSet]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { stoppedRef.current = stopped; }, [stopped]);
  useEffect(() => { isRestingRef.current = isResting; }, [isResting]);
  useEffect(() => { restCountdownRef.current = restCountdown; }, [restCountdown]);

  const player = useVideoPlayer(videoSource, p => {
    p.loop = false;
    p.play();
    console.log('[PLAYER INIT] Video player initialized and playing');
  });

  useEffect(() => {
  if (!isFocused) setPaused(true);
}, [isFocused]);


  // 휴식 타이머 관리
  useEffect(() => {
    if (!isResting) return;

    setRestCountdown(restTime);
    const interval = setInterval(() => {
      setRestCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // 휴식 종료 처리 (딜레이 줘서 play 안정화)
          const nextSet = setRef.current + 1;
          console.log(`[REST END] Rest complete. Move to set ${nextSet}, reset rep to 1.`);
          setCurrentSet(nextSet);
          setCurrentRep(1);
          setIsResting(false);
          setPaused(false);
          player.currentTime = 0;
          setTimeout(() => {
            player.play();
          }, 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isResting, restTime, player]);

  // 영상 종료 시 반복 및 세트 증가 처리
  useEffect(() => {
    if (!player) return;

    const statusSub = player.addListener('statusChange', ({ status }) => {
      console.log(`[PLAYER STATUS] status: ${status}`);
      if (status === 'error') {
        setStopped(true);
        console.error('[PLAYER ERROR] Video loading error');
      }
    });

    const playingSub = player.addListener('playingChange', ({ isPlaying }) => {
      console.log('[PLAYER PLAYING CHANGE] isPlaying:', isPlaying);
    });

    const endSub = player.addListener('playToEnd', () => {
      console.log(`[VIDEO END] Set ${setRef.current}, Rep ${repRef.current}`);

      if (repRef.current < repsPerSet) {
        const nextRep = repRef.current + 1;
        console.log(`[REPEAT] Increment rep: ${repRef.current} -> ${nextRep}`);
        setCurrentRep(nextRep);
        player.currentTime = 0;
        player.play();
      } else if (setRef.current < totalSets) {
        console.log(`[SET COMPLETE] Set ${setRef.current} complete. Start rest for ${restTime}s`);
        setIsResting(true);
        setPaused(true);
        player.pause();
      } else {
        console.log('[EXERCISE COMPLETE] All sets and reps finished');
        setPaused(true);
        setStopped(true);
        player.pause();
        if (onComplete) onComplete();
      }
    });

    return () => {
      statusSub.remove();
      playingSub.remove();
      endSub.remove();
      console.log('[CLEANUP] Removed player event listeners');
    };
  }, [player, repsPerSet, totalSets, restTime, onComplete, videoSource]);

  // 재생/일시정지 상태 제어
  useEffect(() => {
    if (!player) return;

    if (paused || stopped) {
      player.pause();
      console.log(`[PLAYER CONTROL] Player paused (paused:${paused}, stopped:${stopped})`);
    } else {
      player.play();
      console.log(`[PLAYER CONTROL] Player playing`);
    }
  }, [paused, stopped, player]);

  // 비디오 소스 변경 시 초기 상태 리셋
  useEffect(() => {
    setCurrentRep(1);
    setCurrentSet(1);
    setPaused(false);
    setStopped(false);
    setIsResting(false);
    setRestCountdown(0);
    console.log('[STATE RESET] Video source changed - Resetting state');
    console.log('[NEW VIDEO SOURCE]', videoSource);
  }, [videoSource]);

  // 항상 렌더 호출, 휴식 시 paused 상태로 영상 멈춤, 휴식 UI 오버레이 표시
  return (
    <View style={{ flex: 1 }}>
      {render({
        player,
        currentRep,
        currentSet,
        paused: paused || isResting,
        stopped,
        repsPerSet,
        totalSets,
        restCountdown,
        setPaused,
        setStopped,
        setCurrentRep,
        setCurrentSet,
        isResting,
      })}

      {isResting && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}>
          <Text style={{ fontSize: 36, color: 'white' }}>
            휴식 시간: {restCountdown}초
          </Text>
        </View>
      )}
    </View>
  );
}
