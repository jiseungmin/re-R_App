import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function TermsAgreementScreen() {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const router = useRouter();
  const allAgreed = agreeTerms && agreePrivacy;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>약관 동의</Text>

      {/* 서비스 이용약관 */}
      <View style={styles.row}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={agreeTerms ? 'checked' : 'unchecked'}
            onPress={() => setAgreeTerms(!agreeTerms)}
          />
          <Text style={styles.label}>서비스 이용약관에 동의합니다.</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/signUp/terms')}>
          <Text style={styles.link}>보기</Text>
        </TouchableOpacity>
      </View>

      {/* 개인정보 처리방침 */}
      <View style={styles.row}>
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={agreePrivacy ? 'checked' : 'unchecked'}
            onPress={() => setAgreePrivacy(!agreePrivacy)}
          />
          <Text style={styles.label}>개인정보 처리방침에 동의합니다.</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/signUp/privacy')}>
          <Text style={styles.link}>보기</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: allAgreed ? '#4CAF50' : '#ccc' }]}
        disabled={!allAgreed}
        onPress={() => router.push('/signUp/form')}
      >
        <Text style={styles.buttonText}>동의하고 본인인증 하기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between'
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1
  },
  label: {
    fontSize: 16,
    flexShrink: 1
  },
  link: {
    fontSize: 14,
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginLeft: 8
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});
