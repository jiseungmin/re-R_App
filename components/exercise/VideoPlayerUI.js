import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExercisePauseOverlay from './ExercisePauseOverlay';
import ExerciseStopOverlay from './ExerciseStopOverlay';
import { VideoView } from 'expo-video';

const { width } = Dimensions.get('window');
const OVERLAY_HEIGHT = 80;

export default function VideoPlayerUI({
  player,
  currentRep,
  currentSet,
  repsPerSet,
  totalSets,
  paused,
  stopped,
  setPaused,
  setStopped,
  onSkip,
  insets,
  exercise,
  pauseOverlayData,
  handleResume,
  handleHome,
  handleCallClinic,
  handleCall119,
  closeStopOverlay,
  togglePlay,
  handleStop
}) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Video View */}
      <View style={StyleSheet.absoluteFill}>
        {player && (
          <VideoView
            player={player}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            nativeControls={false}
          />
        )}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => {}}
        />
      </View>
      {/* TOP OVERLAY */}
      <View
        style={[styles.topOverlay, { top: insets.top, height: OVERLAY_HEIGHT }]}
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
            <Text style={styles.counterText}>{`Set ${currentSet}/${totalSets}`}</Text>
            <Text style={styles.counterText}>{`${currentRep}/${repsPerSet}회`}</Text>
          </View>
        </View>
            <View>
      {/* 기존 영상, 컨트롤 버튼 등 */}
      <TouchableOpacity onPress={onSkip}>
        <Text style={{ color: '#e74c3c', fontWeight: 'bold', margin: 16 }}>건너뛰기</Text>
      </TouchableOpacity>
    </View>

        {!paused && !stopped && (
          <TouchableOpacity onPress={togglePlay} style={styles.iconButton}>
            <Image
              source={require('../../assets/images/stop_button.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
        {paused && !stopped && (
          <TouchableOpacity onPress={togglePlay} style={styles.iconButton}>
            <Image
              source={require('../../assets/images/play_button.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* 중단 버튼 */}
      {!paused && !stopped && (
        <TouchableOpacity
          style={[styles.stopWrap, { bottom: insets.bottom + 16 }]}
          onPress={handleStop}
        >
          <ImageBackground
            source={require('../../assets/images/사각형 2040@2x 1.png')}
            style={styles.stopBtn}
            imageStyle={styles.btnRadius}
            resizeMode="stretch"
          >
            <Text style={styles.stopText}>중단</Text>
          </ImageBackground>
        </TouchableOpacity>
      )}

      {/* 일시정지 오버레이 */}
      {paused && !stopped && (
        <ExercisePauseOverlay
          title={pauseOverlayData.title}
          subtitle={pauseOverlayData.subtitle}
          descriptionList={pauseOverlayData.descriptionList}
          onResume={handleResume}
        />
      )}

      {/* 중단 오버레이 */}
      {stopped && (
        <ExerciseStopOverlay
          onResume={() => {
            closeStopOverlay();
            setPaused(false);
          }}
          onHome={() => {
            closeStopOverlay();
            handleHome();
          }}
          onCallClinic={handleCallClinic}
          onCall119={handleCall119}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  topOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
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
