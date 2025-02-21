import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { loadFonts } from '@/utils/fonts.utils';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  //Chargement des polices
  useEffect(() => {
    const loadAppFonts = async () => {
      try {
        await loadFonts();
        setFontsLoaded(true);
        SplashScreen.hideAsync();
        } catch (error) {
          console.error('Erreur lors du chargement des polices', error);
      }
    };
    loadAppFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login"/>
        <Stack.Screen name="register"/>
        <Stack.Screen name="findlocation"/>
        <Stack.Screen name="connectmusic"/>
        <Stack.Screen name="activenotification"/>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
