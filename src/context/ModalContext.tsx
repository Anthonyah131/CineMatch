import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CustomModal } from '../components/ui/modals/CustomModal';
import type { ModalConfig, ModalContextValue } from '../types/modal.types';

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [visible, setVisible] = useState(false);

  const showModal = (config: ModalConfig) => {
    setModalConfig(config);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setTimeout(() => setModalConfig(null), 300);
  };

  // Helper: Success modal
  const showSuccess = (
    title: string,
    message?: string,
    onClose?: () => void,
  ) => {
    showModal({
      type: 'success',
      title,
      message,
      actions: [
        {
          text: 'OK',
          style: 'primary',
          onPress: () => {
            if (onClose) onClose();
          },
        },
      ],
    });
  };

  // Helper: Error modal
  const showError = (title: string, message?: string) => {
    showModal({
      type: 'error',
      title,
      message,
      actions: [
        {
          text: 'Cerrar',
          style: 'default',
          onPress: () => {},
        },
      ],
    });
  };

  // Helper: Warning modal
  const showWarning = (
    title: string,
    message?: string,
    onConfirm?: () => void,
  ) => {
    showModal({
      type: 'warning',
      title,
      message,
      actions: [
        {
          text: 'Cancelar',
          style: 'default',
          onPress: () => {},
        },
        {
          text: 'Continuar',
          style: 'primary',
          onPress: () => {
            if (onConfirm) onConfirm();
          },
        },
      ],
    });
  };

  // Helper: Confirm modal
  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
  ) => {
    showModal({
      type: 'confirm',
      title,
      message,
      actions: [
        {
          text: 'Cancelar',
          style: 'default',
          onPress: () => {
            if (onCancel) onCancel();
          },
        },
        {
          text: 'Confirmar',
          style: 'primary',
          onPress: onConfirm,
        },
      ],
    });
  };

  const value: ModalContextValue = {
    showModal,
    hideModal,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      <CustomModal visible={visible} config={modalConfig} onClose={hideModal} />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
