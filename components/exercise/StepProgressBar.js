import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
export default function StepProgressBar({
  phases = [],
  currentPhase,
  phaseElapsed,
  barWidth = 340,
}) {
  const [anims, setAnims] = useState(() => phases.map(() => new Animated.Value(0)));
  const animationRefs = useRef(phases.map(() => null));
  
  // divider 관련 상수
  const dividerWidth = 2;
  const dividerCount = phases.length - 1;
  const totalDividerWidth = dividerCount * dividerWidth;
  const segmentWidth = (barWidth - totalDividerWidth) / phases.length;
  
  // 전체 시간 계산
  const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
  
  // 각 phase별 진행률 계산
  useEffect(() => {
    if (phases.length === 0) return;
    phases.forEach((phase, idx) => {
      let value = 0;
      if (phase.key === currentPhase) {
        value = Math.max(0, Math.min(1, phaseElapsed / phase.duration));
      } else if (phases.findIndex(p => p.key === phase.key) < phases.findIndex(p => p.key === currentPhase)) {
        value = 1;
      }
      // 애니메이션 적용
      if (animationRefs.current[idx]) {
        animationRefs.current[idx].stop();
      }
      const animation = Animated.timing(anims[idx], {
        toValue: value,
        duration: 1000,
        useNativeDriver: false,
        easing: Easing.linear,
      });
      animationRefs.current[idx] = animation;
      animation.start();
    });
  }, [phases, currentPhase, phaseElapsed]);

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
                  width: anims[idx].interpolate({
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
