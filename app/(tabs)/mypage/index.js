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
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MyPage() {
  const router = useRouter();
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
            onPress={() => router.push('/faq')}
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
  height: 150,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 0,
  paddingTop: 50,
  // flexWrap: 'nowrap' (기본값)
},

headerLeft: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1,
  marginLeft: 20,   // 왼쪽 가장자리에서 띄우기
  marginRight: 10,  // 오른쪽 텍스트와 간격
},

joinDate: {
  color: '#fff',
  fontSize: 14,
  marginTop: 4,
  flexShrink: 1,
  maxWidth: SCREEN_WIDTH * 0.4,
  textAlign: 'right',
  marginRight: 20,  // 오른쪽 가장자리에서 띄우기
},

  headerBg: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
   profileImg: {
    width: 50,
    height: 50,
    borderRadius: 36,
    backgroundColor: '#fff',
    marginRight: 12,  // 이름과 간격
  },
   userInfo: {
    marginLeft: 12,
    flexDirection: 'row',     // ← 가로 배치
    alignItems: 'center',     // ← 세로 중앙 정렬
  },
  userName: { color: '#fff', fontSize: 24},

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
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 5,
  },

  resultSection: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginHorizontal: 20,
  flexWrap: 'wrap',     // 여러 줄로 넘칠 시 줄바꿈 허용
  },

  card: {
    width: (SCREEN_WIDTH - 60) / 2,  // 좌우 마진 포함해 2개 카드 균등 분할
    height: (SCREEN_WIDTH - 60) / 2, // 정사각형 크기, 필요시 고정 높이 조절
    borderRadius: 12,
    overflow: 'hidden',   // 카드 아래 간격
    marginHorizontal: 2,
  },

  cardBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  cardTextOverlay: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 5,  // 텍스트가 끝에 붙는 문제 완화
  },

  cardRadius: {
    borderRadius: 12,
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
