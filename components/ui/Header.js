// components/ui/Header.js
import React from 'react';
import {
  ImageBackground,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Header({ title }) {
  const router = useRouter();
  return (
    <>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Image source={require('../../assets/images/mypage/previous_arrow.png')} style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.spacer} />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: SCREEN_WIDTH,
    aspectRatio: 375 / 180,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  bg: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: { width: 32, height: 32, justifyContent: 'center' },
  backIcon: { width: 24, height: 24, resizeMode: 'contain' },
  title: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 18, fontWeight: '600' },
  spacer: { width: 32, height: 32 },
});
