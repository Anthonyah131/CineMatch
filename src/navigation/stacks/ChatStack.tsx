import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatsListScreen } from '../../screens/chats/ChatsListScreen';
import { ChatScreen } from '../../screens/chats/ChatScreen';
import UserProfileScreen from '../../screens/profile/UserProfileScreen';

/**
 * 💬 Chat Stack Param List
 *
 * Stack de navegación para chats:
 * - ChatsMain: Lista de chats
 * - Chat: Chat individual 
 * - UserProfile: Perfil de usuario (desde chat)
 */
export type ChatStackParamList = {
  ChatsMain: undefined;
  Chat: { chatId: string };
  UserProfile: { userId: string };
};

const Stack = createNativeStackNavigator<ChatStackParamList>();

export default function ChatStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ChatsMain" component={ChatsListScreen as any} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
    </Stack.Navigator>
  );
}