import { useRouter } from 'expo-router';
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
  View,
} from 'react-native';
import PureChart from 'react-native-pure-chart';
import Header from '../../components/ui/Header';

const screenWidth = Dimensions.get('window').width;

export default function ResultScreen() {
  const router = useRouter();
  const radarData = [20, 10, 7]; // Movement, Touch, Resting pain 순서

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        {/* 헤더 */}
      <Header title="평가검사 결과" />

      <ScrollView style={styles.container}>
        {/* 사용자 카드 */}
        <ImageBackground
          source={require('../../assets/images/evalresult/그룹 5431.png')}
          style={styles.profileCard}
          imageStyle={{ borderRadius: 16 }}
        >
          <Image source={require('../../assets/images/evalresult/그룹 5317.png')} style={styles.profileIcon} />
          <Text style={styles.profileName}>아버</Text>
          <Text style={styles.profileDate}>2025.04.04(금) [-10주차]</Text>
        </ImageBackground>

        {/* 병력결과 */}
        <Section title="병력결과">
          <View style={styles.boxRow}>
            <InfoBox label="수술 여부" value="완료" />
            <InfoBox label="수술 일자" value="--" />
            <InfoBox label="수술 계획" value="--" />
          </View>
        </Section>

        {/* 무릎각도 결과 */}
        <Section title="무릎각도 결과">
          <Image source={require('../../assets/images/evalresult/마스크 그룹 3.png')} style={styles.kneeImage} />
          <View style={styles.angleRow}>
            <AngleBox label="사용자 최대각도" value="155°" />
            <AngleBox label="주차별 목표 각도" value="-1°" />
          </View>
        </Section>

        {/* 통증점수 */}
        <Section title="통증점수">
          <PureChart
            data={[{ data: radarData, color: '#4F6EFF' }]}
            type="radar"
            width={screenWidth - 32}
            height={240}
            style={{ borderRadius: 12 }}
          />
          <Text style={styles.totalScore}>
            Total <Text style={styles.scoreValue}>37</Text>
          </Text>
        </Section>

        {/* 겁 결과 */}
        <Section title="겁 결과">
          <View style={styles.fearResultRow}>
            <Image
              source={require('../../assets/images/evalresult/겁이많은편남자.png')}
              style={styles.fearResultImage}
            />
            <View style={styles.fearTextContainer}>
              <Text style={styles.fearSmallTitle}>겁</Text>
              <View style={styles.fearResultBadge}>
                <Text style={styles.fearResultText}>겁이많은편</Text>
              </View>
            </View>
          </View>
        </Section>

        {/* 버튼 */}
        <TouchableOpacity style={styles.button} onPress={() => {router.push('/diagresult')}}>
          <Text style={styles.buttonText}>진단 결과 보기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const Section = ({ title, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Image source={require('../../assets/images/evalresult/그룹 5338.png')} style={styles.sectionIcon} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionCard}>{children}</View>
  </View>
);

const InfoBox = ({ label, value }) => (
  <View style={styles.infoCardWrapper}>
    <View style={styles.infoCard}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const AngleBox = ({ label, value }) => (
  <View style={styles.infoCardWrapper}>
    <View style={styles.infoCard}>
      <Text style={styles.angleLabel}>{label}</Text>
      <Text style={styles.angleValue}>{value}</Text>
    </View>
  </View>
);

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#EEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
  },
  profileCard: {
    backgroundColor: '#4F6EFF',
    margin: 16,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
    tintColor: '#fff',
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileDate: {
    color: '#fff',
    marginTop: 4,
  },
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    width: 24,
    height: 24,
    marginRight: 6,
    resizeMode: 'contain',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionCard: {
    backgroundColor: '#F2F2F2',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  angleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  infoCardWrapper: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  infoLabel: {
    color: '#4F6EFF',
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 14,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  angleLabel: {
    color: '#4F6EFF',
    fontSize: 14,
  },
  angleValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  kneeImage: {
    width: '100%',
    height: 160,
    resizeMode: 'contain',
  },
  totalScore: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 12,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  fearResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 20,
  },
  fearResultImage: {
    width: 120,
    height: 140,
    resizeMode: 'contain',
  },
  fearTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fearSmallTitle: {
    color: '#4F6EFF',
    fontSize: 14,
    marginBottom: 6,
  },
  fearResultBadge: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  fearResultText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    margin: 20,
    backgroundColor: '#4F6EFF',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
