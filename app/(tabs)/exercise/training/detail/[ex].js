// app/(tabs)/exercise/training/detail/[ex].js
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Header from '../../../../../components/ui/Header';
import { EXERCISES } from '../../../../constants/Exercises_info';

const { width } = Dimensions.get('window');

export default function Detail() {
  const { ex } = useLocalSearchParams();
  const idx = Number(ex);
  const exercise = EXERCISES[idx];
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="운동 설명" />
      <View style={styles.body}>
        <Text style={[styles.title, { color: '#0f0' }]}>
          {`${idx + 1}. ${exercise.title}`}
        </Text>
        <View style={styles.descBox}>
          <Text style={styles.descHeader}>[운동 설명]</Text>
          {exercise.description.map((t, i) => (
            <Text key={i} style={styles.descText}>{`${i + 1}. ${t}`}</Text>
          ))}
        </View>
        <TouchableOpacity
          style={styles.startWrap}
          onPress={() => router.push(`/exercise/training/detail/${idx}/video`)}
        >
          <ImageBackground
            source={require('../../../../../assets/images/사각형 2.png')}
            style={styles.startBtn}
            imageStyle={styles.btnRadius}
            resizeMode="stretch"
          >
            <Text style={styles.startText}>시작하기</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* styles: PreWarn 와 유사, 검은 배경+설명 텍스트 스타일 */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  body: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  descBox: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
  },
  descHeader: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  descText: { color: '#ccc', fontSize: 16, marginBottom: 4 },
  startWrap: { alignItems: 'center' },
  startBtn: {
    width: width - 32,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnRadius: { borderRadius: 25 },
  startText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});