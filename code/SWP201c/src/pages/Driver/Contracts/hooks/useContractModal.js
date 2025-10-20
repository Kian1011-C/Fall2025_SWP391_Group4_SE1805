// Driver/Contracts/hooks/useContractModal.js
// Hook for managing contract detail modal state

import { useState, useCallback } from 'react';

export const useContractModal = () => {
  const [selectedContract, setSelectedContract] = useState(null);

  const openModal = useCallback((contract) => {
    setSelectedContract(contract);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedContract(null);
  }, []);

  const isOpen = selectedContract !== null;

  return {
    selectedContract,
    isOpen,
    openModal,
    closeModal
  };
};
