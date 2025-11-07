import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeStack from '../stacks/HomeStack';
import SearchStack from '../stacks/SearchStack';
import ProfileStack from '../stacks/ProfileStack';

/**
 * 📱 App Tabs Param List
 *
 * Tabs principales de la app (CON tab bar y sidebar):
 * - HomeTab: Stack con HomeMain y otras pantallas de home
 * - SearchTab: Stack con búsqueda y filtros
 * - ProfileTab: Stack con perfil y configuración
 */
export type AppTabsParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

function getTabBarIcon(routeName: keyof AppTabsParamList) {
  return ({ color, size }: { color: string; size: number }) => {
    let iconName: string = 'home-outline';
    if (routeName === 'SearchTab') iconName = 'search-outline';
    if (routeName === 'ProfileTab') iconName = 'person-outline';
    return <Icon name={iconName} size={size} color={color} />;
  };
}

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#C7A24C',
        tabBarInactiveTintColor: '#C9ADA7',
        tabBarIcon: getTabBarIcon(route.name as keyof AppTabsParamList),
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{ tabBarLabel: 'Buscar' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#1A1412',
    borderTopWidth: 1,
    borderTopColor: '#1A1412',
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
});
