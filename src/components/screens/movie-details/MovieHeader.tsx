import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const COLORS = {
  background: '#0F0B0A',
  surface: '#1A1412',
  primary: '#C7A24C',
  accent: '#A4252C',
  text: '#F2E9E4',
};

interface MovieHeaderProps {
  onBack: () => void;
}

export function MovieHeader({ onBack }: MovieHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Icon name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(26, 20, 18, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
