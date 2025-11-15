import React, { useState } from 'react';
import { FiMapPin, FiPlus, FiMinus, FiRefreshCw, FiBattery } from 'react-icons/fi';
import { useStationsDrilldown } from './hooks/useStationDrilldown';
import StationListView from './components/StationListView';
import TowerListView from './components/TowerListView';
import SlotGridView from './components/SlotGridView';
import AssignBatteryModal from './components/AssignBatteryModal';
import RemoveBatteryModal from './components/RemoveBatteryModal';
import LoadingFallback from '../../../components/common/LoadingFallback';
import batteryService from '../../../assets/js/services/batteryService';
import '../../../assets/css/StationManagement.css';

const Header = ({ title, onBack, icon, onAssignBattery, onRemoveBattery, onRefresh }) => (
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
    <div className="station-actions">
      {onAssignBattery && (
        <button onClick={onAssignBattery} className="station-add-btn" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', display: 'flex', alignItems: 'center', gap: '8px' }} title="Thêm pin vào hộc">
          <FiPlus size={18} />
          <span>Thêm Pin vào Hộc</span>
        </button>
      )}
      {onRemoveBattery && (
        <button onClick={onRemoveBattery} className="station-add-btn" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)', display: 'flex', alignItems: 'center', gap: '8px' }} title="Tháo pin khỏi hộc">
          <FiMinus size={18} />
          <span>Tháo Pin</span>
        </button>
      )}
      {onRefresh && (
        <button onClick={onRefresh} className="station-refresh-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} title="Làm mới">
          <FiRefreshCw size={18} />
          <span>Làm mới</span>
        </button>
      )}
    </div>
  </div>
);

const StaffStationManagement = () => {
  const [view, setView] = useState('stations');
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedTower, setSelectedTower] = useState(null);
  const [isAssignBatteryModalOpen, setIsAssignBatteryModalOpen] = useState(false);
  const [isRemoveBatteryModalOpen, setIsRemoveBatteryModalOpen] = useState(false);

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

  const handleRefresh = () => {
    if (view === 'slots') {
      fetchSlots(selectedTower.id || selectedTower.towerId);
    } else if (view === 'towers') {
      fetchTowers(selectedStation.id);
    }
  };

  const handleOpenAssignBatteryModal = () => {
    setIsAssignBatteryModalOpen(true);
  };

  const handleAssignBattery = async (data) => {
    try {
      console.log(' Assigning battery to slot:', data);
      const response = await batteryService.assignBatteryToSlot(data.batteryId, data.slotId);
      console.log('Assign battery response:', response);
      
      if (response.success) {
        alert(response.message || 'Thêm pin vào hộc thành công!');
        setIsAssignBatteryModalOpen(false);
        fetchSlots(selectedTower.id || selectedTower.towerId);
      } else {
        alert(`Lỗi: ${response.message}`);
      }
    } catch (error) {
      console.error('Assign battery error:', error);
      alert(`Lỗi khi thêm pin vào hộc: ${error.message}`);
    }
  };

  const handleOpenRemoveBatteryModal = () => {
    setIsRemoveBatteryModalOpen(true);
  };

  const handleRemoveBattery = async (data) => {
    try {
      console.log(' Removing battery from slot:', data);
      const response = await batteryService.removeBatteryFromSlot(data.batteryId);
      console.log('Remove battery response:', response);
      
      if (response.success) {
        alert(response.message || 'Tháo pin khỏi hộc thành công!');
        setIsRemoveBatteryModalOpen(false);
        fetchSlots(selectedTower.id || selectedTower.towerId);
      } else {
        alert(`Lỗi: ${response.message}`);
      }
    } catch (error) {
      console.error('Remove battery error:', error);
      alert(`Lỗi khi tháo pin khỏi hộc: ${error.message}`);
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
          <span className="station-error-icon"></span>
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
    if (view === 'slots') return <FiBattery size={28} />;
    if (view === 'towers') return <FiMapPin size={28} />;
    return <FiMapPin size={28} />;
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
        onAssignBattery={view === 'slots' ? handleOpenAssignBatteryModal : null}
        onRemoveBattery={view === 'slots' ? handleOpenRemoveBatteryModal : null}
        onRefresh={view === 'slots' ? handleRefresh : null}
      />
      {renderContent()}

      <AssignBatteryModal
        isOpen={isAssignBatteryModalOpen}
        onClose={() => setIsAssignBatteryModalOpen(false)}
        onSave={handleAssignBattery}
        slots={slots}
        towerName={`Trụ ${selectedTower?.towerNumber}`}
        stationName={selectedStation?.name}
      />

      <RemoveBatteryModal
        isOpen={isRemoveBatteryModalOpen}
        onClose={() => setIsRemoveBatteryModalOpen(false)}
        onSave={handleRemoveBattery}
        slots={slots}
        towerName={`Trụ ${selectedTower?.towerNumber}`}
        stationName={selectedStation?.name}
      />
    </div>
  );
};

export default StaffStationManagement;