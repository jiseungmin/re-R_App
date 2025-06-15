// app/(tabs)/_layout.js
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4f6dff',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: '#fff',
          height: 100,
        },
      }}
    >  

      <Tabs.Screen
        name="exercise/index"
        options={{
          tabBarLabel: '운동하기',
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={
                focused
                  ? require('../../assets/images/그룹 3877.png')
                  : require('../../assets/images/그룹 5319.png')
              }
              style={[
                styles.icon,
                {
                  width: focused ? size + 6 : size,
                  height: focused ? size + 6 : size,
                },
              ]}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="device/index"
        options={{
          tabBarLabel: '기기정보',
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={
                focused
                  ? require('../../assets/images/그룹 3875_icon.png')
                  : require('../../assets/images/그룹 3875.png')
              }
              style={[
                styles.icon,
                {
                  width: focused ? size + 6 : size,
                  height: focused ? size + 6 : size,
                },
              ]}
            />
          ),
          tabBarBadge: '!',
          tabBarBadgeStyle: { backgroundColor: 'red' },
        }}
      />

      <Tabs.Screen
        name="mypage/index"
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: ({ focused, size }) => (
            <Image
              source={
                focused
                  ? require('../../assets/images/그룹 5317.png')
                  : require('../../assets/images/그룹 3873.png')
              }
              style={[
                styles.icon,
                {
                  width: focused ? size + 6 : size,
                  height: focused ? size + 6 : size,
                },
              ]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
  },
});
