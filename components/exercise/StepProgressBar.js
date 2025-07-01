import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

export default function StepProgressBar({
  phases = [],      // [{key, label, duration}]
  currentPhase,     // 'prep'|'stay'|'cooldown'
  phaseElapsed,     // 0부터 증가
}) {
  const [anims, setAnims] = useState(() => phases.map(() => new Animated.Value(0)));
  
  // phases 배열이 변경될 때 anims 배열 업데이트
  useEffect(() => {
    setAnims(phases.map(() => new Animated.Value(0)));
  }, [phases.length]);

  useEffect(() => {
    if (phases.length === 0 || anims.length === 0) return;
    
    phases.forEach((phase, idx) => {
      if (idx >= anims.length) return;
      
      let value = 0;
      if (phase.key === currentPhase) {
        value = Math.max(0, Math.min(1, phaseElapsed / phase.duration));
      } else if (phases.findIndex(p => p.key === phase.key) < phases.findIndex(p => p.key === currentPhase)) {
        value = 1;
      }
      Animated.timing(anims[idx], {
        toValue: value,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    });
  }, [phases, currentPhase, phaseElapsed, anims]);

  const currentObj = phases.find(phase => phase.key === currentPhase);
  const remainSec = currentObj
    ? Math.max(0, Math.floor(currentObj.duration - phaseElapsed))
    : 0;
    
  // phases가 비어있으면 아무것도 렌더링하지 않음
  if (!phases || phases.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {phases.map((phase, idx) => {
          const isActive = phase.key === currentPhase;
          return (
            <View
              key={phase.key}
              style={[
                styles.phaseBox,
                idx === 0 && styles.leftRadius,
                idx === phases.length - 1 && styles.rightRadius,
              ]}
            >
              <Animated.View
                style={[
                  styles.fillBar,
                  {
                    width: anims[idx].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: isActive ? '#1568c7' : '#89aee6',
                  },
                  idx === 0 && styles.leftRadius,
                  idx === phases.length - 1 && styles.rightRadius,
                ]}
              />
              <Text style={styles.phaseText}>{phase.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10, width: '95%', alignSelf: 'center' },
  row: { flexDirection: 'row', height: 38, marginBottom: 0, overflow: 'hidden', borderRadius: 14, backgroundColor: '#e3eefd' },
  phaseBox: {
    flex: 1,
    backgroundColor: 'transparent',
    marginRight: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    height: 38,
  },
  fillBar: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    zIndex: 1,
    opacity: 1,
  },
  leftRadius: { borderTopLeftRadius: 14, borderBottomLeftRadius: 14 },
  rightRadius: { borderTopRightRadius: 14, borderBottomRightRadius: 14, marginRight: 0 },
  phaseText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
    zIndex: 2,
    position: 'relative',
    textAlign: 'center',
  },
});
