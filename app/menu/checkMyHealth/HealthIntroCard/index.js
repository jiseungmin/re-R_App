import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HealthIntroCard({ onNext, onBack }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        {/* 일러스트 + 추천드립니다 + 아이콘 */}
        <View style={styles.illustrationWrap}>
          <Image
            source={require('../../../../assets/images/그룹 3949.png')}
            style={styles.illustration}
          />
          <View style={styles.titleOverlay}>
            <Text style={styles.title}>추천드립니다</Text>
            <Image
              source={require('../../../../assets/images/그룹 3957.png')}
              style={styles.topIcon}
            />
          </View>
        </View>

        {/* 밑줄 */}
        <View style={styles.separator} />

        {/* 설명 */}
        <Text style={styles.desc}>
          홍길동님에게 꼭 필요한 훈련을{'\n'}
          알려드리기 전에 몇 가지 검사가{'\n'}
          필요합니다.{'\n\n'}
          어렵지 않으니 다음 3가지 평가를{'\n'}
          모두 응답해주세요!
        </Text>

        {/* 버튼 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.imageButton}> 
            <Image
              source={require('../../../../assets/images/사각형 49.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.backButtonText}>돌아가기</Text>
          </TouchableOpacity>

          <TouchableOpacity  onPress={() => router.push('./kneeAngleScreen')} style={styles.imageButton}>
            <Image
              source={require('../../../../assets/images/사각형 960.png')}
              style={styles.buttonImage}
            />
            <Text style={styles.nextButtonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  centerContent: {
    alignItems: 'center',
    width: '100%',
  },
  illustrationWrap: {
    width: '70%',
    height: 160,
    marginBottom: 12,
    position: 'relative',
  },
  illustration: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: -30,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  topIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  separator: {
    width: '67%',
    marginTop: 20,
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    color: '#444',
    textAlign: 'left',
    lineHeight: 22,
    marginBottom: 15,
    paddingLeft: 8, // 추가: 왼쪽 여백을 넣어 "추천드립니다" 텍스트 기준 맞춤
    width: '70%',   // illustrationWrap과 너비 통일
  },
  
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  imageButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    width: 120,
    height: 48,
    resizeMode: 'contain',
  },
  backButtonText: {
    position: 'absolute',
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  nextButtonText: {
    position: 'absolute',
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});
