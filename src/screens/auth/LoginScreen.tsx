import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../config/colors';
import { useTopRatedPosters } from '../../hooks/auth/useTopRatedPosters';

export default function LoginScreen() {
  const { loginWithGoogle, isAuthenticating, error, clearError } = useAuth();
  const { posters, isLoading: postersLoading } = useTopRatedPosters();
  const [currentPosterIndex, setCurrentPosterIndex] = useState(0);
  const intervalRef = useRef<any>(null);
  useEffect(() => {
    if (posters.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentPosterIndex(prevIndex => (prevIndex + 1) % posters.length);
      }, 8000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [posters.length]);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      // Error handling is managed by AuthContext
    }
  };

  return (
    <View style={styles.background}>
      {!postersLoading && posters.length > 0 ? (
        <ImageBackground
          source={{
            uri: `https://image.tmdb.org/t/p/original${
              posters[currentPosterIndex % posters.length]?.posterPath
            }`,
          }}
          style={styles.posterBackground}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
        </ImageBackground>
      ) : (
        <ImageBackground
          source={require('../../assets/images/theatre-416058.jpg')}
          style={styles.theatreBackground}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
        </ImageBackground>
      )}

      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>CineMatch</Text>
          <Text style={styles.tagline}>Discover. Track. Connect.</Text>
        </View>

        <Text style={styles.header}>Sign in to CineMatch</Text>
        <Text style={styles.subheader}>
          Continue with Google to discover new movies, save favorites, and connect with fellow film fans.
        </Text>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={isAuthenticating}
          activeOpacity={0.8}
        >
          {isAuthenticating ? (
            <ActivityIndicator color="#1A1A1A" />
          ) : (
            <>
              <Icon name="logo-google" size={24} color="#1A1A1A" />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  posterBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  theatreBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 4, 3, 0.75)',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 2,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    fontSize: 48,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 2,
    fontFamily: 'serif', // Para Android - font elegante
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'sans-serif', // Para Android
  },
  header: {
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 32,
    marginBottom: 12,
    fontFamily: 'serif', // Para Android - font elegante
    fontWeight: 'bold',
  },
  subheader: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
    fontFamily: 'sans-serif', // Para Android
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.text,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  googleButtonText: {
    color: COLORS.background,
    fontSize: 16,
  },
});
