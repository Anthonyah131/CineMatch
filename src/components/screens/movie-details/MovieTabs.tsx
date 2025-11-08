import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../config/colors';

export type MovieTab = 'cast' | 'crew' | 'details';

interface MovieTabsProps {
  activeTab: MovieTab;
  onTabChange: (tab: MovieTab) => void;
}

export function MovieTabs({ activeTab, onTabChange }: MovieTabsProps) {
  const tabs: Array<{ id: MovieTab; label: string }> = [
    { id: 'cast', label: 'Casts' },
    { id: 'crew', label: 'Crews' },
    { id: 'details', label: 'Details' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabChange(tab.id)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  activeTab: {
    backgroundColor: COLORS.text,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    opacity: 0.6,
  },
  activeTabText: {
    opacity: 1,
    color: COLORS.primary,
  },
});
