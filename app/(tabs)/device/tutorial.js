import { useEvent } from 'expo';
import { useRouter } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../../components/ui/Header';
const steps = [
  {
    guide: '· 보조기의 구멍을 무릎에 둡니다.\n· 넓은 쪽으로 허벅지에 착용합니다.',
    video: require('../../../assets/video/Equipment Tutorial/튜토리얼1.mp4'),
  },
  {
    guide: '· 보조기가 움직이지 않도록 감싸서 고정합니다.',
    video: require('../../../assets/video/Equipment Tutorial/튜토리얼2.mp4'),
  },
  {
    guide: '· 각도계의 중심을 무릎 중앙에 둡니다.\n· 각도계가 일직선이 되도록 붙입니다.\n· 두 개의 끈으로 단단히 고정합니다.',
    video: require('../../../assets/video/Equipment Tutorial/튜토리얼3.mp4'),
  },
];

export default function Tutorial() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const isLast = step === steps.length - 1;
  const isFirst = step === 0;

  // 비디오 플레이어 생성
  const player = useVideoPlayer(steps[step].video, p => {
    p.loop = true;
    p.play();
  });

  // 재생 상태 구독 (일시정지/재생 토글용)
  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return ( 
    <>
  <Header title="관절각도 증진 각도" />
    <View style={styles.container}>
   

      {/* 안내 박스 */}
      <View style={styles.guideBox}>
        {/* 타이틀 */}
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>장비 착용방법</Text>
        </View>

        {/* 실제 안내 텍스트 */}
        {steps[step].guide.split('\n').map((line, idx) => (
          <Text style={styles.guideText} key={idx}>{line}</Text>
        ))}
      </View>

      {/* 비디오 뷰 */}
      <View style={styles.videoContainer}>
        <VideoView
          player={player}
          style={styles.video}
          allowsFullscreen
          allowsPictureInPicture
          nativeControls={false}
        />
      </View>

      {/* 인디케이터 */}
      <View style={styles.indicatorRow}>
        {steps.map((_, idx) => (
          <View
            key={idx}
            style={[styles.indicator, step === idx && styles.indicatorActive]}
          />
        ))}
      </View>

      {/* 버튼 */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.prevBtn}
          disabled={isFirst}
          onPress={() => setStep(s => Math.max(0, s - 1))}
        >
          <Text style={[styles.prevText, isFirst && { color: '#aaa' }]}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => {
            if (isLast) router.back();
            else setStep(s => Math.min(steps.length - 1, s + 1));
          }}
        >
          <Text style={styles.nextText}>{isLast ? '시작' : '다음'}</Text>
        </TouchableOpacity>
      </View>
    </View></>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  backArrow: { fontSize: 28, color: '#222', padding: 4 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#222' },

  guideBox: {
    position: 'relative',
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    paddingTop: 32,      // titleWrapper가 겹치더라도 텍스트가 가려지지 않도록
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  titleWrapper: {
    position: 'absolute',
    top: -12,            // 바깥 박스 테두리 위로 띄우기
    alignSelf: 'center', // 가로 중앙 정렬
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 12,
    zIndex: 10,
  },
  titleText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
  },
  guideText: {
    color: '#222',
    fontSize: 15,
    marginBottom: 4,
  },

  videoContainer: { position: 'relative', alignItems: 'center', marginBottom: 24 },
  video: { width: '100%', height: 350, borderRadius: 8, overflow: 'hidden' },
  playPauseBtn: {
    position: 'absolute', bottom: 10, right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20
  },
  playPauseText: { color: '#fff', fontSize: 14 },

  indicatorRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  indicator: { width: 32, height: 4, borderRadius: 2, backgroundColor: '#eee', marginHorizontal: 2 },
  indicatorActive: { backgroundColor: '#2196F3' },

  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' },
  prevBtn: { flex: 1, marginRight: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#2196F3', borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  nextBtn: { flex: 1, marginLeft: 8, backgroundColor: '#2196F3', borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  prevText: { color: '#222', fontSize: 17, fontWeight: 'bold' },
  nextText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});
