import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import PerformanceScreen from './src/screens/PerformanceScreen';
import AppsScreen        from './src/screens/AppsScreen';
import CacheScreen       from './src/screens/CacheScreen';
import AboutScreen       from './src/screens/AboutScreen';
import { colors, font }  from './src/theme';

const Tab = createBottomTabNavigator();

const TAB_ICON = {
  Performance: '⚡',
  Apps:        '📦',
  Cache:       '🧹',
  About:       'ℹ️',
};

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#0a0a0a" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle:      { backgroundColor: '#0a0a0a', borderBottomWidth: 1, borderBottomColor: '#181818' },
            headerTintColor:  colors.accent,
            headerTitleStyle: { fontWeight: 'bold', letterSpacing: 1, fontSize: font.lg },
            headerTitle:      `⚡ TaskManager+`,
            tabBarStyle: {
              backgroundColor: '#0a0a0a',
              borderTopColor:  '#181818',
              borderTopWidth:  1,
              height: 58,
              paddingBottom: 6,
            },
            tabBarActiveTintColor:   colors.accent,
            tabBarInactiveTintColor: '#444',
            tabBarLabelStyle: { fontSize: 10, letterSpacing: 0.5 },
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.4 }}>
                {TAB_ICON[route.name]}
              </Text>
            ),
          })}
        >
          <Tab.Screen name="Performance" component={PerformanceScreen} />
          <Tab.Screen name="Apps"        component={AppsScreen} />
          <Tab.Screen name="Cache"       component={CacheScreen} />
          <Tab.Screen name="About"       component={AboutScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
