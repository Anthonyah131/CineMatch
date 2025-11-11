import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../config/colors';

export default function LoginScreen() {
  const { loginWithGoogle, isAuthenticating, error, clearError } = useAuth();

  // Mostrar errores
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error, clearError]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      // La navegación se manejará automáticamente por el RootNavigator
    } catch (err) {
      // El error ya se muestra en el useEffect
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.imgur.com/dxjd7FB.jpeg' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={[styles.circle, styles.circleOrange]} />
          <View style={[styles.circle, styles.circleGreen]} />
          <View style={[styles.circle, styles.circleDarkBlue]} />
          <View style={[styles.circle, styles.circleBlue]} />
        </View>
        <Text style={styles.title}>Letterboxd</Text>

        {/* Login form */}
        <Text style={styles.header}>Login</Text>
        <Text style={styles.subheader}>Inicia sesión con tu cuenta de Google</Text>

        {/* Google Sign-In Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={isAuthenticating}
        >
          {isAuthenticating ? (
            <ActivityIndicator color="#1A1A1A" />
          ) : (
            <>
              <Icon name="logo-google" size={24} color="#1A1A1A" />
              <Text style={styles.googleButtonText}>
                Iniciar sesión con Google
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Removed Sign Up link - registration disabled for now */}
        {/* <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('SignUp')}
          >
            Sign Up
          </Text>{' '}
          first.
        </Text> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27, 23, 48, 0.8)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  circleOrange: {
    backgroundColor: COLORS.warning,
  },
  circleGreen: {
    backgroundColor: COLORS.success,
  },
  circleDarkBlue: {
    backgroundColor: COLORS.info,
  },
  circleBlue: {
    backgroundColor: COLORS.info,
  },
  title: {
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  header: {
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subheader: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  forgot: {
    color: COLORS.textSecondary,
    textAlign: 'right',
    marginBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    marginTop: 20,
  },
  link: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  separatorText: {
    color: COLORS.textSecondary,
    marginHorizontal: 10,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.text,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    gap: 10,
  },
  googleButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
