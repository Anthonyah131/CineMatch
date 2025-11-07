import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { LoadingProvider } from './src/context/LoadingContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <LoadingProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </LoadingProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
