// app/(tabs)/exercise/training/detail/[ex]/video.js
import React, { useRef, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
  Text,
  Dimensions,
} from 'react-native';
import { Video } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import Header from '../../../../../../components/ui/Header';
import { EXERCISES } from '../../../../../constants/Exercises_info';

const { width } = Dimensions.get('window');

export default function VideoScreen() {
  const { ex } = useLocalSearchParams();
  const idx = Number(ex);
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const exercise = EXERCISES[idx];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="운동 영상" />
      <View style={styles.videoWrap}>
        <Video
          ref={videoRef}
          source={exercise.video}
          style={styles.video}
          useNativeControls
          resizeMode="cover"
          onPlaybackStatusUpdate={setStatus}
        />
      </View>
      <TouchableOpacity
        style={styles.stopWrap}
        onPress={() => videoRef.current.pauseAsync()}
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

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#000' },
  videoWrap:{ flex:1, justifyContent:'center', alignItems:'center' },
  video:{ width, height: (width * 9) / 16 },
  stopWrap:{ alignItems:'center', marginVertical:24 },
  stopBtn:{ width:width - 40, height:48, justifyContent:'center', alignItems:'center' },
  btnRadius:{ borderRadius:24 },
  stopText:{ color:'#fff', fontSize:16, fontWeight:'600' },
});
