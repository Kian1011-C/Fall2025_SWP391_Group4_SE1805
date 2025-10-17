import React, { createContext, useContext, useState } from 'react';

const BatteryContext = createContext();

export const useBatteries = () => {
  const ctx = useContext(BatteryContext);
  if (!ctx) throw new Error('useBatteries must be used within BatteryProvider');
  return ctx;
};

export const BatteryProvider = ({ children }) => {
  const [batteries, setBatteries] = useState([]);
  const [batteryHistory, setBatteryHistory] = useState([]);
  const [batteryFilter, setBatteryFilter] = useState('all');
  const [showBatteryModal, setShowBatteryModal] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [batteryData, setBatteryData] = useState({ current: 25, health: 92, temperature: 28, voltage: 48.2, cycles: 156 });

  const updateBatteryStatus = (batteryId, newStatus, reason = '') => {
    setBatteries(prev => prev.map(b => (b.id === batteryId ? { ...b, status: newStatus } : b)));
    const battery = batteries.find(b => b.id === batteryId);
    if (battery) {
      const historyEntry = {
        id: batteryHistory.length + 1,
        batteryId,
        oldStatus: battery.status,
        newStatus,
        timestamp: new Date().toISOString(),
        reason
      };
      setBatteryHistory(prev => [historyEntry, ...prev]);
    }
  };

  const getBatteriesForStation = (stationId) => batteries.filter(b => b.stationId === stationId);
  const getFilteredBatteries = () => (batteryFilter === 'all' ? batteries : batteries.filter(b => b.status === batteryFilter));

  const value = {
    batteries, setBatteries,
    batteryHistory, setBatteryHistory,
    batteryFilter, setBatteryFilter,
    showBatteryModal, setShowBatteryModal,
    selectedBattery, setSelectedBattery,
    batteryData, setBatteryData,
    updateBatteryStatus,
    getBatteriesForStation,
    getFilteredBatteries
  };

  return <BatteryContext.Provider value={value}>{children}</BatteryContext.Provider>;
};


