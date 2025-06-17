import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function EvaluationCompletePopup({ onViewResult, onLater }) {
  return (
    <View style={styles.overlay}>
      <View style={styles.popup}>
        <Image
          source={require('../../assets/images/그룹 4330.png')} // 이미지 경로 수정 필요
          style={styles.image}
        />
        <Text style={styles.title}>수고하셨습니다.</Text>
        <Text style={styles.desc}>
          3가지 평가가 모두 끝났습니다.{"\n"}
          평가 결과를 확인하시겠습니까?
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.laterButton} onPress={onLater}>
            <Text style={styles.laterButtonText}>나중에 보기</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resultButton} onPress={onViewResult}>
            <Text style={styles.resultButtonText}>결과보기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: width * 0.85,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 420,
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#222',
    marginBottom: 16,
    textAlign: 'center',
  },
  desc: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  laterButton: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 10,
  },
  resultButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  laterButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  resultButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
