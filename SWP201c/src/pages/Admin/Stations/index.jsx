import React, { useState } from 'react';
import { useStationsDrilldown } from './hooks/useStationsDrilldown';
import StationListView from './components/StationListView';
import TowerListView from './components/TowerListView';
import SlotGridView from './components/SlotGridView';
import LoadingFallback from '../../../components/common/LoadingFallback';

// Component tiêu đề và nút "Quay lại"
const Header = ({ title, onBack }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
    {onBack && (
      <button 
        onClick={onBack} 
        style={{ background: '#374151', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}
      >
        ← Quay lại
      </button>
    )}
    <h1 style={{ margin: 0, fontSize: '28px', color: 'white' }}>{title}</h1>
  </div>
);

const AdminStations = () => {
  const [view, setView] = useState('stations'); // 'stations', 'towers', 'slots'
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedTower, setSelectedTower] = useState(null);

  const {
    stations, towers, slots,
    isLoading, error,
    fetchStations, fetchTowers, fetchSlots,
  } = useStationsDrilldown();

  const handleSelectStation = (station) => {
    setSelectedStation(station);
    fetchTowers(station.id);
    setView('towers');
  };

  const handleSelectTower = (tower) => {
    setSelectedTower(tower);
    fetchSlots(tower.id || tower.towerId); // Lấy đúng ID của trụ
    setView('slots');
  };

  const renderContent = () => {
    if (isLoading) return <LoadingFallback text="Đang tải dữ liệu..." />;
    if (error) return <p style={{ color: '#ef4444' }}>Lỗi: {error}</p>;

    if (view === 'slots') {
      return <SlotGridView slots={slots} />;
    }
    if (view === 'towers') {
      return <TowerListView towers={towers} onSelectTower={handleSelectTower} />;
    }
    // Mặc định là 'stations'
    return <StationListView stations={stations} onSelectStation={handleSelectStation} />;
  };

  const getTitle = () => {
    if (view === 'slots') return `Trạm ${selectedStation?.name} - Trụ ${selectedTower?.towerNumber}`;
    if (view === 'towers') return `Chi tiết Trạm: ${selectedStation?.name}`;
    return 'Quản lý Trạm';
  };

  const getBackButtonHandler = () => {
    if (view === 'slots') return () => setView('towers');
    if (view === 'towers') return () => setView('stations');
    return null;
  };

  return (
    <div>
      <Header title={getTitle()} onBack={getBackButtonHandler()} />
      {renderContent()}
    </div>
  );
};

export default AdminStations;