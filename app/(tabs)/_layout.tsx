import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';

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
            // Use a transparent background on iOS to show the blur effect
            background: 'transparent',
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <AntDesign name="search1" size={24} color={color} />,
        }}
      />
        <Tabs.Screen
        name="ticket"
        options={{
          title: '',
          tabBarIcon:({ color }) => <Ionicons name="ticket-outline" size={24} color={color} />,
        }}
        />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon:({ color }) => <AntDesign name="user" size={24} color={color} />,
        }}
        />
       <Tabs.Screen
        name="settings"
        options={{
          title: '',
          tabBarIcon:({ color }) => <Ionicons name="settings-outline" size={24} color={color}/>,
        }}
        />
    </Tabs>
  );
}
