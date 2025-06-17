import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const ICON_PREVIOUS   = require('../../../assets/images/SignUp/previous_arrow.png');
const ICON_CHECKED   = require('../../../assets/images/SignUp/checked.png');
const ICON_UNCHECKED = require('../../../assets/images/SignUp/Unchecked.png');

export default function TermsAgreementScreen() {
  const router = useRouter();
  const [agreeAll,     setAgreeAll]     = useState(false);
  const [agreeTerms,   setAgreeTerms]   = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  const toggleAll = () => {
    const next = !agreeAll;
    setAgreeAll(next);
    setAgreeTerms(next);
    setAgreePrivacy(next);
  };

  const allAgreed = agreeTerms && agreePrivacy;

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>이용 약관 동의</Text>

        {/* 전체 동의: 이미지 토글 */}
        <TouchableOpacity style={styles.allBox} onPress={toggleAll}>
          <Image
            source={agreeAll ? ICON_CHECKED : ICON_UNCHECKED}
            style={styles.allToggleIcon}
          />
          <Text style={styles.allText}>전체 동의</Text>
        </TouchableOpacity>

        {/* 개별 약관 1 */}
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <TouchableOpacity onPress={() => setAgreeTerms(!agreeTerms)}>
              <Image
                source={agreeTerms ? ICON_CHECKED : ICON_UNCHECKED}
                style={styles.toggleIcon}
              />
            </TouchableOpacity>
            <Text style={styles.itemLabel}>
              서비스 이용약관 동의(필수)
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/signUp/terms')}>
            <Text style={styles.linkText}>약관보기</Text>
          </TouchableOpacity>
        </View>

        {/* 개별 약관 2 */}
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <TouchableOpacity onPress={() => setAgreePrivacy(!agreePrivacy)}>
              <Image
                source={agreePrivacy ? ICON_CHECKED : ICON_UNCHECKED}
                style={styles.toggleIcon}
              />
            </TouchableOpacity>
            <Text style={styles.itemLabel}>
              개인정보 처리방침 동의(필수)
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/signUp/privacy')}>
            <Text style={styles.linkText}>약관보기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer Button */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: allAgreed ? '#6573E3' : '#E0E0E0' },
          ]}
          disabled={!allAgreed}
          onPress={() => router.push('/signUp/form')}
        >
          <Text
            style={[
              styles.buttonText,
              { color: allAgreed ? '#FFFFFF' : '#888888' },
            ]}
          >
            동의하고 본인인증하기
          </Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
   backIcon: {
    width: 32,    // 아이콘 실제 크기에 맞춰 조절
    height: 32,
    resizeMode: 'contain',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 64
  },
  sectionTitle: {
    fontSize: 28, 
    fontWeight: '800',
    textDecorationLine: 'underline',
    marginBottom: 24,
    color: '#000000',
    lineHeight: 34,
  },
  toggleIcon: {
    width: 24,    // 체크박스 아이콘 크기
    height: 24,
  },
  allToggleIcon: {
    width: 32,    // 체크박스 아이콘 크기
    height: 32,
  },
  allBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  allText: {
    marginLeft: 8,
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  itemLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#444444',
    flexShrink: 1,
  },
  linkText: {
    fontSize: 14,
    color: '#999999',
    textDecorationLine: 'underline',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  button: {
    width: width - 40,
    alignSelf: 'center',
    paddingVertical: 16,
    borderRadius: 24,
    marginBottom:24
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
