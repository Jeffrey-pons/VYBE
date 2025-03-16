import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Image } from 'react-native';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Theme } from '@/constants/Theme';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme.colors.text, 
        headerShown: false,
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
          title: '',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/icons/icon_home.png')}
              style={{ width: size, height: size, tintColor: color }}
              alt="Icône pour revenir au menu principal"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/icons/icon_loupe.png')}
              style={{ width: size, height: size, tintColor: color }}
              alt="Icône de recherche"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tickets"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/icons/icon_ticket.png')}
              style={{ width: size, height: size, tintColor: color }}
              alt="Icône de la page de tickets"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../assets/images/icons/icon_user.png')}
              style={{ width: size, height: size, tintColor: color }}
              alt="Icône de la page profil"
            />
          ),
        }}
      />
    </Tabs>
  );
}