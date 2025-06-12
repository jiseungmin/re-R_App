// app/mypage.js
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { Stack } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MyPage() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 1) 상단 헤더 */}
      <ImageBackground
       source={require('../../../assets/images/그룹 5312.png')}
       style={styles.header}
       imageStyle={styles.headerBg}
       resizeMode="cover"
     >
       {/* 왼쪽: 프로필 + 이름 */}
       <View style={styles.headerLeft}>
         <Image
           source={require('../../../assets/images/profile_icon.png')}
           style={styles.profileImg}
         />
         <Text style={styles.userName}>아버</Text>
       </View>
       {/* 오른쪽: 가입일 */}
       <Text style={styles.joinDate}>가입일 2025-04-04</Text>
     </ImageBackground>
      <ScrollView contentContainerStyle={styles.content}>
        {/* 2) 섹션 타이틀 */}
        <Text style={styles.sectionTitle}>결과정보</Text>

        {/* 3) 결과 정보 버튼 (이미지 전체 배경 + 텍스트 오버레이) */}
        <View style={styles.resultSection}>
          <TouchableOpacity style={styles.card}>
            <ImageBackground
              source={require('../../../assets/images/그룹 5401.png')} // 전체 카드 이미지
              style={styles.cardBg}
              imageStyle={styles.cardRadius}
              resizeMode="cover"
            >
              <Text style={styles.cardTextOverlay}>평가 및 진단 결과</Text>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card}>
            <ImageBackground
              source={require('../../../assets/images/그룹 5402.png')} // 전체 카드 이미지
              style={styles.cardBg}
              imageStyle={styles.cardRadius}
              resizeMode="cover"
            >
              <Text style={styles.cardTextOverlay}>훈련 결과</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

         <Image
          source={require('../../../assets/images/사각형 1733.png')} 
          style={styles.divider}
          resizeMode="stretch"
        />

        {/* 4) 메뉴 리스트 */}
        <View style={styles.menu}>
          <MenuItem
            iconSource={require('../../../assets/images/그룹 5345.png')}
            label="회원정보 수정"
            onPress={() => {}}
          />
          <MenuItem
            iconSource={require('../../../assets/images/그룹 5801.png')}
            label="자주 묻는 질문"
            onPress={() => {}}
          />
          <MenuItem
            iconSource={require('../../../assets/images/그룹 5868.png')}
            label="알림 설정"
            onPress={() => {}}
          />
          <MenuItem
            iconSource={require('../../../assets/images/그룹 5350.png')}
            label="로그아웃"
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ iconSource, label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Image source={iconSource} style={styles.menuIcon} />
        <Text style={styles.menuText}>{label}</Text>
      </View>
      <Image
        source={require('../../../assets/images/Icon ionic-ios-arrow-forward 1.png')}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    width: '100%',
    height:180,
    aspectRatio: 375 / 180,   // (이미지 종횡비)
    flexDirection: 'row',     // ← 좌우 배치
    justifyContent: 'space-between',  // ← 양끝 스페이스
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBg: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
   profileImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    marginRight: 12,  // 이름과 간격
  },
   userInfo: {
    marginLeft: 12,
    flexDirection: 'row',     // ← 가로 배치
    alignItems: 'center',     // ← 세로 중앙 정렬
  },
  userName: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  joinDate: { color: '#fff', fontSize: 14, marginTop: 4 },

  content: {
    paddingBottom: 32,
  },

   divider: {
    width: '100%',        // 좌우 여백 주고 싶다면 '90%' 등으로 조절
    height: 5,           // 이미지 높이에 맞춰 조절
    alignSelf: 'center',
    marginVertical: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },

  resultSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  card: {
    width: 200,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardBg: {
    width: '100%',
    height: '100%',
    padding: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cardRadius: {
    borderRadius: 12,
  },
  cardTextOverlay: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  menu: { marginTop: -15 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { width: 24, height: 24 },
  menuText: { fontSize: 16, marginLeft: 12, color: '#333' },
  chevron: { width: 16, height: 16, tintColor: '#999' },
});
