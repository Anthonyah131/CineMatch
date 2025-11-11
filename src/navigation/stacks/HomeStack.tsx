import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/home/HomeScreen';
import { MatchesScreen } from '../../screens/matches/MatchesScreen';
import MovieDetailsScreen from '../../screens/movies/MovieDetailsScreen';
import DiaryScreen from '../../screens/diary/DiaryScreen';
import LogDetailScreen from '../../screens/diary/LogDetailScreen';
import FollowListScreen from '../../screens/profile/FollowListScreen';
import UserProfileScreen from '../../screens/profile/UserProfileScreen';
import type { FollowListType } from '../../hooks/profile/useFollowList';

/**
 * 🏠 Home Stack Param List
 * 
 * Stack del tab Home (CON tab bar y sidebar visibles):
 * - HomeMain: Pantalla principal con carruseles
 * - Matches: Pantalla de matches con usuarios que vieron películas similares
 * - Diary: Diario de logs de visualización
 * - LogDetail: Detalles de un log específico
 * - FollowList: Lista de seguidores o seguidos de un usuario
 * - UserProfile: Perfil de otro usuario
 * - MovieDetails: Detalles de película (compartido con RootNavigator)
 */
export type HomeStackParamList = {
  HomeMain: undefined;
  Matches: undefined;
  Diary: undefined;
  LogDetail: { logId: string };
  FollowList: { type: FollowListType; userId: string };
  UserProfile: { userId: string };
  MovieDetails: { movieId: number };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Matches" component={MatchesScreen} />
      <Stack.Screen 
        name="Diary" 
        component={DiaryScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
      <Stack.Screen 
        name="LogDetail" 
        component={LogDetailScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right',
        }}
      />
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
