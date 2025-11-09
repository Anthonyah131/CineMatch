import { useCallback } from 'react';
import { useModal } from '../../context/ModalContext';
import { useLoading } from '../../context/LoadingContext';

interface UseSettingsActionsProps {
  updateProfile: (data: any) => Promise<void>;
  currentSettings: {
    language?: string;
    region?: string;
    privacy?: {
      showEmail?: boolean;
      showBirthdate?: boolean;
    };
  };
  onLanguageChange: (language: string) => void;
  onRegionChange: (region: string) => void;
  onPrivacyChange: (field: 'email' | 'birthdate', value: boolean) => void;
}

export function useSettingsActions({
  updateProfile,
  currentSettings,
  onLanguageChange,
  onRegionChange,
  onPrivacyChange,
}: UseSettingsActionsProps) {
  const { showConfirm, showSuccess, showError } = useModal();
  const { showLoading, hideLoading } = useLoading();

  const handleLanguageChange = useCallback(
    (newLanguage: string, languageName: string) => {
      showConfirm(
        'Change Language',
        `Change language to ${languageName}?`,
        async () => {
          try {
            showLoading('Updating language...');
            // Enviar settings completo para no borrar otros campos
            await updateProfile({ 
              settings: {
                ...currentSettings,
                language: newLanguage,
              }
            });
            hideLoading();
            onLanguageChange(newLanguage);
            showSuccess('Success', 'Language updated successfully');
          } catch (err) {
            hideLoading();
            showError('Error', 'Failed to update language');
          }
        }
      );
    },
    [updateProfile, currentSettings, onLanguageChange, showConfirm, showSuccess, showError, showLoading, hideLoading]
  );

  const handleRegionChange = useCallback(
    (newRegion: string, regionName: string) => {
      showConfirm(
        'Change Region',
        `Change region to ${regionName}?`,
        async () => {
          try {
            showLoading('Updating region...');
            // Enviar settings completo para no borrar otros campos
            await updateProfile({ 
              settings: {
                ...currentSettings,
                region: newRegion,
              }
            });
            hideLoading();
            onRegionChange(newRegion);
            showSuccess('Success', 'Region updated successfully');
          } catch (err) {
            hideLoading();
            showError('Error', 'Failed to update region');
          }
        }
      );
    },
    [updateProfile, currentSettings, onRegionChange, showConfirm, showSuccess, showError, showLoading, hideLoading]
  );

  const handlePrivacyToggle = useCallback(
    (field: 'email' | 'birthdate', value: boolean) => {
      const fieldName = field === 'email' ? 'Email' : 'Birth Date';
      const action = value ? 'show' : 'hide';

      showConfirm(
        'Privacy Settings',
        `${action.charAt(0).toUpperCase() + action.slice(1)} ${fieldName}?`,
        async () => {
          try {
            showLoading('Updating privacy settings...');
            // Enviar settings completo para no borrar otros campos
            await updateProfile({
              settings: {
                ...currentSettings,
                privacy: {
                  ...currentSettings.privacy,
                  [field === 'email' ? 'showEmail' : 'showBirthdate']: value,
                },
              },
            });
            hideLoading();
            onPrivacyChange(field, value);
            showSuccess('Success', 'Privacy settings updated');
          } catch (err) {
            hideLoading();
            showError('Error', 'Failed to update privacy settings');
          }
        }
      );
    },
    [updateProfile, currentSettings, onPrivacyChange, showConfirm, showSuccess, showError, showLoading, hideLoading]
  );

  const handleSaveProfile = useCallback(
    async (values: { displayName: string; bio: string; birthdate: Date }) => {
      try {
        showLoading('Updating profile...');
        await updateProfile({
          displayName: values.displayName,
          bio: values.bio,
          birthdate: values.birthdate.toISOString(),
        });
        hideLoading();
        showSuccess('Success', 'Profile updated successfully');
        return true;
      } catch (err) {
        hideLoading();
        showError('Error', 'Failed to update profile. Please try again.');
        return false;
      }
    },
    [updateProfile, showSuccess, showError, showLoading, hideLoading]
  );

  return {
    handleLanguageChange,
    handleRegionChange,
    handlePrivacyToggle,
    handleSaveProfile,
  };
}
