
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/signIn" />
      <Stack.Screen name="(auth)/signUp/index" />
      <Stack.Screen name="(auth)/signUp/form" />
      <Stack.Screen name="(auth)/signUp/health" />
    </Stack>
  );
}
