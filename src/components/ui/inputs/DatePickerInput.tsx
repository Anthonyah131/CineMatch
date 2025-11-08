import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../config/colors';

interface DatePickerInputProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
}

export function DatePickerInput({
  label,
  value,
  onChange,
  maximumDate,
  minimumDate,
}: DatePickerInputProps) {
  const [show, setShow] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.button} onPress={() => setShow(true)}>
        <Icon name="calendar-outline" size={20} color={COLORS.primary} />
        <Text style={styles.dateText}>{formatDate(value)}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          textColor={COLORS.text}
          themeVariant="dark"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 8,
    opacity: 0.7,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.surface,
  },
  dateText: {
    color: COLORS.text,
    fontSize: 14,
    flex: 1,
  },
});
