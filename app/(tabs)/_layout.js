import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4f6dff',
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      <Tabs.Screen
        name="exercise"
        options={{
          title: '운동하기',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dumbbell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="device"
        options={{
          title: '기기정보',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="devices" size={size} color={color} />
          ),
        }}
      />

      {/* mypage/index만 탭으로 등록 (faq는 여기에 적지 않습니다) */}
      <Tabs.Screen
        name="mypage/index"
        options={{
          title: '마이페이지',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
