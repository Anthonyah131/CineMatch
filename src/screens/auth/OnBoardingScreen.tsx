import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from '../../components/ui/buttons/CustomButton';
import { COLORS } from '../../config/colors';

const { width, height } = Dimensions.get('window');

export default function OnBoardingScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.imageSection}>
        <ImageBackground
          source={require('../../assets/images/theatre-416058.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={[
              'rgba(0,0,0,0.9)',
              'rgba(0,0,0,0.6)',
              'rgba(0,0,0,0.35)',
              'rgba(0,0,0,0)',
            ]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
            style={styles.backdropGradient}
          />
        </ImageBackground>
      </View>

      <View style={styles.logoContainer}>
        <Text style={styles.logo}>CineMatch</Text>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.description}>
          "Discover films, track your cinematic journey, and connect with fellow
          movie lovers to share recommendations and celebrate the magic of
          cinema."
        </Text>

        <CustomButton
          title="Get Started"
          onPress={() => navigation.navigate('Login')}
          backgroundColor={COLORS.primary}
          textColor={COLORS.background}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageSection: {
    height: height * 0.5,
    width: width,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  backdropGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  logoContainer: {
    position: 'absolute',
    top: height * 0.5 - 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    color: COLORS.primary,
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 2,
    fontFamily: 'serif',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 10,
  },
  description: {
    color: COLORS.text,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
    fontFamily: 'serif',
  },
});
