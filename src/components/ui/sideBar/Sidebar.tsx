'use client';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../../context/AuthContext';
import SidebarButton from '../buttons/SidebarButton';
import { COLORS } from '../../../config/colors';

interface SidebarProps {
  navigation: any;
  onClose: () => void;
  currentScreen?: string;
}

export default function Sidebar({
  navigation,
  onClose,
  currentScreen = 'Home',
}: SidebarProps) {
  const { user, logout, isAuthenticating } = useAuth();

  const handleLogout = async () => {
    try {
      if (onClose) onClose();
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.hamburgerButton}
        onPress={onClose}
        activeOpacity={0.7}
      >
        <Icon name="menu-outline" size={28} color={COLORS.primary} />
      </TouchableOpacity>

      <View style={styles.profileSection}>
        <View style={styles.profileRow}>
          <Image
            source={{
              uri: user?.photoUrl || 'https://i.pravatar.cc/150?img=12',
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.username}>{user?.name || 'Usuario'}</Text>
            <Text style={styles.handle}>
              @{user?.email?.split('@')[0] || 'user'}
            </Text>
          </View>
        </View>

        <View style={styles.followRow}>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>500 Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>420 Following</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Options */}
      <ScrollView style={styles.menuSection} showsVerticalScrollIndicator={false}>
        <SidebarButton
          title="Home"
          icon="home-outline"
          onPress={() => {
            if (onClose) onClose();
          }}
          active={currentScreen === 'Home'}
        />
        <SidebarButton
          title="Films"
          icon="film-outline"
          onPress={() => {
            if (onClose) onClose();
          }}
          active={currentScreen === 'Films'}
        />
        <SidebarButton
          title="Diary"
          icon="book-outline"
          onPress={() => {
            if (onClose) onClose();
          }}
          active={currentScreen === 'Diary'}
        />
        <SidebarButton
          title="Reviews"
          icon="chatbubble-outline"
          onPress={() => {
            if (onClose) onClose();
          }}
          active={currentScreen === 'Reviews'}
        />
        <SidebarButton
          title="Watchlist"
          icon="bookmark-outline"
          onPress={() => {
            if (onClose) onClose();
          }}
          active={currentScreen === 'Watchlist'}
        />
        <SidebarButton
          title="Lists"
          icon="list-outline"
          onPress={() => {
            if (onClose) onClose();
          }}
          active={currentScreen === 'Lists'}
        />
        <SidebarButton
          title="Likes"
          icon="heart-outline"
          onPress={() => {
            if (onClose) onClose();
          }}
          active={currentScreen === 'Likes'}
        />
      </ScrollView>

      {/* Logout */}
      <View style={styles.logoutSection}>
        {isAuthenticating ? (
          <View style={styles.logoutLoading}>
            <ActivityIndicator color="#C7A24C" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 10,
  },
  hamburgerButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  handle: {
    fontSize: 13,
    color: 'rgba(242, 233, 228, 0.6)',
  },
  followRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  followButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.transparent,
  },
  followButtonText: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '500',
  },
  menuSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  logoutSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 16,
  },
  logoutLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 10,
  },
  logoutLoadingText: {
    color: 'rgba(242, 233, 228, 0.6)',
    fontSize: 14,
  },
});
