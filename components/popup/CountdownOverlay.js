import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function CountdownOverlay({ count }) {
  return (
    <View style={styles.overlay}>
      <Text style={styles.countText}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgb(0, 0, 0)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  countText: {
    fontSize: width * 0.35,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
