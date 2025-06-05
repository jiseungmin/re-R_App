
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="signIn" />
      <Stack.Screen name="signUp/index" />
      <Stack.Screen name="signUp/form" />
      <Stack.Screen name="signUp/health" />
    </Stack>
  );
}
