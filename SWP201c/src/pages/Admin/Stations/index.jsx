import React, { useState } from 'react';
import { useStationsData } from './hooks/useStationsData';
import StationRow from './components/StationRow';
import StationFormModal from './components/StationFormModal';

const AdminStations = () => {
  const { stations, isLoading, error, refetch, filterStatus, setFilterStatus, searchQuery, setSearchQuery, handleCreate, handleUpdate } = useStationsData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);

  const handleOpenCreateModal = () => {
    setEditingStation(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (station) => {
    setEditingStation(station);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStation(null);
  };

  const handleSave = async (formData, stationId) => {
    let response;
    if (stationId) {
      response = await handleUpdate(stationId, formData);
    } else {
      response = await handleCreate(formData);
    }
    if (response.success) {
      handleCloseModal();
    } else {
      alert(response.message); // Hiển thị lỗi
    }
  };

  const renderContent = () => {
    if (isLoading) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Đang tải danh sách trạm...</p>;
    if (error) return ( <div style={{ color: '#ef4444', textAlign: 'center' }}><p>Lỗi: {error}</p><button onClick={refetch}>Thử lại</button></div> );
    if (stations.length === 0) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Không tìm thấy trạm nào.</p>;

    return (
      <div style={{ background: '#1f2937', borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#374151' }}>
              <th style={{ padding: '15px 20px' }}>ID</th>
              <th style={{ padding: '15px 20px' }}>Tên Trạm</th>
              <th style={{ padding: '15px 20px' }}>Địa chỉ</th>
              <th style={{ padding: '15px 20px' }}>Trạng thái</th>
              <th style={{ padding: '15px 20px' }}>Tổng hộc</th>
              <th style={{ padding: '15px 20px' }}>Pin sẵn sàng</th>
              <th style={{ padding: '15px 20px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {stations.map(station => <StationRow key={station.id} station={station} onEdit={handleOpenEditModal} />)}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px' }}>Quản lý Trạm</h1>
            <p style={{ margin: '5px 0 0 0', color: '#9ca3af' }}>Thêm, sửa và theo dõi tất cả các trạm trong hệ thống.</p>
          </div>
          <button onClick={handleOpenCreateModal} style={{ background: '#f59e0b', color: '#111827', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Thêm Trạm Mới
          </button>
        </div>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Tìm theo tên hoặc địa chỉ..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, background: '#374151', color: 'white', border: '1px solid #4b5563', padding: '10px', borderRadius: '8px' }}
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ background: '#374151', color: 'white', border: '1px solid #4b5563', padding: '10px', borderRadius: '8px' }}>
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="maintenance">Bảo trì</option>
            <option value="offline">Ngoại tuyến</option>
          </select>
        </div>
        {renderContent()}
      </div>
      <StationFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        station={editingStation}
      />
    </>
  );
};

export default AdminStations;