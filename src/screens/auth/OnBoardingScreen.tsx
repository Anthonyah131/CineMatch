import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import CustomButton from '../../components/ui/buttons/CustomButton';

const { width } = Dimensions.get('window');

export default function OnBoardingScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* Imagen de portada */}
      <Image
        source={{ uri: 'https://i.imgur.com/2nCt3Sbl.jpg' }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Contenido inferior */}
      <View style={styles.content}>
        {/* Logo y título */}
        <View style={styles.logoRow}>
          <View style={styles.circleGreen} />
          <View style={styles.circleOrange} />
          <View style={styles.circleBlue} />
          <View style={styles.circleCyan} />
        </View>

        <Text style={styles.title}>Letterboxd</Text>

        {/* Descripción */}
        <Text style={styles.description}>
          “Track films you’ve watched. Save those you want to see. Tell your
          friends what’s good.”
        </Text>

        {/* Botón reutilizable */}
        <CustomButton
          title="Get Started"
          onPress={() => navigation.navigate('Login')}
          backgroundColor="#E69CA3"
          textColor="#1A1A1A"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1730',
  },
  image: {
    width: width,
    height: '55%',
  },
  content: {
    flex: 1,
    backgroundColor: '#1B1730',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  circleGreen: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: '#00C853',
  },
  circleOrange: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: '#FF6D00',
  },
  circleBlue: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: '#2979FF',
  },
  circleCyan: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
    backgroundColor: '#00E5FF',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    color: '#ccc',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
