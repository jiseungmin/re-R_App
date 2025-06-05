
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignInScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
      {/* ID/비밀번호 입력 필드 추가 */}
      <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.button}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/signUp')}>
        <Text style={styles.link}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  title: { fontSize:24, marginBottom:20 },
  button: { color:'#2196F3', marginVertical:10 },
  link: { color:'#888' },
});
