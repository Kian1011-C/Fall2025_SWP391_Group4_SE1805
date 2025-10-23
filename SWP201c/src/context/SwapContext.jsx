// Swap Context - Quản lý battery swap process
import React, { createContext, useContext, useState } from 'react';

const SwapContext = createContext();

export const useSwap = () => {
  const context = useContext(SwapContext);
  if (!context) {
    throw new Error('useSwap must be used within SwapProvider');
  }
  return context;
};

export const SwapProvider = ({ children }) => {
  // Swap Process States
  const [swapStep, setSwapStep] = useState(1);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedPole, setSelectedPole] = useState(null);
  const [selectedPickupSlot, setSelectedPickupSlot] = useState(null);
  const [selectedReturnSlot, setSelectedReturnSlot] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: 10.7769, lng: 106.7009 });

  // Swap Requests
  const [swapRequests, setSwapRequests] = useState([]);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedSwapRequest, setSelectedSwapRequest] = useState(null);

  // Pending Swaps (for Staff)
  const [pendingSwapRequests, setPendingSwapRequests] = useState([]);
  const [showSwapConfirmModal, setShowSwapConfirmModal] = useState(false);
  const [selectedSwapConfirm, setSelectedSwapConfirm] = useState(null);

  const value = {
    swapStep,
    setSwapStep,
    selectedStation,
    setSelectedStation,
    selectedPole,
    setSelectedPole,
    selectedPickupSlot,
    setSelectedPickupSlot,
    selectedReturnSlot,
    setSelectedReturnSlot,
    userLocation,
    setUserLocation,
    swapRequests,
    setSwapRequests,
    showSwapModal,
    setShowSwapModal,
    selectedSwapRequest,
    setSelectedSwapRequest,
    pendingSwapRequests,
    setPendingSwapRequests,
    showSwapConfirmModal,
    setShowSwapConfirmModal,
    selectedSwapConfirm,
    setSelectedSwapConfirm,
  };

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
};

