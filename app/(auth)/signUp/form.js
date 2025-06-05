import React, { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignUpFormScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const isValid = name && phone && gender && password.length >= 8 && password.length <= 15;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <TextInput style={styles.input} placeholder="이름" onChangeText={setName} />
      <TextInput style={styles.input} placeholder="휴대폰번호" keyboardType="phone-pad" onChangeText={setPhone} />
      <View style={styles.genderContainer}>
        <TouchableOpacity onPress={() => setGender('남자')} style={[styles.genderButton, gender==='남자'&&styles.genderSelected]}>
          <Text>남자</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setGender('여자')} style={[styles.genderButton, gender==='여자'&&styles.genderSelected]}>
          <Text>여자</Text>
        </TouchableOpacity>
      </View>
      <TextInput style={styles.input} placeholder="생년월일 (YYYYMMDD)" keyboardType="numeric" onChangeText={setBirthdate} />
      <TextInput style={styles.input} placeholder="비밀번호" secureTextEntry onChangeText={setPassword} />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isValid ? '#2196F3' : '#ccc' }]}
        disabled={!isValid}
        onPress={() => router.push('/signUp/health')}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow:1, justifyContent:'center', padding:20 },
  title: { fontSize:24, fontWeight:'bold', textAlign:'center', marginBottom:20 },
  input: { borderWidth:1,borderColor:'#ccc',borderRadius:5,padding:10,marginBottom:15 },
  genderContainer: { flexDirection:'row',justifyContent:'space-around',marginBottom:15 },
  genderButton: { borderWidth:1,borderColor:'#888',padding:10,borderRadius:5 },
  genderSelected: { backgroundColor:'#aaa' },
  button: { padding:15,borderRadius:5,alignItems:'center' },
  buttonText: { color:'#fff',fontWeight:'bold' },
});
