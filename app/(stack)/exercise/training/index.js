import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../../components/ui/Header';

const { width } = Dimensions.get('window');
const BOX_W = width - 32;

const ITEMS = [
  '1. 과도한 통증, 부기 또는 붉어짐과 같은\n    이상 반응이 나타나는 경우 곧바로 내원\n    하시어 진단 받으세요.',
  '2. 날씨가 너무 더울 때에는 운동을 피해주세요,\n    이른 아침이나 늦은 오후에 허는 것이 좋습니다.',
  '3. 운동 중과 운동 후에 물을 많이 마셔주세요.',
];

export default function PreWarn() {
  const insets = useSafeAreaInsets();
  const router = useRouter();


  return (
    <SafeAreaView style={styles.container}>
      <Header title="운동 전 주의사항" />

      <ScrollView contentContainerStyle={styles.content}>
        {ITEMS.map((t, i) => (
          <ImageBackground
            key={i}
            source={require('../../../../assets/images/사각형 880.png')}
            style={styles.box}
            imageStyle={styles.boxRadius}
            resizeMode="stretch"
          >
            <Text style={styles.boxText}>{t}</Text>
          </ImageBackground>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.bottomFixedButton, { bottom: insets.bottom + 16 }]}
        onPress={() => router.push('exercise/training/program')}
      >
        <ImageBackground
          source={require('../../../../assets/images/사각형 4.png')}
          style={styles.nextBtn}
          imageStyle={styles.btnRadius}
          resizeMode="stretch"
        >
          <Text style={styles.nextText}>다음</Text>
        </ImageBackground>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: {
    padding: 16,
    paddingBottom: 100, // 버튼 공간 확보
    alignItems: 'center',
  },
  box: { width: BOX_W, padding: 12, marginBottom: 12 },
  boxRadius: { borderRadius: 8 },
  boxText: { fontSize: 14, color: '#333', lineHeight: 20 },

  bottomFixedButton: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  nextBtn: {
    width: BOX_W,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnRadius: { borderRadius: 24 },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
