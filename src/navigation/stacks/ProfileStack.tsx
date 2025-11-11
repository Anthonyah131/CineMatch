import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../../screens/profile/ProfileScreen';
import FollowListScreen from '../../screens/profile/FollowListScreen';
import UserProfileScreen from '../../screens/profile/UserProfileScreen';
import MovieDetailsScreen from '../../screens/movies/MovieDetailsScreen';
import type { FollowListType } from '../../hooks/profile/useFollowList';

/**
 * 👤 Profile Stack Param List
 *
 * Stack del tab Profile (CON tab bar y sidebar visibles):
 * - ProfileMain: Pantalla principal de perfil
 * - FollowList: Lista de seguidores/seguidos
 * - UserProfile: Perfil de otro usuario
 * - MovieDetails: Detalles de película
 */
export type ProfileStackParamList = {
  ProfileMain: undefined;
  FollowList: { type: FollowListType; userId: string };
  UserProfile: { userId: string };
  MovieDetails: { movieId: number };
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen 
        name="FollowList" 
        component={FollowListScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="MovieDetails" 
        component={MovieDetailsScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
