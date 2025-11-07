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
      style={[styles.button, active && styles.buttonActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.row}>
        <Icon name={icon} size={22} color="#C7A24C" style={styles.icon} />
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginVertical: 4,
  },
  buttonActive: {
    backgroundColor: 'rgba(199, 162, 76, 0.15)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 16,
  },
  text: {
    color: '#C7A24C',
    fontSize: 16,
    fontWeight: '500',
  },
});
