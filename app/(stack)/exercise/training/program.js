import {
  SafeAreaView, StyleSheet, ScrollView, ImageBackground, Text, TouchableOpacity, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Header from '../../../../components/ui/Header';
import { EXERCISES } from '../../../../constants/Exercises_info';

const { width } = Dimensions.get('window');
const BOX_W = width - 32;

export default function Program() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="운동 프로그램 안내" />
      <ScrollView contentContainerStyle={styles.content}>
        {EXERCISES.map((ex) => (
          <ImageBackground
            key={ex.id}
            source={require('../../../../assets/images/사각형 880.png')}
            style={styles.box}
            imageStyle={styles.boxRadius}
            resizeMode="stretch"
          >
            <Text style={styles.boxText}>{`${ex.id + 1}. ${ex.title}`}</Text>
          </ImageBackground>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.bottomFixedButton, { bottom: insets.bottom + 16 }]}
        // step, skipped(빈 배열) 전달
        onPress={() => router.push({
          pathname: `/exercise/training/detail/${EXERCISES[0].id}`,
          params: { step: 0, skipped: JSON.stringify([]) }
        })}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    paddingBottom: 100, // 버튼과 겹치지 않도록 여백 확보
    alignItems: 'center',
  },
  box: {
    width: BOX_W,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  boxRadius: {
    borderRadius: 8,
  },
  boxText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
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
  btnRadius: {
    borderRadius: 24,
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
