import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './stacks/AuthStack';
import AppTabs from './tabs/AppTabs';

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Siempre comenzar con Auth, el login lleva directamente a las tabs */}
      <Stack.Screen name="Auth" component={AuthStack} />
      <Stack.Screen name="App" component={AppTabs} />
    </Stack.Navigator>
  );
}
