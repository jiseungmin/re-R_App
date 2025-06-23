// app/mypage.js
import { Stack, useRouter } from 'expo-router';
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal
} from 'react-native';
import { useState,} from 'react';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function MyPage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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
          <TouchableOpacity style={styles.card}      onPress={() => {
          router.push('mypage/result');
        }}>
            <ImageBackground
              source={require('../../../assets/images/그룹 5401.png')} // 전체 카드 이미지
              style={styles.cardBg}
              imageStyle={styles.cardRadius}
              resizeMode="cover"
         
            >
              <Text style={styles.cardTextOverlay}>평가 및 진단 결과</Text>
            </ImageBackground>
          </TouchableOpacity>

            <TouchableOpacity style={styles.card}      onPress={() => {
          router.push('mypage/train');
        }}>
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
            onPress={() => router.push('mypage/signupedit')}
          />
          <MenuItem
            iconSource={require('../../../assets/images/그룹 5801.png')}
            label="자주 묻는 질문"
            onPress={() => router.push('mypage/faq')}
          />
          <MenuItem
            iconSource={require('../../../assets/images/그룹 5868.png')}
            label="알림 설정"
            onPress={() => router.push('mypage/notification')}
          />
          <MenuItem
            iconSource={require('../../../assets/images/그룹 5350.png')}
            label="로그아웃"
            onPress={() => setShowLogoutModal(true)}
          />
        </View>
      </ScrollView>
      <Modal
        transparent
        visible={showLogoutModal}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>로그아웃 확인</Text>
            <Text style={styles.modalText}>로그아웃 하시겠습니까?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => setShowLogoutModal(false)}
              >
               <ImageBackground
                  source={require('../../../assets/images/취소.png')}
                  style={styles.modalBtnImage}      // ← 수정된 스타일 이름
                  // imageStyle={styles.modalBtnRadius}  // ← 이 줄 삭제
                  resizeMode="contain"               // 이미지 비율 유지
                >
                  <Text style={styles.cancelText}>취소</Text>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => {
                  setShowLogoutModal(false);
                  router.push('signIn');
                }}
              >
                <ImageBackground
                  source={require('../../../assets/images/사각형 3-1.png')}
                  style={styles.modalBtnImage}      // ← 동일하게 사용
                  resizeMode="contain"
                >
                  <Text style={styles.modalBtnText}>확인</Text>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalBox: {
  width: '80%',
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 20,
  alignItems: 'center',
},
modalTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
  color: '#333',
},
modalText: {
  fontSize: 14,
  color: '#555',
  marginBottom: 20,
  textAlign: 'center',
},
modalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
},
modalBtn: {
  flex: 1,
  marginHorizontal: 5,
},
modalBtnBg: {
  width: '100%',
  height: 40,
  justifyContent: 'center',
  alignItems: 'center',
},
modalBtnRadius: {
  borderRadius: 8,
},

 // 버튼 배경 이미지 컨테이너: 크기 직접 조절 가능
  modalBtnImage: {
    width: 110,    // 원하는 너비(px)로 조정
    height: 44,    // 원하는 높이(px)로 조정
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  // 취소 버튼 전용 텍스트 스타일
  cancelText: {
    color: '#000', // 검정색
  },

});
