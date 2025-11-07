import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, StyleSheet, View } from 'react-native';

/**
 * 🔍 Search Stack Param List
 * 
 * Stack del tab Search (CON tab bar y sidebar visibles):
 * - SearchMain: Pantalla principal de búsqueda
 * - Aquí puedes agregar más pantallas que SÍ necesiten tabs:
 *   - SearchFilters: Filtros avanzados
 *   - SearchResults: Resultados de búsqueda
 *   - etc...
 */
export type SearchStackParamList = {
  SearchMain: undefined;
  // SearchFilters: undefined;
  // SearchResults: { query: string };
};

const Stack = createNativeStackNavigator<SearchStackParamList>();

// Pantalla temporal de búsqueda
function SearchMainScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🔍 Search Screen</Text>
      <Text style={styles.subtitle}>Pantalla de búsqueda (próximamente)</Text>
    </View>
  );
}

export default function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchMainScreen} />
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
