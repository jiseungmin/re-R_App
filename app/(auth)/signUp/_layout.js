// app/signUp/_layout.js
import { Slot, useRouter, useSegments } from 'expo-router';
import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 뒤로가기 아이콘
const ICON_PREVIOUS = require('../../../assets/images/SignUp/previous_arrow.png');

export default function SignUpLayout() {
  const router = useRouter();
  const segments = useSegments();
  // 최종 세그먼트가 'complete'인 경우 레이아웃 스킵
  const isComplete = segments[segments.length - 1] === 'complete';

  if (isComplete) {
    return <Slot />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 공통 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={ICON_PREVIOUS} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>회원가입</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* 회원가입 단계 하위 페이지 렌더링 */}
      <Slot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
});
