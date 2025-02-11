import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            background: 'transparent',
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/icons/icon_home.png')}
              style={{ width: size, height: size, tintColor: color }}
              accessibilityLabel="Icône pour revenir au menu principal"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/icons/icon_loupe.png')}
              style={{ width: size, height: size, tintColor: color }}
              accessibilityLabel="Icône de recherche"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: 'tickets',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/icons/icon_ticket.png')}
              style={{ width: size, height: size, tintColor: color }}
              accessibilityLabel="Icône de la page de tickets"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/icons/icon_user.png')}
              style={{ width: size, height: size, tintColor: color }}
              accessibilityLabel="Icône de la page profil"
            />
          ),
        }}
      />
    </Tabs>
  );
}