import React, { useState, useMemo } from 'react';
import { useBatteriesData } from './hooks/useBatteriesData';
import BatteryRow from './components/BatteryRow';
import BatteryFormModal from './components/BatteryFormModal';
import BatteryDetailModal from './components/BatteryDetailModal';
import '../../../assets/css/AdminBatteryManagement.css';

const AdminBatteries = () => {
  const { batteries, isLoading, error, refetch, filterStatus, setFilterStatus, searchQuery, setSearchQuery, handleCreate, handleUpdate, handleDelete } = useBatteriesData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBattery, setEditingBattery] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = batteries.length;
    const available = batteries.filter(b => b.status?.toLowerCase() === 'available').length;
    const inStock = batteries.filter(b => b.status?.toLowerCase() === 'in_stock').length;
    const charging = batteries.filter(b => b.status?.toLowerCase() === 'charging').length;
    const maintenance = batteries.filter(b => b.status?.toLowerCase() === 'faulty' || b.status?.toLowerCase() === 'maintenance').length;
    const inUse = batteries.filter(b => b.status?.toLowerCase() === 'in_use').length;
    const avgHealth = batteries.length > 0 
      ? (batteries.reduce((sum, b) => sum + (b.stateOfHealth || 0), 0) / batteries.length).toFixed(1)
      : 0;
    const avgCycles = batteries.length > 0
      ? Math.round(batteries.reduce((sum, b) => sum + (b.cycleCount || 0), 0) / batteries.length)
      : 0;
    const totalCycles = batteries.reduce((sum, b) => sum + (b.cycleCount || 0), 0);
    
    return { total, available, inStock, charging, maintenance, inUse, avgHealth, avgCycles, totalCycles };
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

  const handleViewDetail = (battery) => {
    console.log('🟢 AdminBatteries: Opening detail modal for battery:', battery);
    setSelectedBattery(battery);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    console.log('🟢 AdminBatteries: Closing detail modal');
    setIsDetailModalOpen(false);
    setSelectedBattery(null);
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

// Pagination 8 per page (declare before any early returns)
const itemsPerPage = 8;
const [currentPage, setCurrentPage] = useState(1);
const totalPages = Math.max(1, Math.ceil((batteries || []).length / itemsPerPage));
const currentBatteries = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;
  return (batteries || []).slice(start, start + itemsPerPage);
}, [batteries, currentPage]);

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
          <div className="admin-battery-stat-icon">📦</div>
          <div className="admin-battery-stat-content">
            <span className="admin-battery-stat-label">Trong kho</span>
            <h2 className="admin-battery-stat-value">{stats.inStock}</h2>
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
          <div className="admin-battery-stat-icon">🚗</div>
          <div className="admin-battery-stat-content">
            <span className="admin-battery-stat-label">Đang sử dụng</span>
            <h2 className="admin-battery-stat-value">{stats.inUse}</h2>
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
            <option value="faulty">🔧 Bảo trì</option>
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
              <th>Dung lượng</th>
              <th>Chu kỳ sạc</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentBatteries.map(bat => (
              <BatteryRow 
                key={bat.batteryId} 
                battery={bat} 
                onEdit={handleOpenEditModal} 
                onDelete={handleDeleteBattery}
                onViewDetail={handleViewDetail}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {batteries.length > 0 && (
        <div className="pagination">
          <button
            className={`page-btn prev ${currentPage === 1 ? 'is-disabled' : ''}`}
            aria-disabled={currentPage === 1}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            «
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const page = idx + 1;
            const isActive = page === currentPage;
            return (
              <button
                key={page}
                className={`page-btn ${isActive ? 'is-active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}
          <button
            className={`page-btn next ${currentPage === totalPages ? 'is-disabled' : ''}`}
            aria-disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          >
            »
          </button>
        </div>
      )}

      {/* Modal */}
      <BatteryFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        battery={editingBattery}
      />

      {/* Detail Modal */}
      <BatteryDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        battery={selectedBattery}
      />
    </div>
  );
};

export default AdminBatteries;