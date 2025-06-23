// app/(tabs)/exercise/_layout.js
import React from 'react';
import { Stack } from 'expo-router';

export default function ExerciseLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />                    {/* 홈 */}
      <Stack.Screen name="training/index" />           {/* 1) 주의사항 */}
      <Stack.Screen name="training/program" />         {/* 2) 프로그램 안내 */}
      <Stack.Screen name="training/detail/[ex]" />     {/* 3) 운동 설명 */}
      <Stack.Screen name="training/detail/[ex]/video" />{/* 4) 운동 영상 */}
    </Stack>
  );
}
