import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function FixedConsultPanel({ onConsult, onCall }) {
  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        진료가 필요합니다.{'\n'}진료이후에 운동이 가능합니다.
      </Text>
      <View style={styles.btnRow}>
        {/* 진료 완료(운동 재개) 전체가 파란 이미지 버튼 */}
        <TouchableOpacity style={styles.btnWrapper} onPress={onConsult}>
          <Image
            source={require('../../assets/images/사각형 2450.png')}
            style={styles.fullBtnImg}
          />
          <Text style={styles.btnTextOnImage}>진료 완료(운동 재개)</Text>
        </TouchableOpacity>
        {/* 전화 전체가 흰 원형+전화 아이콘 버튼 */}
        <TouchableOpacity style={styles.btnWrapper} onPress={onCall}>
          <View style={styles.circleBtn}>
            <Image
              source={require('../../assets/images/call_icon.png')}
              style={styles.callIcon}
            />
          </View>
        </TouchableOpacity>
      </View>
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
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
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
  circleBtn: {
    width: 48, height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    borderColor: '#E7E7E7', borderWidth: 1,
    elevation: 2,
    marginLeft: 14,
  },
  callIcon: {
    width: 32, height: 32,
    resizeMode: 'contain',
  },
});
