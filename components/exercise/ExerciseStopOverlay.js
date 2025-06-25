import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';

export default function PauseOverlay({
  onResume,
  onHome,
  onCallClinic,
  onCall119,
}) {
  return (
    <View style={styles.overlay}>
      <Text style={styles.statusText}>운동 중단</Text>

      {/* 홈으로 돌아가기 (오렌지 버튼 이미지) */}
      <TouchableOpacity style={styles.imgBtnWrap} onPress={onHome}>
        <ImageBackground
          source={require('../../assets/images/사각형 orange.png')}
          style={styles.imgBtn}
          imageStyle={styles.imgBtnRadius}
          resizeMode="stretch"
        >
          <Text style={styles.imgBtnText}>홈 화면으로 돌아가기</Text>
        </ImageBackground>
      </TouchableOpacity>

      {/* 운동 재개 (파란 버튼 이미지) */}
      <TouchableOpacity style={styles.imgBtnWrap} onPress={onResume}>
        <ImageBackground
          source={require('../../assets/images/사각형 2450.png')}
          style={styles.imgBtn}
          imageStyle={styles.imgBtnRadius}
          resizeMode="stretch"
        >
          <Text style={styles.imgBtnText}>운동 재개</Text>
        </ImageBackground>
      </TouchableOpacity>

      <Text style={styles.emergencyLabel}>긴급 연락</Text>

      {/* 외래 병원 */}
      <TouchableOpacity style={styles.emergencyBtnWrap} onPress={onCallClinic}>
        <ImageBackground
          source={require('../../assets/images/사각형 2044.png')}
          style={styles.emergencyBtn}
          imageStyle={styles.imgBtnRadius}
          resizeMode="stretch"
        >
          <View style={styles.emergencyBtnInner}>
            {/* 왼쪽 아이콘 */}
            <Image
              source={require('../../assets/images/call_icon.png')}
              style={styles.callIconLeft}
              resizeMode="contain"
            />
            {/* 중앙 텍스트 */}
            <Text style={styles.emergencyBtnText}>외래 병원</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>

      {/* 119 */}
      <TouchableOpacity style={styles.emergencyBtnWrap} onPress={onCall119}>
        <ImageBackground
          source={require('../../assets/images/사각형 2044.png')}
          style={styles.emergencyBtn}
          imageStyle={styles.imgBtnRadius}
          resizeMode="stretch"
        >
          <View style={styles.emergencyBtnInner}>
            <Image
              source={require('../../assets/images/call_icon.png')}
              style={styles.callIconLeft}
              resizeMode="contain"
            />
            <Text style={styles.emergencyBtnText}>119</Text>
          </View>
        </ImageBackground>
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
  statusText: { fontSize: 20, color: '#fff', marginBottom: 16, fontWeight: 'bold' },
  imgBtnWrap: { marginBottom: 12, width: 320, alignItems: 'center' },
  imgBtn: { width: 320, height: 56, justifyContent: 'center', alignItems: 'center' },
  imgBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  imgBtnRadius: { borderRadius: 32 },
  emergencyLabel: { color: '#fff', fontSize: 16, marginVertical: 10,marginTop:100 },
  emergencyBtnWrap: { marginBottom: 10, width: 320, alignItems: 'center' },
  emergencyBtn: {
    width: 320,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  // 버튼 내 실제 컨텐츠 배치
  emergencyBtnInner: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // 텍스트 중앙 배치
    position: 'relative',
  },
  // 왼쪽 끝 아이콘 배치
  callIconLeft: {
    width: 28,
    height: 28,
    position: 'absolute',
    left: 16, // 버튼 왼쪽에서 16px 여백
  },
  emergencyBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
});
