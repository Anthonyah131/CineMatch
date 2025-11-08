/**
 * Types para el sistema de modales
 */

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface ModalAction {
  text: string;
  onPress: () => void;
  style?: 'default' | 'destructive' | 'primary';
}

export interface ModalConfig {
  type: ModalType;
  title: string;
  message?: string;
  actions?: ModalAction[];
  dismissable?: boolean;
}

export interface ModalContextValue {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
  
  // Helpers para casos comunes
  showSuccess: (title: string, message?: string, onClose?: () => void) => void;
  showError: (title: string, message?: string) => void;
  showWarning: (title: string, message?: string, onConfirm?: () => void) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
}
