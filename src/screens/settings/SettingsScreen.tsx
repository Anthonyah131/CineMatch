import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../config/colors';
import { useUserSettings } from '../../hooks/settings/useUserSettings';
import { useSettingsActions } from '../../hooks/settings/useSettingsActions';
import SelectModal, { SelectOption } from '../../components/ui/inputs/SelectModal';
import EditProfileModal, { type ProfileFormValues } from '../../components/settings/EditProfileModal';

interface SettingsScreenProps {
  navigation: any;
}

const LANGUAGES: SelectOption[] = [
  { code: 'es', name: 'Español' },
  { code: 'en', name: 'English' },
];

const COUNTRIES: SelectOption[] = [
  { code: 'US', name: 'United States' },
  { code: 'MX', name: 'México' },
  { code: 'ES', name: 'España' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Perú' },
  { code: 'CL', name: 'Chile' },
  { code: 'VE', name: 'Venezuela' },
  { code: 'EC', name: 'Ecuador' },
  { code: 'GT', name: 'Guatemala' },
  { code: 'CU', name: 'Cuba' },
  { code: 'BO', name: 'Bolivia' },
  { code: 'DO', name: 'República Dominicana' },
  { code: 'HN', name: 'Honduras' },
  { code: 'PY', name: 'Paraguay' },
  { code: 'SV', name: 'El Salvador' },
  { code: 'NI', name: 'Nicaragua' },
  { code: 'CR', name: 'Costa Rica' },
  { code: 'PA', name: 'Panamá' },
  { code: 'UY', name: 'Uruguay' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'BR', name: 'Brazil' },
];

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  // HOOKS PRIMERO - SIEMPRE EN EL MISMO ORDEN
  const { userData, isLoading, error, updateProfile, refreshUser } = useUserSettings();
  
  // Estados locales
  const [language, setLanguage] = useState<string>('');
  const [region, setRegion] = useState<string>('');
  const [showEmail, setShowEmail] = useState(false);
  const [showBirthdate, setShowBirthdate] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);

  // Hook de acciones (debe estar después de todos los useState)
  const {
    handleLanguageChange,
    handleRegionChange,
    handlePrivacyToggle,
    handleSaveProfile,
  } = useSettingsActions({
    updateProfile,
    currentSettings: {
      language: userData?.settings?.language,
      region: userData?.settings?.region,
      privacy: {
        showEmail: userData?.settings?.privacy?.showEmail,
        showBirthdate: userData?.settings?.privacy?.showBirthdate,
      },
    },
    onLanguageChange: setLanguage,
    onRegionChange: setRegion,
    onPrivacyChange: (field, value) => {
      if (field === 'email') setShowEmail(value);
      else setShowBirthdate(value);
    },
  });

  // Sincronizar con userData cuando cambie
  useEffect(() => {
    if (userData) {
      setLanguage(userData.settings?.language || '');
      setRegion(userData.settings?.region || '');
      setShowEmail(userData.settings?.privacy?.showEmail ?? false);
      setShowBirthdate(userData.settings?.privacy?.showBirthdate ?? false);
    }
  }, [userData]);

  // Handlers
  const handleLanguageSelect = (languageCode: string) => {
    const languageName = LANGUAGES.find(l => l.code === languageCode)?.name || '';
    handleLanguageChange(languageCode, languageName);
  };

  const handleRegionSelect = (regionCode: string) => {
    const regionName = COUNTRIES.find(c => c.code === regionCode)?.name || '';
    handleRegionChange(regionCode, regionName);
  };

  const handleEditProfile = async (values: ProfileFormValues) => {
    const success = await handleSaveProfile(values);
    return success;
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  if (error || !userData) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>{error || 'Error loading settings'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshUser}>
          <Icon name="refresh" size={20} color={COLORS.background} />
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const selectedLanguage = LANGUAGES.find(l => l.code === language);
  const selectedRegion = COUNTRIES.find(c => c.code === region);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => setShowEditModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Icon name="person-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Edit Profile</Text>
              <Text style={styles.settingSubtitle}>
                Update your name, bio, and birth date
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          {/* Language */}
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => setShowLanguageModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Icon name="language-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Language</Text>
              <Text style={[
                styles.settingSubtitle,
                !language && styles.settingSubtitlePlaceholder
              ]}>
                {selectedLanguage?.name || 'Not selected'}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          {/* Region */}
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => setShowRegionModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Icon name="globe-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Region</Text>
              <Text style={[
                styles.settingSubtitle,
                !region && styles.settingSubtitlePlaceholder
              ]}>
                {selectedRegion?.name || 'Not selected'}
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.settingCard}>
            <View style={styles.iconContainer}>
              <Icon name="shield-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacy Settings</Text>
              <View style={styles.privacyOptions}>
                {/* Show Email Toggle */}
                <TouchableOpacity
                  style={styles.privacyRow}
                  onPress={() => handlePrivacyToggle('email', !showEmail)}
                >
                  <Text style={styles.privacyLabel}>Show Email</Text>
                  <View style={[styles.toggle, showEmail && styles.toggleActive]}>
                    <View
                      style={[
                        styles.toggleThumb,
                        showEmail && styles.toggleThumbActive,
                      ]}
                    />
                  </View>
                </TouchableOpacity>

                {/* Show Birthdate Toggle */}
                <TouchableOpacity
                  style={styles.privacyRow}
                  onPress={() => handlePrivacyToggle('birthdate', !showBirthdate)}
                >
                  <Text style={styles.privacyLabel}>Show Birth Date</Text>
                  <View
                    style={[styles.toggle, showBirthdate && styles.toggleActive]}
                  >
                    <View
                      style={[
                        styles.toggleThumb,
                        showBirthdate && styles.toggleThumbActive,
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Subscription Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <TouchableOpacity
            style={styles.settingCard}
            onPress={() => navigation.navigate('Plans')}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Icon name="star-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Subscription Plans</Text>
              <Text style={styles.settingSubtitle}>
                View available premium plans
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={showEditModal}
        initialValues={{
          displayName: userData.displayName || '',
          bio: userData.bio || '',
          birthdate: userData.birthdate 
            ? new Date(userData.birthdate) 
            : (() => {
                // Default: 18 años atrás
                const date = new Date();
                date.setFullYear(date.getFullYear() - 18);
                return date;
              })(),
        }}
        onSave={handleEditProfile}
        onClose={() => setShowEditModal(false)}
      />

      <SelectModal
        visible={showLanguageModal}
        title="Select Language"
        options={LANGUAGES}
        selectedValue={language || ''}
        onSelect={handleLanguageSelect}
        onClose={() => setShowLanguageModal(false)}
      />

      <SelectModal
        visible={showRegionModal}
        title="Select Region"
        options={COUNTRIES}
        selectedValue={region || ''}
        onSelect={handleRegionSelect}
        onClose={() => setShowRegionModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  settingSubtitlePlaceholder: {
    fontStyle: 'italic',
    opacity: 0.6,
  },
  privacyOptions: {
    marginTop: 12,
    gap: 12,
  },
  privacyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  privacyLabel: {
    fontSize: 14,
    color: COLORS.text,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.text,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.background,
  },
  bottomPadding: {
    height: 32,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.background,
  },
});
