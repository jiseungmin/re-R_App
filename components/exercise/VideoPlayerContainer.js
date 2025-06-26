import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { useVideoPlayer } from 'expo-video';
import { useIsFocused } from '@react-navigation/native';

export default function VideoPlayerContainer({
  videoSource,
  repsPerSet = 1,
  totalSets = 1,
  restTime = 1,
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
  const [playCount, setPlayCount] = useState(0); // 추가: 전체 플레이 횟수

  const playCountRef = useRef(0);
  useEffect(() => { playCountRef.current = playCount }, [playCount]);

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
          const totalRepsDone = playCountRef.current;
          const nextSet = Math.floor(totalRepsDone / repsPerSet) + 1;
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
  }, [isResting, restTime, player, repsPerSet]);

  // 영상 종료 시 반복 및 세트 증가 처리 (카운트 기반)
  useEffect(() => {
    if (!player) return;

    const targetCount = repsPerSet * totalSets;

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
      setPlayCount(prev => {
        const newCount = prev + 1;
        console.log('--- playToEnd ---', newCount, '/', targetCount);

        if (newCount >= targetCount) {
          console.log('=== EXERCISE COMPLETE: call onComplete() ===');
          player.pause();
          if (onComplete) onComplete();
          return newCount;
        }

        // 다음 세트/반복 표시 (원래대로 진행)
        const totalRepsDone = newCount;
        const currentSetNum = Math.floor(totalRepsDone / repsPerSet) + 1;
        const currentRepNum = (totalRepsDone % repsPerSet) + 1;
        setCurrentSet(currentSetNum > totalSets ? totalSets : currentSetNum);
        setCurrentRep(currentRepNum > repsPerSet ? repsPerSet : currentRepNum);

        // 마지막 반복이 아니라면 플레이 재개
        player.currentTime = 0;
        player.play();

        // 세트 마지막 반복이면 휴식 타임
        if (currentRepNum === repsPerSet && currentSetNum <= totalSets && currentSetNum !== 1 && newCount < targetCount) {
          setIsResting(true);
          setPaused(true);
          player.pause();
        }
        return newCount;
      });
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
    setPlayCount(0); // 카운트도 초기화
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
            backgroundColor: 'rgb(0, 0, 0)',
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
