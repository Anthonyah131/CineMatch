import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';

export interface ProfileFormValues {
  displayName: string;
  bio: string;
  birthdate: Date;
}

const profileValidationSchema = Yup.object().shape({
  displayName: Yup.string()
    .required('Display name is required')
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be less than 50 characters'),
  bio: Yup.string()
    .max(500, 'Bio must be less than 500 characters'),
  birthdate: Yup.date()
    .required('Birth date is required')
    .max(new Date(), 'Birth date cannot be in the future')
    .test('age', 'You must be at least 13 years old', function(value) {
      if (!value) return false;
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 13);
      return value <= cutoff;
    }),
});

interface EditProfileModalProps {
  visible: boolean;
  initialValues: ProfileFormValues;
  onSave: (values: ProfileFormValues) => Promise<boolean>;
  onClose: () => void;
}

export default function EditProfileModal({
  visible,
  initialValues,
  onSave,
  onClose,
}: EditProfileModalProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleFormSubmit = async (
    values: ProfileFormValues,
    { setSubmitting }: any
  ) => {
    const success = await onSave(values);
    setSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Formik
            initialValues={initialValues}
            validationSchema={profileValidationSchema}
            onSubmit={handleFormSubmit}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              isSubmitting,
            }) => (
              <>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Edit Profile</Text>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                    disabled={isSubmitting}
                  >
                    <Icon name="close" size={24} color={COLORS.text} />
                  </TouchableOpacity>
                </View>

                {/* Body */}
                <ScrollView
                  style={styles.body}
                  showsVerticalScrollIndicator={false}
                >
                  {/* Display Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Display Name *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        touched.displayName &&
                          errors.displayName &&
                          styles.inputError,
                      ]}
                      value={values.displayName}
                      onChangeText={handleChange('displayName')}
                      onBlur={handleBlur('displayName')}
                      placeholder="Enter your display name"
                      placeholderTextColor={COLORS.textSecondary}
                      editable={!isSubmitting}
                    />
                    {touched.displayName && errors.displayName && (
                      <Text style={styles.errorText}>{errors.displayName}</Text>
                    )}
                  </View>

                  {/* Bio */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={values.bio}
                      onChangeText={handleChange('bio')}
                      onBlur={handleBlur('bio')}
                      placeholder="Tell us about yourself"
                      placeholderTextColor={COLORS.textSecondary}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      editable={!isSubmitting}
                    />
                    {touched.bio && errors.bio && (
                      <Text style={styles.errorText}>{errors.bio}</Text>
                    )}
                  </View>

                  {/* Birth Date */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Birth Date *</Text>
                    <TouchableOpacity
                      style={[
                        styles.dateButton,
                        touched.birthdate &&
                          errors.birthdate &&
                          styles.inputError,
                      ]}
                      onPress={() => setShowDatePicker(true)}
                      disabled={isSubmitting}
                    >
                      <Icon
                        name="calendar-outline"
                        size={20}
                        color={COLORS.primary}
                      />
                      <Text style={styles.dateButtonText}>
                        {values.birthdate.toLocaleDateString()}
                      </Text>
                    </TouchableOpacity>
                    {touched.birthdate && errors.birthdate && (
                      <Text style={styles.errorText}>
                        {String(errors.birthdate)}
                      </Text>
                    )}
                  </View>

                  {showDatePicker && (
                    <DateTimePicker
                      value={values.birthdate}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(Platform.OS === 'ios');
                        if (selectedDate) {
                          setFieldValue('birthdate', selectedDate);
                        }
                      }}
                      maximumDate={new Date()}
                      minimumDate={new Date(1900, 0, 1)}
                    />
                  )}
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onClose}
                    disabled={isSubmitting}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.saveButton,
                      isSubmitting && styles.saveButtonDisabled,
                    ]}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color={COLORS.background} />
                    ) : (
                      <Text style={styles.saveButtonText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  body: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  textArea: {
    minHeight: 100,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
});
