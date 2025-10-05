import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SidebarButtonProps {
  title: string;
  icon: string;
  onPress: () => void;
  active?: boolean;
}

export default function SidebarButton({
  title,
  icon,
  onPress,
  active = false,
}: SidebarButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, active && styles.activeButton]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.row}>
        <Icon
          name={icon}
          size={20}
          color={active ? '#1B1730' : '#fff'}
          style={styles.icon}
        />
        <Text style={[styles.text, active && styles.activeText]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginVertical: 6,
  },
  activeButton: {
    backgroundColor: '#E69CA3',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  activeText: {
    color: '#1B1730',
  },
});
