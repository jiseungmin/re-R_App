// app/(tabs)/_layout.js
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      // initialRouteName 없이 두면 선언 순서대로 첫 탭이 기본으로 선택됩니다
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4f6dff',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: {
          backgroundColor: '#fff',  // 탭바 배경 흰색
          height: 100,
        },
      }}
    >
      {/* 1) 운동하기 (맨 왼쪽) */}
      <Tabs.Screen
        name="exercise"
        options={{
          tabBarLabel: '운동하기',
          tabBarIcon: ({ size }) => (
            <Image
              source={require('../../assets/images/그룹 3878.png')}
              style={[styles.icon, { width: size, height: size }]}
            />
          ),
        }}
      />

      {/* 2) 기기정보 (가운데) */}
      <Tabs.Screen
        name="/(tabs)/device"
        options={{
          tabBarLabel: '기기정보',
          tabBarIcon: ({ size }) => (
            <Image
              source={require('../../assets/images/그룹 3875_icon.png')}
              style={[styles.icon, { width: size, height: size }]}
            />
          ),
          tabBarBadge: '!',  // 배지
          tabBarBadgeStyle: { backgroundColor: 'red' },
        }}
      />

      {/* 3) 마이페이지 (맨 오른쪽) */}
      <Tabs.Screen
        name="my"
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: ({ size }) => (
            <Image
              source={require('../../assets/images/그룹 5317.png')}
              style={[styles.icon, { width: size, height: size }]}
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
    // tintColor를 주지 않으면 원본 색상이 그대로 표시됩니다.
  },
});
