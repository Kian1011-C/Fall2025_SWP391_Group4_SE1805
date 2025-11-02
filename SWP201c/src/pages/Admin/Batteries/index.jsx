import React, { useState, useMemo } from 'react';
import { useBatteriesData } from './hooks/useBatteriesData';
import BatteryRow from './components/BatteryRow';
import BatteryFormModal from './components/BatteryFormModal';
import '../../../assets/css/AdminBatteryManagement.css';

const AdminBatteries = () => {
  const { batteries, isLoading, error, refetch, filterStatus, setFilterStatus, searchQuery, setSearchQuery, handleCreate, handleUpdate, handleDelete } = useBatteriesData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBattery, setEditingBattery] = useState(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = batteries.length;
    const available = batteries.filter(b => b.status?.toLowerCase() === 'available' || b.status?.toLowerCase() === 'in_stock').length;
    const charging = batteries.filter(b => b.status?.toLowerCase() === 'charging').length;
    const maintenance = batteries.filter(b => b.status?.toLowerCase() === 'maintenance').length;
    const avgHealth = batteries.length > 0 
      ? (batteries.reduce((sum, b) => sum + (b.healthStatus || 0), 0) / batteries.length).toFixed(1)
      : 0;
    
    return { total, available, charging, maintenance, avgHealth };
  }, [batteries]);

  const handleOpenCreateModal = () => {
    console.log('🟢 AdminBatteries: Opening CREATE modal');
    setEditingBattery(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (battery) => {
    console.log('🟢 AdminBatteries: Opening EDIT modal for battery:', battery);
    setEditingBattery(battery);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('🟢 AdminBatteries: Closing modal');
    setIsModalOpen(false);
    setEditingBattery(null);
  };

  const handleSave = async (formData, batteryId) => {
    console.log('🟢 AdminBatteries: handleSave called');
    console.log('  ├─ batteryId:', batteryId);
    console.log('  └─ formData:', formData);
    
    let response;
    if (batteryId) {
      console.log('🔄 Calling handleUpdate...');
      response = await handleUpdate(batteryId, formData);
    } else {
      console.log('➕ Calling handleCreate...');
      response = await handleCreate(formData);
    }
    
    console.log('📬 Response:', response);
    
    if (response.success) {
      handleCloseModal();
      alert('✅ ' + response.message);
    } else {
      alert('❌ Lỗi: ' + response.message);
      console.error("Lỗi khi lưu:", response.message);
    }
  };

  const handleDeleteBattery = async (battery) => {
    const confirmed = window.confirm(
      `⚠️ Bạn có chắc chắn muốn xóa pin BAT${battery.batteryId} (${battery.model})?\n\nHành động này không thể hoàn tác!`
    );
    
    if (!confirmed) return;

    const response = await handleDelete(battery.batteryId);
    if (response.success) {
      alert('✅ ' + response.message);
    } else {
      alert('❌ Lỗi: ' + response.message);
      console.error("Lỗi khi xóa:", response.message);
    }
  };

  // Render Loading State
  if (isLoading) {
    return (
      <div className="admin-battery-container">
        <div className="admin-battery-loading">
          <div className="admin-battery-spinner"></div>
          <div className="admin-battery-loading-text">Đang tải dữ liệu pin...</div>
        </div>
      </div>
    );
  }

  // Render Error State
  if (error) {
    return (
      <div className="admin-battery-container">
        <div className="admin-battery-error">
          <div className="admin-battery-error-icon">⚠️</div>
          <h3 className="admin-battery-error-title">Lỗi tải dữ liệu</h3>
          <p className="admin-battery-error-message">{error}</p>
          <button onClick={refetch} className="admin-battery-error-btn">
            🔄 Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Render Empty State
  if (batteries.length === 0) {
    return (
      <div className="admin-battery-container">
        <div className="admin-battery-header">
          <div className="admin-battery-header-content">
            <h1>⚡ Quản lý Pin</h1>
            <p>Thêm, sửa và theo dõi tất cả các viên pin trong hệ thống</p>
          </div>
          <button onClick={handleOpenCreateModal} className="admin-battery-add-btn">
            <span>➕</span> Thêm Pin Mới
          </button>
        </div>
        
        <div className="admin-battery-empty">
          <div className="admin-battery-empty-icon">🔋</div>
          <h3 className="admin-battery-empty-title">Chưa có pin nào</h3>
          <p className="admin-battery-empty-message">
            Hãy thêm pin đầu tiên vào hệ thống bằng cách nhấn nút "Thêm Pin Mới"
          </p>
        </div>

        <BatteryFormModal 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          battery={editingBattery}
        />
      </div>
    );
  }

  return (
    <div className="admin-battery-container">
      {/* Header */}
      <div className="admin-battery-header">
        <div className="admin-battery-header-content">
          <h1>⚡ Quản lý Pin</h1>
          <p>Thêm, sửa và theo dõi tất cả các viên pin trong hệ thống</p>
        </div>
        <button onClick={handleOpenCreateModal} className="admin-battery-add-btn">
          <span>➕</span> Thêm Pin Mới
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="admin-battery-stats">
        <div className="admin-battery-stat-card">
          <div className="admin-battery-stat-icon">🔋</div>
          <div className="admin-battery-stat-content">
            <span className="admin-battery-stat-label">Tổng số pin</span>
            <h2 className="admin-battery-stat-value">{stats.total}</h2>
          </div>
        </div>

        <div className="admin-battery-stat-card">
          <div className="admin-battery-stat-icon">✅</div>
          <div className="admin-battery-stat-content">
            <span className="admin-battery-stat-label">Sẵn sàng</span>
            <h2 className="admin-battery-stat-value">{stats.available}</h2>
          </div>
        </div>

        <div className="admin-battery-stat-card">
          <div className="admin-battery-stat-icon">⚡</div>
          <div className="admin-battery-stat-content">
            <span className="admin-battery-stat-label">Đang sạc</span>
            <h2 className="admin-battery-stat-value">{stats.charging}</h2>
          </div>
        </div>

        <div className="admin-battery-stat-card">
          <div className="admin-battery-stat-icon">🔧</div>
          <div className="admin-battery-stat-content">
            <span className="admin-battery-stat-label">Bảo trì</span>
            <h2 className="admin-battery-stat-value">{stats.maintenance}</h2>
          </div>
        </div>

        <div className="admin-battery-stat-card">
          <div className="admin-battery-stat-icon">❤️</div>
          <div className="admin-battery-stat-content">
            <span className="admin-battery-stat-label">Sức khỏe TB</span>
            <h2 className="admin-battery-stat-value">{stats.avgHealth}%</h2>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-battery-filters">
        <div className="admin-battery-filter-row">
          <input 
            type="text" 
            placeholder="🔍 Tìm theo Mã pin hoặc Mẫu pin..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-battery-search"
          />
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="admin-battery-filter-select"
          >
            <option value="">📊 Tất cả trạng thái</option>
            <option value="available">✅ Sẵn sàng</option>
            <option value="in_stock">✅ Trong kho</option>
            <option value="charging">⚡ Đang sạc</option>
            <option value="maintenance">🔧 Bảo trì</option>
            <option value="in_use">🚗 Đang sử dụng</option>
          </select>

          <button onClick={refetch} className="admin-battery-refresh-btn">
            <span>🔄</span> Làm mới
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="admin-battery-table-container">
        <table className="admin-battery-table">
          <thead>
            <tr>
              <th>Mã Pin</th>
              <th>Mẫu Pin</th>
              <th>Trạng thái</th>
              <th>Sức khỏe</th>
              <th>Chu kỳ sạc</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {batteries.map(bat => (
              <BatteryRow 
                key={bat.batteryId} 
                battery={bat} 
                onEdit={handleOpenEditModal} 
                onDelete={handleDeleteBattery} 
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <BatteryFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        battery={editingBattery}
      />
    </div>
  );
};

export default AdminBatteries;