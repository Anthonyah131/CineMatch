import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GameScreen } from '../../screens/game/GameScreen';
import { SearchScreen } from '../../screens/search/SearchScreen';
import HomeStack from '../stacks/HomeStack';
import ChatStack from '../stacks/ChatStack';
import ProfileStack from '../stacks/ProfileStack';
import { COLORS } from '../../config/colors';

/**
 * 📱 App Tabs Param List
 *
 * Tabs principales de la app (CON tab bar):
 * - GameTab: Pantalla de juegos (placeholder)
 * - SearchTab: Búsqueda de películas
 * - HomeTab: Stack con HomeMain
 * - ChatsTab: Lista de chats
 * - ProfileTab: Perfil del usuario
 */
export type AppTabsParamList = {
  GameTab: undefined;
  SearchTab: undefined;
  HomeTab: undefined;
  ChatsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

function getTabBarIcon(routeName: keyof AppTabsParamList) {
  return ({ color, size }: { color: string; size: number }) => {
    let iconName: string = 'home-outline';
    
    if (routeName === 'GameTab') iconName = 'game-controller-outline';
    if (routeName === 'SearchTab') iconName = 'search-outline';
    if (routeName === 'HomeTab') iconName = 'home-outline';
    if (routeName === 'ChatsTab') iconName = 'chatbubbles-outline';
    if (routeName === 'ProfileTab') iconName = 'person-outline';
    
    return <Icon name={iconName} size={size} color={color} />;
  };
}

export default function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarIcon: getTabBarIcon(route.name as keyof AppTabsParamList),
        tabBarLabelStyle: styles.tabBarLabel,
      })}
    >
      <Tab.Screen
        name="GameTab"
        component={GameScreen}
        options={{ tabBarLabel: 'Game' }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{ tabBarLabel: 'Search' }}
      />
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="ChatsTab"
        component={ChatStack}
        options={{ tabBarLabel: 'Chats' }}
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
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});
