import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import globalStyles from "@/styles/globalStyles";
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    "Fugaz-One": require("../assets/fonts/FugazOne-Regular.ttf"),
    "FunnelSans-Bold": require("../assets/fonts/FunnelSans-Bold.ttf"),
    "FunnelSans-BoldItalic": require("../assets/fonts/FunnelSans-BoldItalic.ttf"),
    "FunnelSans-ExtraBold": require("../assets/fonts/FunnelSans-ExtraBold.ttf"),
    "FunnelSans-ExtraBoldItalic": require("../assets/fonts/FunnelSans-ExtraBoldItalic.ttf"),
    "FunnelSans-Light": require("../assets/fonts/FunnelSans-Light.ttf"),
    "FunnelSans-LightItalic": require("../assets/fonts/FunnelSans-LightItalic.ttf"),
    "FunnelSans-Medium": require("../assets/fonts/FunnelSans-Medium.ttf"),
    "FunnelSans-MediumItalic": require("../assets/fonts/FunnelSans-MediumItalic.ttf"),
    "FunnelSans-Regular": require("../assets/fonts/FunnelSans-Regular.ttf"),
    "FunnelSans-SemiBold": require("../assets/fonts/FunnelSans-SemiBold.ttf"),
    "FunnelSans-SemiBoldItalic": require("../assets/fonts/FunnelSans-SemiBoldItalic.ttf"),
    "FunnelSans-VariableFont": require("../assets/fonts/FunnelSans-VariableFont_wght.ttf"),
    "Montserrat-Black": require("../assets/fonts/Montserrat-Black.ttf"),
    "Montserrat-BlackItalic": require("../assets/fonts/Montserrat-BlackItalic.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-BoldItalic": require("../assets/fonts/Montserrat-BoldItalic.ttf"),
    "Montserrat-ExtraBold": require("../assets/fonts/Montserrat-ExtraBold.ttf"),
    "Montserrat-ExtraBoldItalic": require("../assets/fonts/Montserrat-ExtraBoldItalic.ttf"),
    "Montserrat-ExtraLight": require("../assets/fonts/Montserrat-ExtraLight.ttf"),
    "Montserrat-ExtraLightItalic": require("../assets/fonts/Montserrat-ExtraLightItalic.ttf"),
    "Montserrat-Italic": require("../assets/fonts/Montserrat-Italic.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-LightItalic": require("../assets/fonts/Montserrat-LightItalic.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-MediumItalic": require("../assets/fonts/Montserrat-MediumItalic.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-SemiBoldItalic": require("../assets/fonts/Montserrat-SemiBoldItalic.ttf"),
    "Montserrat-Thin": require("../assets/fonts/Montserrat-Thin.ttf"),
    "Montserrat-ThinItalic": require("../assets/fonts/Montserrat-ThinItalic.ttf"),
    "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); 
    }
  }, [fontsLoaded]);

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
