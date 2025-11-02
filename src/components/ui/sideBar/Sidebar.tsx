import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import SidebarButton from '../buttons/SidebarButton';
import { useAuth } from '../../../context/AuthContext';

export default function Sidebar({ navigation, onClose }: any) {
  const { user, logout, isAuthenticating } = useAuth();

  const handleLogout = async () => {
    try {
      if (onClose) onClose();
      await logout();
      // La navegación se manejará automáticamente por RootNavigator
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.profileSection}>
        <Image
          source={{ 
            uri: user?.photoUrl || 'https://i.pravatar.cc/150?img=12' 
          }}
          style={styles.avatar}
        />
        <Text style={styles.username}>{user?.name || 'Usuario'}</Text>
        <Text style={styles.handle}>@{user?.email?.split('@')[0] || 'user'}</Text>

        <View style={styles.followRow}>
          <Text style={styles.followText}>500 Followers</Text>
          <Text style={styles.followText}>420 Following</Text>
        </View>
      </View>

      {/* Options */}
      <ScrollView>
        <SidebarButton
          title="Home"
          icon="home-outline"
          onPress={() => {
            if (onClose) onClose();
            navigation.navigate('Home');
          }}
          active
        />
        <SidebarButton
          title="Films"
          icon="film-outline"
          onPress={() => {
            if (onClose) onClose();
            // navigation.navigate('Films');
          }}
        />
        <SidebarButton
          title="Diary"
          icon="book-outline"
          onPress={() => {
            if (onClose) onClose();
            // navigation.navigate('Diary');
          }}
        />
        <SidebarButton
          title="Reviews"
          icon="chatbubble-outline"
          onPress={() => {
            if (onClose) onClose();
            // navigation.navigate('Reviews');
          }}
        />
        <SidebarButton
          title="Watchlist"
          icon="bookmark-outline"
          onPress={() => {
            if (onClose) onClose();
            // navigation.navigate('Watchlist');
          }}
        />
        <SidebarButton
          title="Lists"
          icon="list-outline"
          onPress={() => {
            if (onClose) onClose();
            // navigation.navigate('Lists');
          }}
        />
        <SidebarButton
          title="Likes"
          icon="heart-outline"
          onPress={() => {
            if (onClose) onClose();
            // navigation.navigate('Likes');
          }}
        />
      </ScrollView>

      {/* Logout */}
      {isAuthenticating ? (
        <View style={styles.logoutLoading}>
          <ActivityIndicator color="#E69CA3" />
          <Text style={styles.logoutLoadingText}>Cerrando sesión...</Text>
        </View>
      ) : (
        <SidebarButton
          title="Logout"
          icon="log-out-outline"
          onPress={handleLogout}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1730',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  handle: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 12,
  },
  followRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  followText: {
    color: '#fff',
    fontSize: 14,
  },
  logoutLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 10,
  },
  logoutLoadingText: {
    color: '#aaa',
    fontSize: 14,
  },
});
