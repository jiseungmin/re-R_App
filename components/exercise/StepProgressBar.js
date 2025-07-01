import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
export default function StepProgressBar({
  phases = [],
  currentPhase,
  phaseElapsed,
  barWidth = 340,
  resetKey,
  paused,
  stopped,
}) {
  const animsRef = useRef(phases.map(() => new Animated.Value(0)));
  const animationRefs = useRef(phases.map(() => null));
  
  // divider 관련 상수
  const dividerWidth = 2;
  const dividerCount = phases.length - 1;
  const totalDividerWidth = dividerCount * dividerWidth;
  const segmentWidth = (barWidth - totalDividerWidth) / phases.length;
  
  // 전체 시간 계산
  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
  
  // phases가 바뀌면 animsRef를 새로 생성
  useEffect(() => {
    console.log('[StepProgressBar] 마운트/업데이트', { currentPhase, phaseElapsed, resetKey });
    animsRef.current = phases.map(() => new Animated.Value(0));
    animationRefs.current = phases.map(() => null);
    return () => {
      console.log('[StepProgressBar] 언마운트/cleanup', { currentPhase, phaseElapsed, resetKey, animationRefs: animationRefs.current, anims: animsRef.current });
      if (Array.isArray(animationRefs.current)) {
        animationRefs.current.forEach(a => a?.stop && a.stop());
      }
      if (Array.isArray(animsRef.current)) {
        animsRef.current.forEach(v => v && v.stopAnimation && v.stopAnimation());
      }
    };
  }, [phases.length, resetKey]);
  
  useEffect(() => {
    console.log('[StepProgressBar] useEffect 트리거', { currentPhase, phaseElapsed, resetKey, paused, stopped });
    if (paused || stopped) {
      console.log('[StepProgressBar] cleanup (pause/stop/skip)', { currentPhase, phaseElapsed, resetKey, animationRefs: animationRefs.current, anims: animsRef.current });
      animationRefs.current.forEach(a => a?.stop && a.stop());
      animsRef.current.forEach(v => v && v.stopAnimation && v.stopAnimation());
      return;
    }
    phases.forEach((phase, idx) => {
      let value = 0;
      let animDuration = 1000;
      if (phase.key === currentPhase) {
        const cappedElapsed = Math.min(phaseElapsed, phase.duration);
        value = Math.max(0, cappedElapsed / phase.duration);
        if (phaseElapsed >= phase.duration) {
          animDuration = 0;
        }
      } else if (
        phases.findIndex(p => p.key === phase.key)
        < phases.findIndex(p => p.key === currentPhase)
      ) {
        value = 1;
        animDuration = 0;
      }
      if (animationRefs.current[idx]) {
        animationRefs.current[idx].stop();
      }
      const animation = Animated.timing(animsRef.current[idx], {
        toValue: value,
        duration: animDuration,
        useNativeDriver: false,
        easing: Easing.linear,
      });
      animationRefs.current[idx] = animation;
      animation.start();
    });
    return () => {
      console.log('[StepProgressBar] 언마운트/cleanup', { currentPhase, phaseElapsed, resetKey, animationRefs: animationRefs.current, anims: animsRef.current });
      animationRefs.current.forEach(anim => anim?.stop());
      animsRef.current.forEach(v => v.stopAnimation && v.stopAnimation());
    };
  }, [phases, currentPhase, phaseElapsed, resetKey, paused, stopped]);
  
  if (!phases || phases.length === 0) return null;

  return (
    <View style={[styles.barOuter, { width: barWidth }]}>
      <View style={styles.barRow}>
        {/* 각 세그먼트별 배경/진행 바 */}
        {phases.map((phase, idx) => (
          <View key={`seg-${phase.key}`} style={[styles.segmentWrap, { width: segmentWidth }]}> 
            <View style={styles.backgroundSegment} />
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: animsRef.current[idx].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, segmentWidth],
                  }),
                },
              ]}
            />
          </View>
        ))}
        {/* 흰색 구분선들 */}
        {phases.slice(1).map((phase, idx) => {
          const left = idx * (segmentWidth + dividerWidth) + segmentWidth;
          return (
            <View
              key={`divider-${idx}`}
              style={[
                styles.divider,
                {
                  left,
                }
              ]}
            />
          );
        })}
        {/* 텍스트 오버레이 */}
        <View style={styles.textOverlay}>
          {phases.map((phase, idx) => (
            <View
              key={phase.key}
              style={[
                styles.phaseTextContainer,
                { width: segmentWidth },
              ]}
            >
              <Text style={styles.phaseText}>{phase.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  barOuter: {
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  barRow: {
    height: 36,
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'row',
  },
  segmentWrap: {
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundSegment: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#3b82f6',
  },
  progressBar: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#22c55e',
    zIndex: 1,
  },
  divider: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#ffffff',
    zIndex: 3,
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 2,
    pointerEvents: 'none',
  },
  phaseTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  phaseText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
