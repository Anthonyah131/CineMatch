import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeStack from '../stacks/HomeStack';

const dummyScreenStyle = {
  flex: 1,
  textAlign: 'center' as const,
  marginTop: 100,
};

function DummyScreen({ title }: { title: string }) {
  return <Text style={dummyScreenStyle}>{title}</Text>;
}

export type AppTabsParamList = {
  Home: undefined;
  Search: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

function getTabBarIcon(routeName: keyof AppTabsParamList) {
  return ({ color, size }: { color: string; size: number }) => {
    let iconName: string = 'home-outline';
    if (routeName === 'Search') iconName = 'search-outline';
    if (routeName === 'Profile') iconName = 'person-outline';
    return <Icon name={iconName} size={size} color={color} />;
  };
}

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1B1730', borderTopColor: '#333' },
        tabBarActiveTintColor: '#E69CA3',
        tabBarInactiveTintColor: '#aaa',
        tabBarIcon: getTabBarIcon(route.name as keyof AppTabsParamList),
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen
        name="Search"
        children={() => <DummyScreen title="Search Screen" />}
      />
      <Tab.Screen
        name="Profile"
        children={() => <DummyScreen title="Profile Screen" />}
      />
    </Tab.Navigator>
  );
}
