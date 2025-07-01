import { useIsFocused } from '@react-navigation/native';
import { useVideoPlayer } from 'expo-video';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';

// phases: [{key, label, duration}], repsPerSet, totalSets, repsPerSet, videoSource
export default function VideoPlayerContainer({
  repsPerSet,
  totalSets,
  videoSource,
  onComplete,
  render,
  cooldownTime,
  stayTime,  
  prepTime,
  restBetweenSets,
}) {
  const [currentRep, setCurrentRep] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [restCountdown, setRestCountdown] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const currentPhaseIdxRef = useRef(0);
  const phaseElapsedRef = useRef(0);
  const [phaseState, setPhaseState] = useState({ idx: 0, elapsed: 0 });

  const player = useVideoPlayer(videoSource, p => {
    p.loop = false;
    p.play();
  });

  // phaseOrder: 데이터 기반 기본값
  const basePhaseOrder = useMemo(() => [
    ...(prepTime > 0 ? [{ key: 'prep', label: '준비', duration: prepTime }] : []),
    ...(stayTime > 0 ? [{ key: 'stay', label: '유지', duration: stayTime }] : []),
    ...(cooldownTime > 0 ? [{ key: 'cooldown', label: '마무리', duration: cooldownTime }] : []),
  ], [prepTime, stayTime, cooldownTime]);

  // 누적 시간 구간 계산
  const phaseRanges = useMemo(() => {
    let acc = 0;
    return basePhaseOrder.map(phase => {
      const start = acc;
      acc += phase.duration;
      return { ...phase, start, end: acc };
    });
  }, [basePhaseOrder]);

  // 마무리 phase만 영상 남은 시간으로 duration 동적 할당
  const validPhaseOrder = useMemo(() => {
    if (
      basePhaseOrder.length > 0 &&
      basePhaseOrder[basePhaseOrder.length - 1].key === 'cooldown' &&
      player &&
      typeof player.duration === 'number' &&
      typeof player.currentTime === 'number'
    ) {
      // 현재 phase가 마무리 단계일 때만 duration을 영상 남은 시간으로 교체
      return basePhaseOrder.map((phase, idx) => {
        if (phase.key === 'cooldown') {
          const remain = Math.max(1, Math.round(player.duration - phaseRanges[idx].start));
          return { ...phase, duration: remain };
        }
        return phase;
      });
    }
    // 그 외에는 데이터 기반
    return basePhaseOrder.length > 0 ? basePhaseOrder : [{ key: 'prep', label: '준비', duration: 1 }];
  }, [basePhaseOrder, player, phaseRanges]);

  const isFocused = useIsFocused();

  // currentTime 기반 phaseIdx, phaseElapsed 계산
  useEffect(() => {
    if (!player || isResting) return;
    let raf;
    const updatePhase = () => {
      const t = typeof player.currentTime === 'number' ? player.currentTime : 0;
      let idx = 0;
      let elapsed = 0;
      for (let i = 0; i < phaseRanges.length; i++) {
        if (t >= phaseRanges[i].start && t < phaseRanges[i].end) {
          idx = i;
          elapsed = t - phaseRanges[i].start;
          break;
        }
        // 마지막 phase(마무리)일 때는 end 이상도 포함
        if (i === phaseRanges.length - 1 && t >= phaseRanges[i].start) {
          idx = i;
          elapsed = t - phaseRanges[i].start;
        }
      }
      currentPhaseIdxRef.current = idx;
      phaseElapsedRef.current = elapsed;
      setPhaseState({ idx, elapsed });
      raf = requestAnimationFrame(updatePhase);
    };
    raf = requestAnimationFrame(updatePhase);
    return () => raf && cancelAnimationFrame(raf);
  }, [player, phaseRanges, isResting]);

  useEffect(() => {
    if (!isFocused) setPaused(true);
  }, [isFocused]);

  // 휴식 타이머
  useEffect(() => {
    if (!isResting) return;
    setRestCountdown(restBetweenSets || 0);
    const interval = setInterval(() => {
      setRestCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setCurrentSet(set => set + 1);
          setCurrentRep(1);
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
  }, [isResting, restBetweenSets, player]);

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
  }, [player, repsPerSet, totalSets, onComplete, videoSource]);

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
    setPhaseState({ idx: 0, elapsed: 0 });
  }, [videoSource]);

  return (
    <View style={{ flex: 1 }}>
      {render({
        phases: validPhaseOrder,
        currentPhase: validPhaseOrder[phaseState.idx]?.key || 'prep',
        phaseElapsed: phaseState.elapsed,
        phaseDuration: validPhaseOrder[phaseState.idx]?.duration || 0,
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