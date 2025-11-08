import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../../screens/profile/ProfileScreen';

/**
 * 👤 Profile Stack Param List
 *
 * Stack del tab Profile (CON tab bar y sidebar visibles):
 * - ProfileMain: Pantalla principal de perfil
 * - Aquí puedes agregar más pantallas que SÍ necesiten tabs:
 *   - EditProfile: Editar perfil
 *   - Settings: Configuración
 *   - etc...
 */
export type ProfileStackParamList = {
  ProfileMain: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    </Stack.Navigator>
  );
}
