// app/(auth)/signUp/health.tsx
import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HealthCheckScreen() {
  const [hasCondition, setHasCondition] = useState(null);
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>기저질환이 있으신가요?</Text>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={() => setHasCondition(true)}><Text>예</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setHasCondition(false)} style={{ marginLeft:20 }}><Text>아니오</Text></TouchableOpacity>
      </View>
      {hasCondition && <Text>상세 팝업 표시</Text>}
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.buttonText}>완료</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow:1, justifyContent:'center', padding:20 },
  title: { fontSize:24, fontWeight:'bold', textAlign:'center', marginBottom:20 },
  checkboxContainer: { flexDirection:'row', alignItems:'center', marginBottom:20 },
  button: { padding:15, borderRadius:5, backgroundColor:'#4CAF50', alignItems:'center' },
  buttonText: { color:'#fff', fontWeight:'bold' },
});
