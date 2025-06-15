import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
const { width } = Dimensions.get('window');

export default function KneeAngleMeasurement({ onNext }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Image
            source={require('../../../../assets/images/그룹 177.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>무릎각도</Text>
        </View>
        {/* 빈 공간으로 뒤로가기 버튼과 균형 맞춤 */}
        <View style={{ width: 34 }} />
      </View>

      {/* 타이틀과 밑줄, 부제목 */}
      <View style={styles.titleArea}>
        <Text style={styles.title}>측정하기</Text>
        <View style={styles.titleLine} />
        <Text style={styles.subtitle}>측정 설명 내용</Text>
      </View>

      {/* 이미지와 텍스트 박스 */}
      <View style={styles.imageBox}>
        <Image
          source={require('../../../../assets/images/사각형 956.png')} // 배경 박스 이미지
          style={styles.imageBackground}
        />
        <Image
          source={require('../../../../assets/images/그룹 3974.png')} // 무릎 그림
          style={styles.kneeImage}
        />
        <Text style={styles.caption}>
          무릎을 최대한{' '}
          <Text style={styles.highlight}>굽혀</Text>
          보세요
        </Text>
      </View>

      {/* 다음 버튼 */}
      <TouchableOpacity style={styles.nextButton} onPress={onNext}>
        <Image
          source={require('../../../../assets/images/사각형 2450.png')}
          style={styles.nextButtonImage}
        />
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  backButton: {
    paddingRight: 10,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  headerTitleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
  },

  titleArea: {
    width: '80%',
    alignItems: 'flex-start',
    marginBottom: 24,
    marginTop: 40, // 중간 위치 조정용 간격
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  titleLine: {
    marginTop: 4,
    width: 83,
    height: 2,
    backgroundColor: '#ccc',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
  },

  imageBox: {
    width: '80%',
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  imageBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
    borderRadius: 16,
  },
  kneeImage: {
    width: '80%',
    height: '70%',
    resizeMode: 'contain',
    marginBottom: 12,
  },
  caption: {
    position: 'absolute',
    bottom: 12,
    fontSize: 16,
    color: '#000',
  },
  highlight: {
    color: '#007bff',
    fontWeight: 'bold',
  },

  nextButton: {
    width: '100%', // 너비 확장
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginHorizontal: 0, // 좌우 간격 추가
  },
  nextButtonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  nextButtonText: {
    position: 'absolute',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
