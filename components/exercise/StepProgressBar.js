import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

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
  // Animated values for each phase segment
  const animsRef = useRef(phases.map(() => new Animated.Value(0)));

  // 전체 duration
  const totalDuration = phases.reduce((sum, p) => sum + p.duration, 0);
  // 각 segment의 width 비율 계산
  const segmentWidths = phases.map(p => totalDuration > 0 ? barWidth * (p.duration / totalDuration) : 0);
  // divider 위치 계산 (누적합)
  let accWidth = 0;
  const dividers = [];
  for (let i = 1; i < phases.length; i++) {
    accWidth += segmentWidths[i - 1];
    dividers.push(accWidth);
  }

  const currentIdx = phases.findIndex(p => p.key === currentPhase);

  useEffect(() => {
    // Pause or stop: freeze current animation state
    if (paused || stopped) {
      animsRef.current.forEach(anim => anim.stopAnimation());
      return;
    }

    // Build animations based on phaseElapsed
    const animations = phases.map((phase, idx) => {
      const value = idx < currentIdx
        ? 1
        : idx === currentIdx
        ? Math.min(phaseElapsed / phase.duration, 1)
        : 0;
      return Animated.timing(animsRef.current[idx], {
        toValue: value,
        duration: 0,
        useNativeDriver: false,
      });
    });

    // Run all segment animations in parallel
    Animated.parallel(animations).start();
  }, [phases.length, currentIdx, phaseElapsed, paused, stopped, resetKey]);

  if (!phases.length) return null;

  return (
    <View style={[styles.container, { width: barWidth }]}>   
      <View style={styles.row}>
        {phases.map((phase, idx) => (
          <View key={phase.key} style={[styles.segmentWrap, { width: segmentWidths[idx] }]}> 
            <View style={styles.bgSegment} />
            <Animated.View
              style={[
                styles.fgSegment,
                {
                  width: animsRef.current[idx].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, segmentWidths[idx]],
                  }),
                },
              ]}
            />
          </View>
        ))}
        {dividers.map((left, idx) => (
          <View
            key={`div-${idx}`}
            style={[styles.divider, { left }]}
          />
        ))}
      </View>
      <View style={styles.textOverlay} pointerEvents="none">
        {phases.map((phase, idx) => (
          <View key={phase.key} style={[styles.textWrap, { width: segmentWidths[idx] }]}>  
            <Text style={styles.label}>{phase.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
    height: 36,
  },
  segmentWrap: {
    height: '100%',
    position: 'relative',
  },
  bgSegment: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#3b82f6',
  },
  fgSegment: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#22c55e',
    zIndex: 1,
  },
  divider: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#ffffff',
    zIndex: 2,
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 3,
  },
  textWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
