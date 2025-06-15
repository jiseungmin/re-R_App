// app/home/index.js
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Menu() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Expo Router 헤더 숨기기 */}
      <Stack.Screen options={{ headerShown: false }} />

      {/* 1) 상단 커스텀 헤더 */}
      <ImageBackground
        source={require('../../assets/images/그룹 5312.png')} // 예: 그룹 5312.png
        style={styles.header}
        imageStyle={styles.headerBg}
        resizeMode="cover"
      >
        {/* 닫기 버튼 */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Image
            source={require('../../assets/images/그룹 3868.png')}
            style={styles.closeIcon}
          />
        </TouchableOpacity>

        {/* 프로필 아이콘 */}
        <Image
          source={require('../../assets/images/profile_icon.png')}
          style={styles.profileImg}
        />

        {/* 사용자 이름 */}
        <Text style={styles.userName}>아버</Text>
      </ImageBackground>

      {/* 2) 리스트 */}
       <ScrollView contentContainerStyle={styles.content}>
        {/* 첫 번째 항목 */}
        <TouchableOpacity
          style={styles.item}
          onPress={() => router.push('/menu/checkMyHealth/HealthIntroCard')} // ← 이 부분 추가
        >
          <Image
            source={require('../../assets/images/그룹 5400.png')}
            style={styles.itemIcon}
          />
          <View style={styles.itemTextWrap}>
            <Text style={styles.itemTitle}>나의 건강을 체크해보세요</Text>
            <Text style={styles.itemSubtitle}>&lt;3개의 평가&gt;</Text>
          </View>
          <Image
            source={require('../../assets/images/Icon ionic-ios-arrow-forward.png')}
            style={styles.itemArrow}
          />
        </TouchableOpacity>


        <View style={styles.divider} />

        {/* 두 번째 항목 (textWrap 추가) */}
        <TouchableOpacity style={styles.item}>
          <Image
            source={require('../../assets/images/그룹 4803.png')}
            style={styles.itemIcon}
          />
          <View style={styles.itemTextWrap}>
            <Text style={styles.itemTitle}>오늘도 열심히 단련해보세요</Text>
          </View>
          <Image
            source={require('../../assets/images/Icon ionic-ios-arrow-forward.png')}
            style={styles.itemArrow}
          />
        </TouchableOpacity>
        <View style={styles.divider} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: SCREEN_WIDTH,
    height: undefined,
    aspectRatio: 375 / 180,       // 원본 헤더 이미지 비율
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBg: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 24,
    height: 24,
  },
  closeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  profileImg: {
    marginTop: 60,
    width: 48,
    height: 48,
    borderRadius: 36,
    backgroundColor: '#fff',
  },
  userName: {
    marginTop: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: '300',
  },

  content: {
    paddingVertical: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 25,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  itemIcon: {
    width: 74,
    height: 74,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: 'contain',
  },
  itemTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#888',
  },
  itemArrow: {
    width: 12,
    height: 12,
    tintColor: '#999',
    resizeMode: 'contain',
  },
  divider: {
    height: 2,
    backgroundColor: '#ddd',
    marginHorizontal: 20,
  },
});
