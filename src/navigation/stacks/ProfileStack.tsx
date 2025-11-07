import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, StyleSheet, View } from 'react-native';

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
  // EditProfile: undefined;
  // Settings: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

// Pantalla temporal de perfil
function ProfileMainScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👤 Profile Screen</Text>
      <Text style={styles.subtitle}>Pantalla de perfil (próximamente)</Text>
    </View>
  );
}

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileMainScreen} />
      {/* Aquí agregas pantallas que SÍ necesitan tabs */}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0B0A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F2E9E4',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#C9ADA7',
    textAlign: 'center',
  },
});
