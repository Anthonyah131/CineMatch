import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../config/colors';

export type SearchTabType = 'movies' | 'users' | 'forums';

interface SearchTabsProps {
  activeTab: SearchTabType;
  onTabChange: (tab: SearchTabType) => void;
  movieCount?: number;
  userCount?: number;
  forumCount?: number;
}

export const SearchTabs: React.FC<SearchTabsProps> = ({
  activeTab,
  onTabChange,
  movieCount,
  userCount,
  forumCount,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'movies' && styles.activeTab,
        ]}
        onPress={() => onTabChange('movies')}
        activeOpacity={0.7}
      >
        <View style={styles.tabContent}>
          <Icon 
            name="film-outline" 
            size={20} 
            color={activeTab === 'movies' ? COLORS.background : COLORS.textSecondary} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'movies' && styles.activeTabText,
          ]}>
            Películas
          </Text>
          {movieCount !== undefined && movieCount > 0 && (
            <View style={[
              styles.badge,
              activeTab === 'movies' && styles.activeBadge,
            ]}>
              <Text style={[
                styles.badgeText,
                activeTab === 'movies' && styles.activeBadgeText,
              ]}>
                {movieCount > 99 ? '99+' : movieCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'users' && styles.activeTab,
        ]}
        onPress={() => onTabChange('users')}
        activeOpacity={0.7}
      >
        <View style={styles.tabContent}>
          <Icon 
            name="people-outline" 
            size={20} 
            color={activeTab === 'users' ? COLORS.background : COLORS.textSecondary} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'users' && styles.activeTabText,
          ]}>
            Usuarios
          </Text>
          {userCount !== undefined && userCount > 0 && (
            <View style={[
              styles.badge,
              activeTab === 'users' && styles.activeBadge,
            ]}>
              <Text style={[
                styles.badgeText,
                activeTab === 'users' && styles.activeBadgeText,
              ]}>
                {userCount > 99 ? '99+' : userCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'forums' && styles.activeTab,
        ]}
        onPress={() => onTabChange('forums')}
        activeOpacity={0.7}
      >
        <View style={styles.tabContent}>
          <Icon 
            name="chatbubbles-outline" 
            size={20} 
            color={activeTab === 'forums' ? COLORS.background : COLORS.textSecondary} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'forums' && styles.activeTabText,
          ]}>
            Foros
          </Text>
          {forumCount !== undefined && forumCount > 0 && (
            <View style={[
              styles.badge,
              activeTab === 'forums' && styles.activeBadge,
            ]}>
              <Text style={[
                styles.badgeText,
                activeTab === 'forums' && styles.activeBadgeText,
              ]}>
                {forumCount > 99 ? '99+' : forumCount}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.background,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: COLORS.background,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.background,
  },
  activeBadgeText: {
    color: COLORS.primary,
  },
});