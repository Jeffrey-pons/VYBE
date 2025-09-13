/* eslint-disable react-native/no-inline-styles */
import 'react-native-reanimated';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useLoadFonts } from '@/hooks/useLoadFonts';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { LocationProvider } from '@/contexts/LocationContext';
import Loader from '@/components/Loader';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const appReady = useLoadFonts();

  if (!appReady) return null;

  return (
    <ThemeProvider value={DarkTheme}>
      <LocationProvider>
        <LoadingProvider>
          <AuthProvider>
            <View style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
                <Stack.Screen name="(tabs)" />
                  <Stack.Screen
                    name="event/[agendaId]/[id]"
                    options={{
                      presentation: 'modal',
                      gestureEnabled: true,
                      gestureDirection: 'vertical',
                      headerShown: false,
                    }}
                  />
                <Stack.Screen name="login" />
                <Stack.Screen name="register" />
                <Stack.Screen name="findlocation" />
                <Stack.Screen name="connectmusic" />
                <Stack.Screen name="activenotification" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <Loader />
            </View>
            <StatusBar style="auto" />
          </AuthProvider>
        </LoadingProvider>
      </LocationProvider>
    </ThemeProvider>
  );
}
