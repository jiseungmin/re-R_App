import React, { useEffect, useRef, useState } from 'react';
import { useVideoPlayer } from 'expo-video';
import { useEvent } from 'expo';

export default function VideoPlayerContainer({
  videoSource,
  repsPerSet,
  totalSets,
  onComplete,
  render,
}) {
  const [currentRep, setCurrentRep] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);

  // 최신값 Ref
  const repRef = useRef(currentRep);
  const setRef = useRef(currentSet);
  const pausedRef = useRef(paused);
  const stoppedRef = useRef(stopped);
  const skipFirstPlayToEnd = useRef(true);

  useEffect(() => { repRef.current = currentRep; }, [currentRep]);
  useEffect(() => { setRef.current = currentSet; }, [currentSet]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { stoppedRef.current = stopped; }, [stopped]);

  useEffect(() => {
    console.log(`[STATE] SET: ${currentSet}/${totalSets} | REP: ${currentRep}/${repsPerSet} | PAUSED: ${paused} | STOPPED: ${stopped}`);
  }, [currentSet, currentRep, paused, stopped, repsPerSet, totalSets]);

  const player = useVideoPlayer(videoSource, player => {
    console.log('[PLAYER INIT] loop=false, play start');
    player.loop = false;
    player.play();
  });

  useEvent(
    player,
    'loaded',
    payload => {
      console.log('[VIDEO LOADED] duration:', payload?.duration, '| player.duration:', player.duration);
    },
    [player]
  );

  useEvent(
    player,
    'playToEnd',
    () => {
      if (skipFirstPlayToEnd.current) {
        console.log('[playToEnd] 최초 이벤트 skip (이후 정상 카운트)');
        skipFirstPlayToEnd.current = false;
        return;
      }

      console.log(`[EVENT] playToEnd fired (SET: ${setRef.current}/${totalSets}, REP: ${repRef.current}/${repsPerSet}, PAUSED: ${pausedRef.current}, STOPPED: ${stoppedRef.current})`);
      if (repRef.current < repsPerSet) {
        setCurrentRep(prev => prev + 1);
        setTimeout(() => {
          setPaused(false);
          if (!pausedRef.current && !stoppedRef.current) {
            console.log('>> player.replay() 호출');
            player.replay();
          }
        }, 0);
      } else if (setRef.current < totalSets) {
        setCurrentSet(prev => prev + 1);
        setCurrentRep(1);
        setTimeout(() => {
          setPaused(false);
          if (!pausedRef.current && !stoppedRef.current) {
            console.log('>> player.replay() 호출');
            player.replay();
          }
        }, 0);
      } else {
        setPaused(true);
        player.pause();
        if (onComplete) onComplete();
        console.log('>> 모든 세트/반복 종료. 일시정지');
      }
    },
    [player, repsPerSet, totalSets]
  );

  useEffect(() => {
    skipFirstPlayToEnd.current = true;
    setCurrentRep(1);
    setCurrentSet(1);
    setPaused(false);
    setStopped(false);
  }, [videoSource]);

  return render({
    player,
    currentRep,
    currentSet,
    paused,
    stopped,
    repsPerSet,
    totalSets,
    setPaused,
    setStopped,
    setCurrentRep,
    setCurrentSet,
  });
}
