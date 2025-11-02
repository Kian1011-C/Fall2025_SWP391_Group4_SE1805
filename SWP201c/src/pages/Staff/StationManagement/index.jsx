import React, { useState } from 'react';
import { useStationsDrilldown } from './hooks/useStationDrilldown';
import StationListView from './components/StationListView';
import TowerListView from './components/TowerListView';
import SlotGridView from './components/SlotGridView';
import LoadingFallback from '../../../components/common/LoadingFallback';
import '../../../assets/css/StationManagement.css';

const Header = ({ title, onBack, icon }) => (
  <div className="station-header">
    <div className="station-header-left">
      {onBack && (
        <button onClick={onBack} className="station-back-btn">
          <span>←</span>
          <span>Quay lại</span>
        </button>
      )}
      <h1 className="station-title">
        {icon && <span className="station-title-icon">{icon}</span>}
        <span>{title}</span>
      </h1>
    </div>
  </div>
);

const StaffStationManagement = () => {
  const [view, setView] = useState('stations');
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedTower, setSelectedTower] = useState(null);

  const {
    stations, towers, slots,
    isLoading, error,
    fetchTowers, fetchSlots,
  } = useStationsDrilldown();

  const handleSelectStation = (station) => {
    setSelectedStation(station);
    fetchTowers(station.id);
    setView('towers');
  };

  const handleSelectTower = (tower) => {
    setSelectedTower(tower);
    fetchSlots(tower.id || tower.towerId);
    setView('slots');
  };

  const handleBack = () => {
    if (view === 'slots') {
      setView('towers');
      setSelectedTower(null);
    } else if (view === 'towers') {
      setView('stations');
      setSelectedStation(null);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="station-loading">
          <div className="station-loading-spinner"></div>
          <div className="station-loading-text">Đang tải dữ liệu...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="station-error">
          <span className="station-error-icon">⚠️</span>
          <span>Lỗi: {error}</span>
        </div>
      );
    }

    if (view === 'slots') {
      return <SlotGridView slots={slots} />;
    }
    if (view === 'towers') {
      return <TowerListView towers={towers} onSelectTower={handleSelectTower} />;
    }
    return <StationListView stations={stations} onSelectStation={handleSelectStation} />;
  };

  const getTitle = () => {
    if (view === 'slots') return `${selectedStation?.name} - Trụ ${selectedTower?.towerNumber}`;
    if (view === 'towers') return `Chi tiết Trạm: ${selectedStation?.name}`;
    return 'Quản lý Trạm';
  };

  const getIcon = () => {
    if (view === 'slots') return '🔋';
    if (view === 'towers') return '🏗️';
    return '🏢';
  };

  const getBackButtonHandler = () => {
    if (view === 'slots' || view === 'towers') return handleBack;
    return null;
  };

  return (
    <div className="station-management-container fade-in">
      <Header 
        title={getTitle()} 
        onBack={getBackButtonHandler()} 
        icon={getIcon()}
      />
      {renderContent()}
    </div>
  );
};

export default StaffStationManagement;