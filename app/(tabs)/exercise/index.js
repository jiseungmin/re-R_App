// app/(tabs)/exercise/index.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
export default function Exercise() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ImageBackground
        source={require('../../../assets/images/group5805.png')}
        style={styles.header}
        imageStyle={styles.headerBgImage}
      >
        {/* 메뉴 아이콘 + 텍스트 그룹 */}
        <View style={styles.menuWithText}>
          <TouchableOpacity
            onPress={() => router.push('/menu')}
          >
            <ImageBackground
              source={require('../../../assets/images/그룹 104.png')}
              style={styles.menuIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <Text style={styles.headerText}>아버님의, {'\n'} 건강한 하루를 응원해요!</Text>
        </View>

        {/* 빈 공간 주거나 flex로 벌리기 위해 */}
        <View style={{ flex: 1 }} />

        {/* 사람 일러스트 */}
        <Image
          source={require('../../../assets/images/group3945.png')}
          style={styles.headerIllustration}
          resizeMode="contain"
        />
      </ImageBackground>

      {/* Illustration */}
      <Image
        source={require('../../../assets/images/group4800.png')}
        style={styles.mainImg}
        resizeMode="contain"
      />

      {/* Bottom Card */}
      <View style={styles.card}>
        <Text style={styles.cardText}>배정받은 운동플랜이 없습니다.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: 180,              // 배경 이미지 높이
    paddingTop: 16,           // SafeAreaView 상단 높이 고려
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBgImage: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 20,
  },
  headerIllustration: {
    width: 110,
    height: 110,
    // 필요하다면 위치 미세 조정
    marginRight: 10,
    marginTop: 40,
  },
  menuIcon: {
    width: 20,
    height: 20,
    // 필요하다면 위치 미세 조정
    marginLeft: 20,
    marginTop: 50,
    marginBottom:15
  },
  mainImg: {
    width: '100%',
    height: 240,
    marginTop: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#E5F2FF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cardText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});
