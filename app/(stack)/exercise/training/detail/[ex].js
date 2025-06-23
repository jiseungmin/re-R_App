import React, { useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams} from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BlackHeader from '../../../../../components/ui/BlackHeader'; 
import { EXERCISES } from '../../../../../constants/Exercises_info';

const { width } = Dimensions.get('window');

export default function Detail() {
  const { ex } = useLocalSearchParams();
  const idx = Number(ex);
  const exercise = EXERCISES[idx];
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <BlackHeader />
      <View style={styles.body}>
        <Text style={styles.title}>{`${idx + 1}. ${exercise.title}`}</Text>
        <View style={styles.descBox}>
          <Text style={styles.descHeader}>[운동 설명]</Text>
          {exercise.description.map((t, i) => (
            <Text key={i} style={styles.descText}>{`${i + 1}. ${t}`}</Text>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.startWrap, { bottom: insets.bottom + 16 }]}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  body: { flex: 1, padding: 16, justifyContent: 'center' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // ✅ 글씨 색상 복원
    marginBottom: 16,
    textAlign: 'center',
  },
  descHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  descText: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  startWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  startBtn: {
    width: width - 32,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnRadius: { borderRadius: 25 },
  startText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
