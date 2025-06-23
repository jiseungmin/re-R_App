import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  ImageBackground,
  Image,
} from 'react-native';
import Video from 'react-native-video'; // expo-video 절대 사용 안함
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EXERCISES } from '../../../../../../constants/Exercises_info';

const { width } = Dimensions.get('window');
const OVERLAY_HEIGHT = 80;

export default function VideoScreen() {
  const { ex } = useLocalSearchParams();
  const idx = Number(ex);
  const exercise = EXERCISES[idx];

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
      return () =>
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'flex' } });
    }, [])
  );

  useEffect(() => {
    setPaused(false);
  }, []);

  const togglePlay = () => setPaused(p => !p);

  return (
    <SafeAreaView style={styles.container}>
      {/* 풀스크린 비디오 */}
      <View style={StyleSheet.absoluteFill}>
        <Video
          source={exercise.video}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          paused={paused}
          controls={false} // 네이티브 컨트롤 OFF
          onProgress={({ currentTime }) => setCurrentTime(currentTime)}
          repeat={false}
          ignoreSilentSwitch="obey"
        />
        {/* 터치 완전 차단 */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => {}} // 터치 먹고 아무것도 안함
        />
      </View>

      {/* 🔳 TOP OVERLAY (프로그레스·카운터·일시정지) */}
      <View
        style={[
          styles.topOverlay,
          { top: insets.top, height: OVERLAY_HEIGHT },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.progressContainer}>
          <View style={styles.segmentRow}>
            <View style={[styles.segment, styles.segmentActive, styles.leftRadius]}>
              <Text style={styles.segmentText}>준비동작</Text>
            </View>
            <View style={[styles.segment, styles.segmentInactive]}>
              <Text style={styles.segmentText}>유지</Text>
            </View>
            <View style={[styles.segment, styles.segmentInactive, styles.rightRadius]}>
              <Text style={styles.segmentText}>마무리동작</Text>
            </View>
          </View>
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {`Set 1/${exercise.totalSets}`}
            </Text>
            <Text style={styles.counterText}>
              {`${Math.floor(currentTime)}/${exercise.repsPerSet}회`}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={togglePlay} style={styles.iconButton}>
          <Image
            source={require('../../../../../../assets/images/stop_button.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* 🔳 BOTTOM “중단” 버튼 */}
      <TouchableOpacity
        style={[styles.stopWrap, { bottom: insets.bottom + 16 }]}
        onPress={() => setPaused(true)}
      >
        <ImageBackground
          source={require('../../../../../../assets/images/사각형 2040@2x 1.png')}
          style={styles.stopBtn}
          imageStyle={styles.btnRadius}
          resizeMode="stretch"
        >
          <Text style={styles.stopText}>중단</Text>
        </ImageBackground>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// --- styles (절대 건드리지 않음) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topOverlay: {
    position: 'absolute',
    left: 0, right: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, justifyContent: 'space-between',
    zIndex: 2,
  },
  progressContainer: { flex: 1, alignItems: 'center' },
  segmentRow: { flexDirection: 'row', overflow: 'hidden' },
  segment: { paddingVertical: 4, paddingHorizontal: 12 },
  segmentActive: { backgroundColor: '#4CAF50' },
  segmentInactive: { backgroundColor: '#0057D9' },
  segmentText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  leftRadius: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 },
  rightRadius: { borderTopRightRadius: 20, borderBottomRightRadius: 20 },
  counterContainer: { marginTop: 4, alignItems: 'center' },
  counterText: { fontSize: 12, color: '#fff' },
  iconButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  icon: { width: 40, height: 40 },
  stopWrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  stopBtn: { width: width - 32, height: 48, justifyContent: 'center', alignItems: 'center' },
  btnRadius: { borderRadius: 24 },
  stopText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
