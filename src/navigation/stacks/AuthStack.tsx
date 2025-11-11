import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnBoardingScreen from '../../screens/auth/OnBoardingScreen';
import LoginScreen from '../../screens/auth/LoginScreen';
// import SignUpScreen from '../../screens/auth/SignUpScreen'; // Disabled for now

export type AuthStackParamList = {
  OnBoarding: undefined;
  Login: undefined;
  // SignUp: undefined; // Disabled for now
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnBoarding" component={OnBoardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* SignUp screen disabled for now - manual registration not available */}
      {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
    </Stack.Navigator>
  );
}
