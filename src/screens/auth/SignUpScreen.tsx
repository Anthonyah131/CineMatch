import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import CustomInput from '../../components/ui/inputs/CustomInput';
import CustomButton from '../../components/ui/buttons/CustomButton';

export default function SignUpScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    // Navegar directamente al HomeScreen
    navigation.navigate('App');
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
          title="Sign Up"
          onPress={handleSignUp}
          backgroundColor="#E69CA3"
          textColor="#1A1A1A"
        />

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
    backgroundColor: '#FF6D00',
  },
  circleGreen: {
    backgroundColor: '#00C853',
  },
  circleBlue: {
    backgroundColor: '#2979FF',
  },
  circleCyan: {
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
