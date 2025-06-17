// app/(tabs)/kneeAngleMeasurement.js
import { useRouter } from 'expo-router';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function KneeAngleMeasurement() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Image
            source={require('../../../../assets/images/previous_arrow.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>무릎각도</Text>
        <View style={styles.backButton} />
      </View>

      {/* 2. Content */}
      <View style={styles.content}>
        {/* 2-1. Title area */}
        <View style={styles.titleArea}>
          <Text style={styles.mainTitle}>측정하기</Text>
          <Text style={styles.subtitle}>측정 설명 내용</Text>
        </View>

        {/* 2-2. Illustration box */}
        <View style={styles.imageBox}>
          <Image
            source={require('../../../../assets/images/그룹 3974.png')}
            style={styles.kneeImage}
          />
          <Text style={styles.caption}>
            무릎을 최대한 <Text style={styles.highlight}>굽혀</Text> 보세요
          </Text>
        </View>

        {/* 2-3. 측정하기 버튼 (titleLine 대신 사용) */}
        <TouchableOpacity style={styles.measureButton} onPress={() => router.push('./kneeAngleScreen')} activeOpacity={0.8}>
          <Text style={styles.measureButtonText}>측정하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // SafeArea + 전체 레이아웃
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  // 헤더
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
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
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },

  // Content 영역
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // Title area
  titleArea: {
    width: '100%',
    marginTop: 40,
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 28,      // 더 크게
    fontWeight: 'bold',
    color: '#000',
    textDecorationLine: 'underline'
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    marginTop: 16,
  },

  // Illustration box
  imageBox: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 24,
  },
  kneeImage: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.4,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  caption: {
    fontSize:24,
    color: '#000',
    fontWeight: 'bold',
  },
  highlight: {
    color: '#4f6dff',
    fontWeight: 'bold',
  },

  // 측정하기 버튼
  measureButton: {
    width: '90%',
    height: 48,
    backgroundColor: '#4f6dff',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 64,   // 이미지 박스 아래 여유
  },
  measureButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
