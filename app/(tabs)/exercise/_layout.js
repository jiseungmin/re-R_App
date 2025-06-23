// app/(tabs)/exercise/_layout.js
import { Stack } from 'expo-router';

export default function ExerciseLayout() {
  return (
    // 이 한 줄만 남깁니다.
    <Stack 
      screenOptions={{
        headerShown: false, 
        // 필요하다면 공통 옵션들
      }} 
    />
  );
}
