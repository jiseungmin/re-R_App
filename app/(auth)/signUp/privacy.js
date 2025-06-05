import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function PrivacyScreen() {
  const router = useRouter();
  const content = `
주식회사 헬타시스(이하 “회사”라 함)는 이용자의 개인 정보를 중요하게 생각하며, ‘정보통신망 이용 촉진 및 정보보호 등에 관한 법률’, ‘개인정보 보호법’을 준수하기 위하여 노력하고 있습니다.
회사는 개인정보 처리방침을 통하여 회사가 이용자로부터 제공받은 개인정보를 어떠한 용도와 방식으로 이용하고 있으며, 개인정보보호를 위해 어떠한 조처를 하고 있는지 알려드립니다.
본 방침은 2023년 08월 01일부터 시행되며, 이를 개정하는 경우 앱 공지(또는 이메일, SMS 등)를 통해 안내합니다.

1. 처리하는 개인정보의 항목 및 수집 방법
가. 수집하는 개인정보의 항목
회사는 최초 회원가입 및 서비스 이용을 위해 이용자로부터 아래와 같은 개인정보를 수집합니다.
  1) 굿턱 앱 회원가입 때 수집되는 정보:
     - 로그인 이메일, 비밀번호, 출생 연도, 성별, 전화번호
  2) 굿턱 서비스 이용 때 수집되는 정보:
     - 모바일 기기로부터 자동 생성 및 수집되는 정보
     - (문진을 통한 질병 관련 정보, 턱관절 동작 분석을 위한 영상 자료)

나. 개인정보 수집 방법
  - 이용자가 서비스 이용과정에서 직접 입력
  - 서비스 이용 시 기기로부터 측정되거나 자동 생성

2. 개인정보 처리 목적
회사는 아래 목적을 위해 최소한의 개인정보만 수집하며, 동의 없이 목적 외 사용 또는 제3자 제공을 하지 않습니다.
  가. 회원관리 및 서비스 제공
  나. 턱관절 분석·보고 서비스 제공
  다. 턱관절 운동 방법 서비스 제공
  라. 맞춤형 콘텐츠·이벤트 추천
  마. 신규 서비스 개발 및 통계·마케팅

3. 개인정보 보유·이용 기간
회사는 법령 또는 동의받은 기간 내에 개인정보를 보유·이용하며, 목적 달성 시 지체 없이 파기합니다.
  - 탈퇴 또는 조사 종료 시
  - 채권·채무 관계 잔존 시 관계 정산 후 파기

4. 이용자 및 법정대리인의 권리
이용자는 열람·정정·삭제·처리정지·동의철회 등을 요청할 수 있으며, 철회 시 일부 서비스 이용이 제한될 수 있습니다.
개인정보보호 책임자에게 서면·전화·이메일로 문의 시 지체 없이 조치합니다.

5. 쿠키의 운영 및 수집 거부 방법
회사는 맞춤형 서비스 제공을 위해 ‘쿠키’를 사용합니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부 또는 삭제할 수 있으며, 이 경우 일부 서비스 이용이 어려울 수 있습니다.

6. 개인정보 보호를 위한 조치
1) 기술적 조치: 개인정보 암호화, SSL 적용 등  
2) 해킹 대비: 침입 차단 시스템 운영, 백신 프로그램 설치, 정기 백업  
3) 관리적 조치: 내부관리계획 수립·시행, 최소 권한 부여·교육  
4) 물리적 조치: 전산실·문서 보관실 출입 통제, 잠금장치 사용

7. 개인정보보호 책임자
  개인정보 보호 책임자: 홍지헌 (CEO)  
  연락처: 041-530-3272 / hgh1020@gmail.com  
  기타 문의:  
    - 개인정보침해신고센터(118)  
    - 개인정보 분쟁조정위원회(1833-6972)  
    - 대검찰청 사이버범죄수사단(02-3480-3573)  
    - 경찰청 사이버안전국(182)

8. 링크 사이트에 대한 책임
회사는 외부 링크를 제공할 수 있으나, 해당 사이트의 개인정보처리방침은 회사의 방침과 다를 수 있으므로 직접 확인하시기 바랍니다.

9. 방침 변경 고지
개인정보 처리방침 변경 시 시행일 최소 7일 전 앱 공지 또는 이메일로 안내하며, 필요 시 재동의를 받을 수 있습니다.

부칙  
본 방침은 2023년 08월 01일부터 적용됩니다.
`;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>{'<'} 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>개인정보 처리방침</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.body}>
        <Text style={styles.paragraph}>{content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  back: { fontSize: 16, color: '#007AFF' },
  title: { fontSize: 18, fontWeight: '600' },
  body: { padding: 16 },
  paragraph: { fontSize: 14, color: '#505050', lineHeight: 22 },
});
