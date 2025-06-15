
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 인증 흐름 */}
        <Stack.Screen name="signIn" />
        <Stack.Screen name="signUp/index" />
        <Stack.Screen name="signUp/form" />
        <Stack.Screen name="signUp/health" />
        <Stack.Screen name="signUp/privacy" />
        <Stack.Screen name="signUp/terms" />
        {/* 메인 탭 */}
        <Stack.Screen name="(tabs)" />
        {/* 404 */}
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
