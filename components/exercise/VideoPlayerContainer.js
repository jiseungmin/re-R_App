import { useIsFocused } from '@react-navigation/native';
import { useVideoPlayer } from 'expo-video';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

// phases: [{key, label, duration}], repsPerSet, totalSets, restTime, videoSource
export default function VideoPlayerContainer({
  repsPerSet,
  totalSets,
  restTime = 3,
  videoSource,
  onComplete,
  render,
  cooldownTime,
  stayTime,  
  prepTime
}) {
  const [currentRep, setCurrentRep] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restCountdown, setRestCountdown] = useState(0);
  const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);
  const [playCount, setPlayCount] = useState(0);

  const phaseOrder = [
    ...(prepTime > 0 ? [{ key: 'prep', label: '준비', duration: prepTime +3}] : []),
    ...(stayTime > 0 ? [{ key: 'stay', label: '유지', duration: stayTime }] : []),
    ...(cooldownTime > 0 ? [{ key: 'cooldown', label: '마무리', duration: cooldownTime+2 }] : []),
  ];
  
  // phaseOrder가 비어있으면 기본값 설정
  const validPhaseOrder = phaseOrder.length > 0 ? phaseOrder : [{ key: 'prep', label: '준비', duration: 1 }];

  const isFocused = useIsFocused();

  const player = useVideoPlayer(videoSource, p => {
    p.loop = false;
    p.play();
  });

  // currentPhaseIdx가 유효한 범위를 벗어나지 않도록 보호
  useEffect(() => {
    if (currentPhaseIdx >= validPhaseOrder.length) {
      setCurrentPhaseIdx(0);
    }
  }, [currentPhaseIdx, validPhaseOrder.length]);

  useEffect(() => {
    if (!isFocused) setPaused(true);
  }, [isFocused]);

  // phase 바뀔 때 경과시간 리셋
  useEffect(() => {
    setPhaseElapsed(0);
  }, [currentPhaseIdx]);

  // 단계 타이머
  useEffect(() => {
    if (paused || stopped || isResting) return;
    const thisPhase = validPhaseOrder[currentPhaseIdx];
    if (!thisPhase) return;

    const timer = setInterval(() => {
      setPhaseElapsed(prev => {
        if (prev + 1 >= thisPhase.duration) {
          if (currentPhaseIdx + 1 < validPhaseOrder.length) {
            setCurrentPhaseIdx(idx => idx + 1);
          } else {
            setCurrentPhaseIdx(0);
          }
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentPhaseIdx, paused, stopped, isResting, validPhaseOrder]);

  // 휴식 타이머
  useEffect(() => {
    if (!isResting) return;
    setRestCountdown(restTime);
    const interval = setInterval(() => {
      setRestCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCurrentSet(set => set + 1);
          setCurrentRep(1);
          setCurrentPhaseIdx(0);
          setIsResting(false);
          setPaused(false);
          player.currentTime = 0;
          setTimeout(() => player.play(), 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isResting, restTime, player]);

  // 비디오 끝날 때: 반복/세트/휴식 흐름 관리
  useEffect(() => {
    if (!player) return;
    const targetCount = repsPerSet * totalSets;

    const statusSub = player.addListener('statusChange', ({ status }) => {
      if (status === 'error') {
        setStopped(true);
      }
    });

    const endSub = player.addListener('playToEnd', () => {
      setPlayCount(prev => {
        const newCount = prev + 1;
        if (newCount >= targetCount) {
          if (onComplete) onComplete();
          player.pause();
          return newCount;
        }
        // 반복/세트
        const totalRepsDone = newCount;
        const currentSetNum = Math.min(Math.floor(totalRepsDone / repsPerSet) + 1, totalSets);
        const currentRepNum = Math.min((totalRepsDone % repsPerSet) + 1, repsPerSet);
        console.log('[운동 playToEnd]', {
          newCount,
          targetCount,
          currentSetNum,
          currentRepNum,
          totalSets,
          repsPerSet
        });
        setCurrentSet(currentSetNum);
        setCurrentRep(currentRepNum);
        setCurrentPhaseIdx(0);

        // 세트 마지막 반복이면 휴식
        if (
          currentRepNum === repsPerSet &&
          currentSetNum < totalSets &&
          newCount < targetCount
        ) {
          setIsResting(true);
          setPaused(true);
          player.pause();
        } else {
          player.currentTime = 0;
          player.play();
        }
        return newCount;
      });
    });

    return () => {
      statusSub.remove();
      endSub.remove();
    };
  }, [player, repsPerSet, totalSets, restTime, onComplete, videoSource]);

  useEffect(() => {
    if (!player) return;
    if (paused || stopped) player.pause();
    else player.play();
  }, [paused, stopped, player]);

  // 소스 바뀌면 상태 초기화
  useEffect(() => {
    setCurrentRep(1);
    setCurrentSet(1);
    setPaused(false);
    setStopped(false);
    setIsResting(false);
    setRestCountdown(0);
    setPlayCount(0);
    setCurrentPhaseIdx(0);
    setPhaseElapsed(0);
  }, [videoSource]);

  return (
    <View style={{ flex: 1 }}>
      {render({
        phases: validPhaseOrder,
        currentPhase: validPhaseOrder[currentPhaseIdx]?.key || 'prep',
        phaseElapsed,
        phaseDuration: validPhaseOrder[currentPhaseIdx]?.duration || 0,
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
