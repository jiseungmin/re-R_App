// app/(tabs)/exercise/training/index.js
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Header from '../../../../components/ui/Header';

const { width } = Dimensions.get('window');
const BOX_W = width - 32;

const ITEMS = [
  '1. 과도한 통증, 부기 또는 붉어짐과 같은 이상 반응이 나타나는 경우 곧바로 내원하세요.',
  '2. 날씨가 너무 더울 땐 이른 아침이나 늦은 오후에 운동하세요.',
  '3. 운동 중·후에 물을 충분히 섭취하세요.',
];

export default function PreWarn() {
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
        <TouchableOpacity
          style={styles.nextWrap}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#fff' },
  content:{ padding:16, alignItems:'center' },
  box:{ width:BOX_W, padding:12, marginBottom:12 },
  boxRadius:{ borderRadius:8 },
  boxText:{ fontSize:14, color:'#333', lineHeight:20 },
  nextWrap:{ marginTop:24 },
  nextBtn:{ width:BOX_W, height:48, justifyContent:'center', alignItems:'center' },
  btnRadius:{ borderRadius:24 },
  nextText:{ color:'#fff', fontSize:16, fontWeight:'600' },
});
