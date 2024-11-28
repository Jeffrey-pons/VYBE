import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/AuthContext';
import { loadFonts } from '@/utils/font.utils';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Chargement des polices
  useEffect(() => {
    const loadAppFonts = async () => {
      try {
        await loadFonts(); 
        setFontsLoaded(true);
        SplashScreen.hideAsync(); 
      } catch (e) {
        console.error('Erreur lors du chargement des polices', e);
      }
    };

    loadAppFonts();
  }, []);

  if (!fontsLoaded) {
    return null; 
  }
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login"/>
          <Stack.Screen name="register"/>
          <Stack.Screen name="location"/>
          <Stack.Screen name="connectmusic"/>
          <Stack.Screen name="notification"/>
          <Stack.Screen name="+not-found" />
        </Stack>
      </AuthProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
