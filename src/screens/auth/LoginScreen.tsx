import React, { useState, useEffect } from 'react';
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
import CustomInput from '../../components/ui/inputs/CustomInput';
import CustomButton from '../../components/ui/buttons/CustomButton';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginWithGoogle, loginWithEmail, isAuthenticating, error, clearError } = useAuth();

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

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }

    try {
      await loginWithEmail(email, password);
      // La navegación se manejará automáticamente por el RootNavigator
    } catch (err) {
      // El error ya se muestra en el useEffect
      console.error('Error en email login:', err);
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
        <Text style={styles.subheader}>Please sign in to continue.</Text>

        <CustomInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          iconName="mail-outline"
        />
        <CustomInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          iconName="lock-closed-outline"
          secureTextEntry
        />

        {/* Forgot password */}
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <CustomButton
          title={isAuthenticating ? 'Iniciando sesión...' : 'Login'}
          onPress={handleEmailLogin}
          backgroundColor="#E69CA3"
          textColor="#1A1A1A"
          disabled={isAuthenticating}
        />

        {/* Separator */}
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>O continua con</Text>
          <View style={styles.separatorLine} />
        </View>

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

        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('SignUp')}
          >
            Sign Up
          </Text>{' '}
          first.
        </Text>
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
    backgroundColor: '#FF6D00',
  },
  circleGreen: {
    backgroundColor: '#00C853',
  },
  circleDarkBlue: {
    backgroundColor: '#2979FF',
  },
  circleBlue: {
    backgroundColor: '#00E5FF',
  },
  title: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  header: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subheader: {
    textAlign: 'center',
    color: '#ccc',
    marginBottom: 20,
  },
  forgot: {
    color: '#aaa',
    textAlign: 'right',
    marginBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    color: '#ccc',
    marginTop: 20,
  },
  link: {
    color: '#E69CA3',
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
    backgroundColor: '#555',
  },
  separatorText: {
    color: '#aaa',
    marginHorizontal: 10,
    fontSize: 14,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
    gap: 10,
  },
  googleButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
});
