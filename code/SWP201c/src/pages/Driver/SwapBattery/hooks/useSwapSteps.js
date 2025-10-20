// Custom Hook for managing swap steps and navigation
import { useState } from 'react';

export const useSwapSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedTower, setSelectedTower] = useState(null);
  const [selectedNewBatterySlot, setSelectedNewBatterySlot] = useState(null);
  const [selectedEmptySlot, setSelectedEmptySlot] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [swapResult, setSwapResult] = useState(null);

  const goToStep = (step) => {
    if (!isProcessing) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (!isProcessing) {
      setCurrentStep(prev => Math.min(prev + 1, 7));
    }
  };

  const prevStep = () => {
    if (!isProcessing) {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  const resetSelections = () => {
    setSelectedStation(null);
    setSelectedTower(null);
    setSelectedNewBatterySlot(null);
    setSelectedEmptySlot(null);
    setSwapResult(null);
    setCurrentStep(1);
  };

  return {
    // Current state
    currentStep,
    selectedStation,
    selectedTower,
    selectedNewBatterySlot,
    selectedEmptySlot,
    isProcessing,
    swapResult,
    
    // Setters
    setCurrentStep,
    setSelectedStation,
    setSelectedTower,
    setSelectedNewBatterySlot,
    setSelectedEmptySlot,
    setIsProcessing,
    setSwapResult,
    
    // Navigation
    goToStep,
    nextStep,
    prevStep,
    resetSelections
  };
};
