import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import CustomInput from '../../components/ui/inputs/CustomInput';
import CustomButton from '../../components/ui/buttons/CustomButton';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Navegar a las tabs (App)
    navigation.navigate('App');
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
          title="Login"
          onPress={handleLogin}
          backgroundColor="#E69CA3"
          textColor="#1A1A1A"
        />

        <Text style={styles.footerText}>
          Don’t have an account?{' '}
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
});
