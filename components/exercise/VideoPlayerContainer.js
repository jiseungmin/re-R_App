import React, { useEffect, useRef, useState } from 'react';
import { useVideoPlayer } from 'expo-video';

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

  const repRef = useRef(currentRep);
  const setRef = useRef(currentSet);
  const pausedRef = useRef(paused);
  const stoppedRef = useRef(stopped);

  useEffect(() => { repRef.current = currentRep; }, [currentRep]);
  useEffect(() => { setRef.current = currentSet; }, [currentSet]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  useEffect(() => { stoppedRef.current = stopped; }, [stopped]);

  const player = useVideoPlayer(videoSource, p => {
    p.loop = false;
    p.play();
    console.log('[PLAYER INIT] Video player initialized and playing');
  });

  useEffect(() => {
    if (!player) return;

    console.log('[NEW VIDEO SOURCE]', videoSource);

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

    // 영상 끝에 도달 시 반복 및 세트 카운팅
    const endSub = player.addListener('playToEnd', () => {
      console.log(`[VIDEO END] Current set: ${setRef.current}, Current rep: ${repRef.current}`);

      if (repRef.current < repsPerSet) {
        const nextRep = repRef.current + 1;
        console.log(`[REPEAT] Increment rep: ${repRef.current} -> ${nextRep}`);
        setCurrentRep(nextRep);
        player.currentTime = 0;
        player.play();
      } else if (setRef.current < totalSets) {
        const nextSet = setRef.current + 1;
        console.log(`[SET COMPLETE] Set ${setRef.current} complete. Moving to set ${nextSet}, reset rep to 1`);
        setCurrentSet(nextSet);
        setCurrentRep(1);
        player.currentTime = 0;
        player.play();
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
  }, [player, repsPerSet, totalSets, onComplete, videoSource]);

  // 재생/일시정지 제어
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

  // 영상 변경 시 상태 초기화
  useEffect(() => {
    setCurrentRep(1);
    setCurrentSet(1);
    setPaused(false);
    setStopped(false);
    console.log('[STATE RESET] Video source changed - Resetting state');
    console.log('[NEW VIDEO SOURCE]', videoSource);
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
