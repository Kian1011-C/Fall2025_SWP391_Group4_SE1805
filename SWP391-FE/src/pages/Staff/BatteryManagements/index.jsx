import React, { useState, useMemo } from 'react';
import { useBatteryStockData } from './hooks/useBatteryStockData';
import BatteryDetailModal from '../../Admin/Batteries/components/BatteryDetailModal';
import BatteryFormModal from '../../Admin/Batteries/components/BatteryFormModal';
import '../../../assets/css/AdminBatteryManagement.css';

const BatteryManagement = () => {
  const { batteries, isLoading, error, refetch, handleUpdate } = useBatteryStockData();
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [editingBattery, setEditingBattery] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

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

  // Filter batteries
  const filteredBatteries = useMemo(() => {
    return batteries.filter(bat => {
      const statusMatch = filterStatus ? 
        (bat.status?.toLowerCase() === filterStatus.toLowerCase()) : true;
      const searchMatch = searchQuery ? 
        (bat.batteryId.toString().includes(searchQuery) || 
         bat.model?.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      return statusMatch && searchMatch;
    });
  }, [batteries, filterStatus, searchQuery]);

  // Pagination
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(filteredBatteries.length / itemsPerPage));
  const currentBatteries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBatteries.slice(start, start + itemsPerPage);
  }, [filteredBatteries, currentPage]);

  const handleViewDetail = (battery) => {
    setSelectedBattery(battery);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedBattery(null);
  };

  const handleOpenEditModal = (battery) => {
    setEditingBattery(battery);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingBattery(null);
  };

  const handleSave = async (formData, batteryId) => {
    if (batteryId) {
      const response = await handleUpdate(batteryId, formData);
      if (response.success) {
        handleCloseEditModal();
        alert('✅ ' + response.message);
      } else {
        alert('❌ Lỗi: ' + response.message);
      }
    }
  };

  // Get health class
  const getHealthClass = (health) => {
    if (health >= 80) return 'high';
    if (health >= 50) return 'medium';
    return 'low';
  };

  // Format status
  const formatStatus = (status) => {
    const statusMap = {
      'available': 'available',
      'in_stock': 'in_stock',
      'charging': 'charging',
      'faulty': 'maintenance',
      'maintenance': 'maintenance',
      'in_use': 'in_use',
      'low': 'low'
    };
    return statusMap[status?.toLowerCase()] || status?.toLowerCase() || 'unknown';
  };

  const displayStatus = (status) => {
    const statusDisplay = {
      'available': 'Sẵn sàng',
      'in_stock': 'Trong kho',
      'charging': 'Đang sạc',
      'maintenance': 'Bảo trì',
      'in_use': 'Đang dùng',
      'low': 'Yếu'
    };
    return statusDisplay[formatStatus(status)] || status;
  };

  // Loading State
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

  // Error State
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

  // Empty State
  if (batteries.length === 0) {
    return (
      <div className="admin-battery-container">
        <div className="admin-battery-header">
          <div className="admin-battery-header-content">
            <h1>⚡ Quản lý Pin</h1>
            <p>Theo dõi tình trạng và kho pin trong hệ thống</p>
          </div>
        </div>
        
        <div className="admin-battery-empty">
          <div className="admin-battery-empty-icon">🔋</div>
          <h3 className="admin-battery-empty-title">Chưa có pin nào</h3>
          <p className="admin-battery-empty-message">
            Kho pin hiện đang trống
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-battery-container">
      {/* Header */}
      <div className="admin-battery-header">
        <div className="admin-battery-header-content">
          <h1>⚡ Quản lý Pin</h1>
          <p>Theo dõi tình trạng và kho pin trong hệ thống</p>
        </div>
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
            {currentBatteries.map(battery => (
              <tr key={battery.batteryId}>
                {/* Battery ID */}
                <td>
                  <div className="admin-battery-id">
                    <span className="admin-battery-id-icon">🔋</span>
                    <span className="admin-battery-id-text">BAT{battery.batteryId}</span>
                  </div>
                </td>

                {/* Model */}
                <td>
                  <span className="admin-battery-model">{battery.model}</span>
                </td>

                {/* Status */}
                <td>
                  <span className={`admin-battery-status ${formatStatus(battery.status)}`}>
                    {displayStatus(battery.status)}
                  </span>
                </td>

                {/* Health */}
                <td>
                  <div className="admin-battery-health">
                    <div className="admin-battery-health-bar">
                      <div 
                        className={`admin-battery-health-fill ${getHealthClass(battery.stateOfHealth)}`}
                        style={{ width: `${battery.stateOfHealth}%` }}
                      ></div>
                    </div>
                    <span className="admin-battery-health-text">{battery.stateOfHealth}%</span>
                  </div>
                </td>

                {/* Cycles */}
                <td>
                  <div className="admin-battery-cycles">
                    <span className="admin-battery-cycles-icon">🔄</span>
                    <div className="admin-battery-cycles-info">
                      <span className="admin-battery-cycles-text">{battery.cycleCount || 0}</span>
                      {battery.cycleCount > 2000 && (
                        <span className="admin-battery-cycles-warning" title="Pin đã qua nhiều chu kỳ sạc">⚠️</span>
                      )}
                      {battery.cycleCount > 2500 && (
                        <span className="admin-battery-cycles-critical" title="Nên thay pin sớm">🔴</span>
                      )}
                    </div>
                  </div>
                </td>

                {/* Actions - View Detail and Edit, No Delete */}
                <td>
                  <div className="admin-battery-actions">
                    <button 
                      onClick={() => handleViewDetail(battery)} 
                      className="admin-battery-action-btn view"
                      title="Xem chi tiết"
                    >
                       Chi tiết
                    </button>
                    <button 
                      onClick={() => handleOpenEditModal(battery)} 
                      className="admin-battery-action-btn edit"
                      title="Chỉnh sửa"
                    >
                       Sửa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredBatteries.length > 0 && (
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

      {/* Detail Modal */}
      <BatteryDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        battery={selectedBattery}
      />

      {/* Edit Modal */}
      <BatteryFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSave}
        battery={editingBattery}
      />
    </div>
  );
};

export default BatteryManagement;