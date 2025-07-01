import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Header from '../../components/ui/Header';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DiagnosisScreen() {
  const router = useRouter();
  const [fontSize, setFontSize] = useState('default');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
       {/* 헤더 */}
      <Header title="진단 결과" />
      <ScrollView style={styles.container}>
       
        {/* 노란 프로필 카드 */}
        <ImageBackground
          source={require('../../assets/images/diagresult/그룹 5430.png')}
          style={styles.profileCard}
          imageStyle={{ borderRadius: 12 }}
        >
          <Image
            source={require('../../assets/images/diagresult/그룹 5322.png')}
            style={styles.profileIcon}
          />
          <Text style={styles.profileDate}>2025.04.04(금) [-10주차]</Text>
          <Text style={styles.profileText}>아버 님의 진단결과</Text>
        </ImageBackground>

        {/* 관절각도 카드 */}
        <View style={styles.sectionCard}>
          <Text style={styles.kneeTitle}>아버님 관절각도</Text>
          <Image
            source={require('../../assets/images/diagresult/마스크 그룹 3.png')}
            style={styles.kneeImage}
          />
          <View style={styles.kneeValues}>
            <View style={styles.kneeValueBox}>
              <Text style={styles.kneeLabel}>사용자 최대각도</Text>
              <View style={styles.kneeValueWrapper}>
                <Text style={styles.kneeValue}>155°</Text>
              </View>
            </View>
            <View style={styles.kneeValueBox}>
              <Text style={styles.kneeLabel}>주차 별 목표 각도</Text>
              <View style={styles.kneeValueWrapper}>
                <Text style={styles.kneeValue}>-1°</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 결과 읽어주기 Section */}
        <View style={styles.sectionCard}>
          <View style={styles.audioSection}>
            <View style={styles.audioIconCircle}>
              <Ionicons name="volume-high" size={20} color="#fff" />
            </View>
            <Text style={styles.audioLabel}>결과 읽어주기</Text>
          </View>
        </View>

        {/* 결과 텍스트 크기 Section */}
        <View style={styles.sectionCard}>
          <View style={styles.textSizeBox}>
            <Text style={styles.textSizeLabel}>결과 텍스트 크기</Text>
            <View style={styles.sizeOptions}>
              <TouchableOpacity
                style={[styles.sizeButton, fontSize === 'default' && styles.sizeButtonSelected]}
                onPress={() => setFontSize('default')}
              >
                <Text style={fontSize === 'default' ? styles.sizeTextSelected : styles.sizeText}>기본</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sizeButton, fontSize === 'large' && styles.sizeButtonSelected]}
                onPress={() => setFontSize('large')}
              >
                <Text style={fontSize === 'large' ? styles.sizeTextSelected : styles.sizeText}>크게</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 결과 텍스트 */}
        <View style={styles.resultBox}>
          <Text style={[styles.resultText, fontSize === 'large' && styles.resultTextLarge]}>
            이번주 목표각도 -1도를 이미 달성하셨네요!{"\n"}잘하고 계십니다.{"\n\n"}
            저희 리런에서는 아버님에게 맞춤 처방을 제공하기 위하여 수술일, 관절각도, 통증수준 등 다양한 정보를 분석하였습니다.{"\n\n"}
            <Text style={{ fontWeight: 'bold' }}>안전! 또 안전!</Text>을 중시하는 아버님의 성향을 확인하여,{"\n"}
            안전하고 효율적인 운동계획을 세웠습니다.{"\n"}
            어플 시작화면에서 맞춤 처방을 확인해보세요!{"\n"}
            차근차근 열심히 해봅시다!{"\n"}응원할게요!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileCard: {
    padding: 20,
    borderRadius: 12,
    margin: 16,
    alignItems: 'center',
  },
  profileIcon: {
    width: 64,
    height: 64,
    resizeMode: 'contain',
  },
  profileDate: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: '#F7F7F7',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  kneeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  kneeImage: {
    width: SCREEN_WIDTH * 0.7,
    height: 140,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  kneeValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    width: '100%',
  },
  kneeValueBox: {
    flex: 1,
    alignItems: 'center',
  },
  kneeLabel: {
    fontSize: 13,
    color: '#4F6EFF',
    marginBottom: 4,
  },
  kneeValueWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 4,
    minWidth: 140,          
    alignItems: 'center',   
    justifyContent: 'center',
  },
  kneeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  audioSection: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
  },
  audioIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4F6EFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  textSizeBox: {
    alignItems: 'center',
  },
  textSizeLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
  sizeOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  sizeButton: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderColor: '#ccc',
    borderRadius: 8,
  },
  sizeButtonSelected: {
    borderColor: '#4F6EFF',
  },
  sizeText: {
    fontSize: 14,
    color: '#000',
  },
  sizeTextSelected: {
    fontSize: 14,
    color: '#4F6EFF',
    fontWeight: 'bold',
  },
  resultBox: {
    backgroundColor: '#F8F8F8',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  resultText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 22,
    fontWeight: '500',
  },
  resultTextLarge: {
    fontSize: 17,
    lineHeight: 26,
  },
});
