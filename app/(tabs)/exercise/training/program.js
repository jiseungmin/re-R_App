// app/(tabs)/exercise/training/program.js
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../../../components/ui/Header';
import { EXERCISES } from '../../../constants/Exercises_info';

const { width } = Dimensions.get('window');
const BOX_W = width - 32;

export default function Program() {
  const router = useRouter();
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
        <TouchableOpacity
          style={styles.nextWrap}
          onPress={() => router.push(`/exercise/training/detail/${EXERCISES[0].id}`)}
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
      </ScrollView>
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
  nextWrap: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
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
