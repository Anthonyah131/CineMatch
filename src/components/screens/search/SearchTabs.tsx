import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../config/colors';

export type SearchTabType = 'movies' | 'users' | 'forums' | 'lists';

interface SearchTabsProps {
  activeTab: SearchTabType;
  onTabChange: (tab: SearchTabType) => void;
  movieCount?: number;
  userCount?: number;
  forumCount?: number;
  listCount?: number;
}

export const SearchTabs: React.FC<SearchTabsProps> = ({
  activeTab,
  onTabChange,
  movieCount,
  userCount,
  forumCount,
  listCount,
}) => {
  const tabs = [
    {
      key: 'movies' as SearchTabType,
      icon: 'film-outline',
      label: 'Películas',
      count: movieCount,
    },
    {
      key: 'users' as SearchTabType,
      icon: 'people-outline',
      label: 'Usuarios',
      count: userCount,
    },
    {
      key: 'forums' as SearchTabType,
      icon: 'chatbubbles-outline',
      label: 'Foros',
      count: forumCount,
    },
    {
      key: 'lists' as SearchTabType,
      icon: 'list-outline',
      label: 'Listas',
      count: listCount,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Icon 
                name={tab.icon} 
                size={18} 
                color={activeTab === tab.key ? COLORS.background : COLORS.textSecondary} 
              />
              <Text style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}>
                {tab.label}
              </Text>
              {tab.count !== undefined && tab.count > 0 && (
                <View style={[
                  styles.badge,
                  activeTab === tab.key && styles.activeBadge,
                ]}>
                  <Text style={[
                    styles.badgeText,
                    activeTab === tab.key && styles.activeBadgeText,
                  ]}>
                    {tab.count > 99 ? '99+' : tab.count}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 4,
    gap: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
    minWidth: 80,
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  activeTabText: {
    color: COLORS.background,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  activeBadge: {
    backgroundColor: COLORS.background,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.background,
  },
  activeBadgeText: {
    color: COLORS.primary,
  },
});