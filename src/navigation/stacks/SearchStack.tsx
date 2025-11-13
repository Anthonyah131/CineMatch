import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchMainScreen } from '../../screens/search/SearchScreen';
import FollowListScreen from '../../screens/profile/FollowListScreen';
import UserProfileScreen from '../../screens/profile/UserProfileScreen';
import MovieDetailsScreen from '../../screens/movies/MovieDetailsScreen';
import { ForumDetailsScreen } from '../../screens/forums/ForumDetailsScreen';
import type { FollowListType } from '../../hooks/profile/useFollowList';

/**
 * 🔍 Search Stack Param List
 * 
 * Stack del tab Search (CON tab bar y sidebar visibles):
 * - SearchMain: Pantalla principal de búsqueda
 * - FollowList: Lista de seguidores/seguidos
 * - UserProfile: Perfil de otro usuario
 * - MovieDetails: Detalles de película
 * - ForumDetails: Detalles de foro
 */
export type SearchStackParamList = {
  SearchMain: undefined;
  FollowList: { type: FollowListType; userId: string };
  UserProfile: { userId: string };
  MovieDetails: { movieId: number };
  ForumDetails: { forumId: string };
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

export default function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchMainScreen} />
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
      <Stack.Screen 
        name="ForumDetails" 
        component={ForumDetailsScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
    </Stack.Navigator>
  );
}
