import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function PauseOverlay({
  title,
  subtitle,
  descriptionList,
  onResume,
})
{  const insets = useSafeAreaInsets();
  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={[styles.replayBtn, { top: insets.top + 20, right: 24 }]}
        onPress={onResume}
        activeOpacity={0.8}
      >
      </TouchableOpacity>
      {/* 타이틀: 박스 위에 위치 */}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.contentBox}>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        <View style={styles.descBox}>
          {descriptionList.map((desc, i) => (
            <Text key={i} style={styles.descText}>{desc}</Text>
          ))}
        </View>
      </View>
      {/* 하단 고정 운동 재개 버튼 */}
      <TouchableOpacity
        style={[
          styles.resumeBtn,
          { bottom: insets.bottom + 24 }, // SafeArea + 추가 여백
        ]}
        onPress={onResume}
        activeOpacity={0.8}
      >
        <Text style={styles.resumeBtnText}>운동 재개</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    color: '#31FF74',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  contentBox: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: width - 32,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
  descBox: {
    marginTop: 8,

    width: '100%',
  },
  descText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 30,
    marginBottom: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resumeBtn: {
    position: 'absolute',
    left: 24,
    right: 24,
    // bottom은 컴포넌트에서 동적으로 설정
    height: 56,
    backgroundColor: '#056ad9',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
