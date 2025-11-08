import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomInput from '../../components/ui/inputs/CustomInput';
import CustomButton from '../../components/ui/buttons/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../config/colors';

export default function SignUpScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { registerWithGoogle, registerWithEmail, isAuthenticating, error, clearError } = useAuth();

  // Mostrar errores
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'OK', onPress: clearError }
      ]);
    }
  }, [error, clearError]);

  const handleGoogleSignUp = async () => {
    try {
      await registerWithGoogle();
      // La navegación se manejará automáticamente por el RootNavigator
    } catch (err) {
      // El error ya se muestra en el useEffect
      console.error('Error en Google signup:', err);
    }
  };

  const handleEmailSignUp = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await registerWithEmail(email, password, username);
      // La navegación se manejará automáticamente por el RootNavigator
    } catch (err) {
      // El error ya se muestra en el useEffect
      console.error('Error en email signup:', err);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://i.imgur.com/dxjd7FB.jpeg' }} // reemplaza con tu imagen de fondo
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={[styles.circle, styles.circleOrange]} />
          <View style={[styles.circle, styles.circleGreen]} />
          <View style={[styles.circle, styles.circleBlue]} />
          <View style={[styles.circle, styles.circleCyan]} />
        </View>
        <Text style={styles.title}>Letterboxd</Text>

        {/* Sign Up form */}
        <Text style={styles.header}>Sign Up</Text>
        <Text style={styles.subheader}>Create an account to continue.</Text>

        <CustomInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          iconName="person-outline"
        />
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

        <CustomButton
          title={isAuthenticating ? "Creando cuenta..." : "Sign Up"}
          onPress={handleEmailSignUp}
          backgroundColor="#E69CA3"
          textColor="#1A1A1A"
          disabled={isAuthenticating}
        />

        {/* Separator */}
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>O regístrate con</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Google Sign-Up Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignUp}
          disabled={isAuthenticating}
        >
          {isAuthenticating ? (
            <ActivityIndicator color="#1A1A1A" />
          ) : (
            <>
              <Icon name="logo-google" size={24} color="#1A1A1A" />
              <Text style={styles.googleButtonText}>Registrarse con Google</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.goBack()}
          >
            Login Page
          </Text>
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
    backgroundColor: COLORS.warning,
  },
  circleGreen: {
    backgroundColor: COLORS.success,
  },
  circleBlue: {
    backgroundColor: COLORS.info,
  },
  circleCyan: {
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
