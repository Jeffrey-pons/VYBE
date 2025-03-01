import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { View } from 'react-native';
import { useLoadFonts } from '@/hooks/useLoadFonts';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const appReady = useLoadFonts();

  if (!appReady) return null;

  return (
    <ThemeProvider value={DarkTheme}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)"/>
          <Stack.Screen name="login"/>
          <Stack.Screen name="register"/>
          <Stack.Screen name="findlocation"/>
          <Stack.Screen name="connectmusic"/>
          <Stack.Screen name="activenotification"/>
          <Stack.Screen name="+not-found" />
        </Stack>
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
