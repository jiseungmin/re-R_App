// app/(tabs)/exercise/index.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ExerciseScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <ImageBackground
        source={require('../../../assets/images/group5805.png')}
        style={styles.header}
        imageStyle={styles.headerBgImage}
      >
        <TouchableOpacity>
          <MaterialIcons name="menu" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>
          아버님의,{'\n'}건강한 하루를 응원해요!
        </Text>

        {/* 사람 일러스트 (헤더 뒤 배경 위에 겹침) */}
        <Image
          source={require('../../../assets/images/group3945.png')}
          style={styles.headerIllustration}
          resizeMode="contain"
        />
      </ImageBackground>

      {/* Illustration */}
      <Image
        source={require('../../../assets/images/group4800.png')}
        style={styles.mainImg}
        resizeMode="contain"
      />

      {/* Bottom Card */}
      <View style={styles.card}>
        <Text style={styles.cardText}>배정받은 운동플랜이 없습니다.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: 140,              // 배경 이미지 높이
    paddingHorizontal: 20,    // 좌우 여백
    paddingTop: 16,           // SafeAreaView 상단 높이 고려
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBgImage: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    lineHeight: 24,
    marginLeft: 12,
    fontWeight: '600',
  },
  headerIllustration: {
    width: 60,
    height: 60,
    // 필요하다면 위치 미세 조정
    marginTop: 10,
  },
  mainImg: {
    width: '100%',
    height: 240,
    marginTop: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#E5F2FF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cardText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});
