import { VideoView } from 'expo-video';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ExercisePauseOverlay from './ExercisePauseOverlay';
import ExerciseStopOverlay from './ExerciseStopOverlay';
import StepProgressBar from './StepProgressBar';

const { width: screenWidth } = Dimensions.get('window');
const OVERLAY_HEIGHT = 100;
const BAR_MARGIN = 8;
const barWidth = screenWidth - BAR_MARGIN * 2;

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
  pauseOverlayData,
  handleResume,
  handleHome,
  handleCallClinic,
  handleCall119,
  closeStopOverlay,
  togglePlay,
  handleStop,
  currentPhase,
  phaseElapsed,
  phaseDuration,
  phases, // 동적으로 내려줌
  children, // 추가
  skipDisabled, // 추가
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
        {children}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={() => {}}
        />
      </View>

      {/* --- TOP OVERLAY --- */}
      <View
        style={[
          styles.topOverlay,
          { top: insets.top, height: OVERLAY_HEIGHT },
        ]}
        pointerEvents="box-none"
      >
        {/* 좌측: Skip */}
        {!skipDisabled && (
          <TouchableOpacity onPress={onSkip} style={styles.skipBtnWrap}>
            <View style={styles.skipBtn}>
              <Text style={styles.skipBtnText}>Skip</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* 중앙: 단계 게이지 + set/rep */}
        <View style={[styles.centerOverlay]}>
          <StepProgressBar
            phases={phases}
            currentPhase={currentPhase}
            phaseElapsed={phaseElapsed}
            barWidth={barWidth}
          />
          <Text style={styles.setInfoText}>{`Set ${currentSet}/${totalSets}`}</Text>
          <Text style={styles.repInfoText}>{`${currentRep}/${repsPerSet}회`}</Text>
        </View>

        {/* 우측: 일시정지/재생 */}
        <View style={styles.pausePlayBtnWrap}>
          {!stopped && (
            <TouchableOpacity onPress={togglePlay} style={styles.iconButton}>
              <Image
                source={
                  paused
                    ? require('../../assets/images/play_button.png')
                    : require('../../assets/images/stop_button.png')
                }
                style={styles.pauseIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 중단 버튼 (하단) */}
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
    height: OVERLAY_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
    paddingHorizontal: 8,
  },
  skipBtnWrap: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 8,
  },
  skipBtn: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 3,
    paddingHorizontal: 12,
    marginTop:45,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  skipBtnText: {
    color: '#0057D9',
    fontWeight: '600',
    fontSize: 14,
  },
  centerOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  setInfoText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 2,
    textAlign: 'center',
  },
  repInfoText: {
    color: '#222',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  pausePlayBtnWrap: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginTop:45,
    marginRight: 8,
  },
  iconButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  pauseIcon: { width: 40, height: 40 },
  stopWrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  stopBtn: { width: screenWidth - 32, height: 48, justifyContent: 'center', alignItems: 'center' },
  btnRadius: { borderRadius: 24 },
  stopText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});