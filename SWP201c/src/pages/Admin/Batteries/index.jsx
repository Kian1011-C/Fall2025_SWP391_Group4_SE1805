import React, { useState } from 'react';
import { useBatteriesData } from './hooks/useBatteriesData';
import BatteryRow from './components/BatteryRow';
import BatteryFormModal from './components/BatteryFormModal';

const AdminBatteries = () => {
  const { batteries, isLoading, error, refetch, filterStatus, setFilterStatus, searchQuery, setSearchQuery, handleCreate, handleUpdate } = useBatteriesData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBattery, setEditingBattery] = useState(null);

  const handleOpenCreateModal = () => {
    setEditingBattery(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (battery) => {
    setEditingBattery(battery);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBattery(null);
  };

  const handleSave = async (formData, batteryId) => {
    let response;
    if (batteryId) {
      // Đây là trường hợp Cập nhật (Update)
      response = await handleUpdate(batteryId, formData);
    } else {
      // Đây là trường hợp Tạo mới (Create)
      response = await handleCreate(formData);
    }
    
    if (response.success) {
      handleCloseModal();
      // showToast('Thành công!', 'success'); // Bạn có thể thêm hàm toast
    } else {
      // showErrorToast(response.message); // Hiển thị lỗi
      console.error("Lỗi khi lưu:", response.message);
    }
  };

  const renderContent = () => {
    if (isLoading) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Đang tải danh sách pin...</p>;
    if (error) return ( <div style={{ color: '#ef4444', textAlign: 'center' }}><p>Lỗi: {error}</p><button onClick={refetch}>Thử lại</button></div> );
    if (batteries.length === 0) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Không tìm thấy viên pin nào.</p>;

    return (
      <div style={{ background: '#1f2937', borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#374151' }}>
              <th style={{ padding: '15px 20px' }}>Mã Pin</th>
              <th style={{ padding: '15px 20px' }}>Mẫu Pin</th>
              <th style={{ padding: '15px 20px' }}>Trạng thái</th>
              <th style={{ padding: '15px 20px' }}>Sức khỏe (%)</th>
              <th style={{ padding: '15px 20px' }}>Chu kỳ sạc</th>
              <th style={{ padding: '15px 20px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {batteries.map(bat => <BatteryRow key={bat.batteryId} battery={bat} onEdit={handleOpenEditModal} />)}
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
            <h1 style={{ margin: 0, fontSize: '28px' }}>Quản lý Pin</h1>
            <p style={{ margin: '5px 0 0 0', color: '#9ca3af' }}>Thêm, sửa và theo dõi tất cả các viên pin trong hệ thống.</p>
          </div>
          <button onClick={handleOpenCreateModal} style={{ background: '#f59e0b', color: '#111827', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Thêm Pin Mới
          </button>
        </div>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="Tìm theo Mã pin hoặc Mẫu pin..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, background: '#374151', color: 'white', border: '1px solid #4b5563', padding: '10px', borderRadius: '8px' }}
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ background: '#374151', color: 'white', border: '1px solid #4b5563', padding: '10px', borderRadius: '8px' }}>
            <option value="">Tất cả trạng thái</option>
            <option value="AVAILABLE">Sẵn sàng</option>
            <option value="CHARGING">Đang sạc</option>
            <option value="MAINTENANCE">Bảo trì</option>
          </select>
        </div>
        {renderContent()}
      </div>
      <BatteryFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        battery={editingBattery}
      />
    </>
  );
};

export default AdminBatteries;