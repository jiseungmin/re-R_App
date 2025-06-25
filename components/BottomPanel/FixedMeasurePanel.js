import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function FixedMeasurePanel({ onPress }) {
  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        측정이 필요합니다.{'\n'}측정을 먼저 진행해주세요.
      </Text>
      <TouchableOpacity style={styles.btnWrapper} onPress={onPress}>
        <Image
          source={require('../../assets/images/사각형 2450.png')}
          style={styles.fullBtnImg}
        />
        <Text style={styles.btnTextOnImage}>측정시작</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#E7F1FB', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    alignItems: 'center', paddingVertical: 40, paddingHorizontal: 18,
  },
  infoText: {
    color: '#222', fontSize: 18, fontWeight: '500', textAlign: 'center', marginBottom: 16,
  },
  btnWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullBtnImg: {
    width: 210,
    height: 44,
    resizeMode: 'contain',
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
  },
  btnTextOnImage: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 44,
    width: 210,
  },
});
