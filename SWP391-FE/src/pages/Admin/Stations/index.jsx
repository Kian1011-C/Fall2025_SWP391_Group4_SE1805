import React, { useState } from 'react';
import { useStationsDrilldown } from './hooks/useStationsDrilldown';
import StationListView from './components/StationListView';
import TowerListView from './components/TowerListView';
import SlotGridView from './components/SlotGridView';
import StationFormModal from './components/StationFormModal';
import TowerFormModal from './components/TowerFormModal';
import AssignBatteryModal from './components/AssignBatteryModal';
import RemoveBatteryModal from './components/RemoveBatteryModal';
import LoadingFallback from '../../../components/common/LoadingFallback';
import stationService from '../../../assets/js/services/stationService';
import batteryService from '../../../assets/js/services/batteryService';
import '../../../assets/css/StationManagement.css';

const Header = ({ title, onBack, onRefresh, icon, onAdd, onAssignBattery, onRemoveBattery }) => (
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
      {onAdd && (
        <button onClick={onAdd.action} className="station-add-btn" title={onAdd.title}>
          <span></span>
          <span>{onAdd.text}</span>
        </button>
      )}
      {onAssignBattery && (
        <button onClick={onAssignBattery} className="station-add-btn" style={{ background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }} title="Thêm pin vào hộc">
          <span></span>
          <span>Thêm Pin vào Hộc</span>
        </button>
      )}
      {onRemoveBattery && (
        <button onClick={onRemoveBattery} className="station-add-btn" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)' }} title="Tháo pin khỏi hộc">
          <span></span>
          <span>Tháo Pin</span>
        </button>
      )}
      {onRefresh && (
        <button onClick={onRefresh} className="station-refresh-btn" title="Làm mới">
          <span></span>
          <span>Làm mới</span>
        </button>
      )}
    </div>
  </div>
);

const AdminStations = () => {
  const [view, setView] = useState('stations');
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedTower, setSelectedTower] = useState(null);
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);
  const [isTowerModalOpen, setIsTowerModalOpen] = useState(false);
  const [isAssignBatteryModalOpen, setIsAssignBatteryModalOpen] = useState(false);
  const [isRemoveBatteryModalOpen, setIsRemoveBatteryModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);

  const {
    stations, towers, slots,
    isLoading, error,
    fetchStations, fetchTowers, fetchSlots,
  } = useStationsDrilldown();

  const handleSelectStation = (station) => {
    setSelectedStation(station);
    fetchTowers(station.id || station.stationId);
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
      fetchTowers(selectedStation.id || selectedStation.stationId);
    } else {
      fetchStations();
    }
  };

  const handleAddStation = () => {
    setEditingStation(null);
    setIsStationModalOpen(true);
  };

  const handleEditStation = (station) => {
    setEditingStation(station);
    setIsStationModalOpen(true);
  };

  const handleAddTower = () => {
    setEditingStation(null); // Clear editing station for new tower
    setIsTowerModalOpen(true);
  };

  const handleEditTower = (tower) => {
    setEditingStation(tower); // Reuse editingStation state for tower
    setIsTowerModalOpen(true);
  };

  const handleDeleteTower = async (towerId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa trụ này không?\nLưu ý: Tất cả pin trong trụ sẽ bị xóa!')) {
      return;
    }

    try {
      console.log(' Deleting tower:', towerId);
      const response = await stationService.deleteTower(towerId);
      console.log('Delete tower response:', response);
      
      if (response.success) {
        alert('Xóa trụ thành công!');
        fetchTowers(selectedStation.id || selectedStation.stationId);
      } else {
        alert(`Lỗi: ${response.message}`);
      }
    } catch (error) {
      console.error('Delete tower error:', error);
      alert(`Lỗi khi xóa trụ: ${error.message}`);
    }
  };

  const handleAddBatteryToSlot = (slot) => {
    // TODO: Implement thêm pin vào slot
    console.log(' Add battery to slot:', slot);
    alert(`Chức năng thêm pin vào Hộc ${slot.slotNumber} đang được phát triển!\n\nSlot ID: ${slot.slotId || slot.id}\nTower: ${selectedTower?.towerNumber}\nStation: ${selectedStation?.name}`);
    // Sau này sẽ mở modal để chọn pin từ danh sách pin có sẵn
  };

  const handleSaveTower = async (formData, towerId) => {
    try {
      if (towerId) {
        // Edit existing tower - only update status
        console.log(' Updating tower:', { towerId, formData });
        const response = await stationService.updateTower(towerId, formData.status);
        
        console.log('Update tower response:', response);

        if (response.success) {
          alert(response.message || 'Cập nhật trụ thành công!');
          setIsTowerModalOpen(false);
          setEditingStation(null);
          fetchTowers(selectedStation.id || selectedStation.stationId);
        } else {
          alert(`Lỗi: ${response.message}`);
        }
      } else {
        // Create new tower
        console.log(' Creating tower:', { formData });
        const stationId = selectedStation.stationId || selectedStation.id;
        const response = await stationService.addTowerToStation(
          stationId, 
          formData.numberOfSlots,
          formData.status // Truyền status vào
        );
        
        console.log('Create tower response:', response);

        if (response.success) {
          alert(response.message || 'Tạo trụ thành công!');
          setIsTowerModalOpen(false);
          fetchTowers(selectedStation.id || selectedStation.stationId);
        } else {
          alert(`Lỗi: ${response.message}`);
        }
      }
    } catch (error) {
      console.error('Save tower error:', error);
      alert(`Lỗi khi lưu trụ: ${error.message}`);
    }
  };

  const handleDeleteStation = async (stationId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa trạm này không?')) {
      return;
    }

    try {
      console.log(' Deleting station:', stationId);
      const response = await stationService.deleteStation(stationId);
      console.log('Delete response:', response);
      
      if (response.success) {
        alert('Xóa trạm thành công!');
        fetchStations();
      } else {
        alert(`Lỗi: ${response.message}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Lỗi khi xóa trạm: ${error.message}`);
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
        // Refresh slots to show updated data
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
        // Refresh slots to show updated data
        fetchSlots(selectedTower.id || selectedTower.towerId);
      } else {
        alert(`Lỗi: ${response.message}`);
      }
    } catch (error) {
      console.error('Remove battery error:', error);
      alert(`Lỗi khi tháo pin khỏi hộc: ${error.message}`);
    }
  };

  const handleSaveStation = async (formData, stationId) => {
    try {
      console.log(' Saving station:', { formData, stationId });
      let response;
      if (stationId) {
        // Update existing station
        console.log('Updating station...');
        response = await stationService.updateStation(stationId, formData);
      } else {
        // Create new station
        console.log('Creating new station...');
        response = await stationService.createStation(formData);
      }
      
      console.log('Save response:', response);

      if (response.success) {
        alert(response.message || 'Lưu trạm thành công!');
        setIsStationModalOpen(false);
        setEditingStation(null);
        fetchStations();
      } else {
        alert(`Lỗi: ${response.message}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(`Lỗi khi lưu trạm: ${error.message}`);
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
      return <SlotGridView slots={slots} onAddBattery={handleAddBatteryToSlot} />;
    }
    if (view === 'towers') {
      return (
        <TowerListView 
          towers={towers} 
          onSelectTower={handleSelectTower}
          onEditTower={handleEditTower}
          onDeleteTower={handleDeleteTower}
        />
      );
    }
    return (
      <StationListView 
        stations={stations} 
        onSelectStation={handleSelectStation}
        onEditStation={handleEditStation}
      />
    );
  };

  const getTitle = () => {
    if (view === 'slots') return `${selectedStation?.name} - Trụ ${selectedTower?.towerNumber}`;
    if (view === 'towers') return `Chi tiết Trạm: ${selectedStation?.name}`;
    return 'Quản lý Trạm';
  };

  const getIcon = () => {
    if (view === 'slots') return '';
    if (view === 'towers') return '';
    return '';
  };

  const getAddButton = () => {
    if (view === 'stations') {
      return { text: 'Thêm Trạm', title: 'Thêm trạm mới', action: handleAddStation };
    }
    if (view === 'towers') {
      return { text: 'Thêm Trụ', title: 'Thêm trụ mới', action: handleAddTower };
    }
    return null;
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
        onRefresh={handleRefresh}
        onAdd={getAddButton()}
        onAssignBattery={view === 'slots' ? handleOpenAssignBatteryModal : null}
        onRemoveBattery={view === 'slots' ? handleOpenRemoveBatteryModal : null}
        icon={getIcon()}
      />
      {renderContent()}
      
      <StationFormModal
        isOpen={isStationModalOpen}
        onClose={() => {
          setIsStationModalOpen(false);
          setEditingStation(null);
        }}
        onSave={handleSaveStation}
        station={editingStation}
      />

      <TowerFormModal
        isOpen={isTowerModalOpen}
        onClose={() => {
          setIsTowerModalOpen(false);
          setEditingStation(null);
        }}
        onSave={handleSaveTower}
        tower={editingStation}
        stationName={selectedStation?.stationName || selectedStation?.name}
      />

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

export default AdminStations;