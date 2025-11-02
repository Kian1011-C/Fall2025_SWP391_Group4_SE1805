import React, { useState, useMemo } from 'react';
import { useBatteryStockData } from '../hooks/useBatteryStockData';
import BatteryDetailModal from './BatteryDetailModal';

const BatteryStockView = () => {
    const { batteries, isLoading, error, refetch } = useBatteryStockData();
    const [selectedBattery, setSelectedBattery] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    // Calculate statistics
    const stats = useMemo(() => {
        const total = batteries.length;
        const available = batteries.filter(b => 
            b.status?.toLowerCase() === 'available' || b.status?.toLowerCase() === 'in_stock'
        ).length;
        const charging = batteries.filter(b => b.status?.toLowerCase() === 'charging').length;
        const maintenance = batteries.filter(b => b.status?.toLowerCase() === 'maintenance').length;
        
        return { total, available, charging, maintenance };
    }, [batteries]);

    // Filter batteries
    const filteredBatteries = useMemo(() => {
        return batteries.filter(bat => {
            const id = bat.id || bat.batteryId;
            const status = (bat.status || '').toLowerCase();
            const matchesSearch = searchQuery === '' || 
                id.toString().includes(searchQuery) ||
                `BAT${id}`.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === '' || status === statusFilter.toLowerCase();
            
            return matchesSearch && matchesStatus;
        });
    }, [batteries, searchQuery, statusFilter]);

    const handleViewDetails = (battery) => {
        setSelectedBattery(battery);
    };

    const handleCloseModal = () => {
        setSelectedBattery(null);
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
    if (isLoading) {
        return (
            <div className="staff-battery-loading">
                <div className="staff-battery-spinner"></div>
                <div className="staff-battery-loading-text">Đang tải dữ liệu kho pin...</div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="staff-battery-error">
                <div className="staff-battery-error-icon">⚠️</div>
                <h3 className="staff-battery-error-title">Lỗi tải dữ liệu</h3>
                <p className="staff-battery-error-message">{error}</p>
                <button onClick={refetch} className="staff-battery-error-btn">
                    🔄 Thử lại
                </button>
            </div>
        );
    }

    // Empty State
    if (batteries.length === 0) {
        return (
            <div className="staff-battery-empty">
                <div className="staff-battery-empty-icon">🔋</div>
                <h3 className="staff-battery-empty-title">Không có pin nào</h3>
                <p className="staff-battery-empty-message">Kho pin hiện đang trống</p>
            </div>
        );
    }

    return (
        <>
            {/* Stats Dashboard */}
            <div className="staff-battery-stats">
                <div className="staff-battery-stat-card">
                    <div className="staff-battery-stat-icon">🔋</div>
                    <div className="staff-battery-stat-content">
                        <span className="staff-battery-stat-label">Tổng số pin</span>
                        <h2 className="staff-battery-stat-value">{stats.total}</h2>
                    </div>
                </div>

                <div className="staff-battery-stat-card">
                    <div className="staff-battery-stat-icon">✅</div>
                    <div className="staff-battery-stat-content">
                        <span className="staff-battery-stat-label">Sẵn sàng</span>
                        <h2 className="staff-battery-stat-value">{stats.available}</h2>
                    </div>
                </div>

                <div className="staff-battery-stat-card">
                    <div className="staff-battery-stat-icon">⚡</div>
                    <div className="staff-battery-stat-content">
                        <span className="staff-battery-stat-label">Đang sạc</span>
                        <h2 className="staff-battery-stat-value">{stats.charging}</h2>
                    </div>
                </div>

                <div className="staff-battery-stat-card">
                    <div className="staff-battery-stat-icon">🔧</div>
                    <div className="staff-battery-stat-content">
                        <span className="staff-battery-stat-label">Bảo trì</span>
                        <h2 className="staff-battery-stat-value">{stats.maintenance}</h2>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="staff-battery-filters">
                <div className="staff-battery-filter-row">
                    <input 
                        type="text" 
                        placeholder="🔍 Tìm theo Mã pin..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="staff-battery-search"
                    />
                    
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="staff-battery-filter-select"
                    >
                        <option value="">📊 Tất cả trạng thái</option>
                        <option value="available">✅ Sẵn sàng</option>
                        <option value="in_stock">✅ Trong kho</option>
                        <option value="charging">⚡ Đang sạc</option>
                        <option value="maintenance">🔧 Bảo trì</option>
                        <option value="in_use">🚗 Đang sử dụng</option>
                    </select>

                    <button onClick={refetch} className="staff-battery-refresh-btn">
                        <span>🔄</span> Làm mới
                    </button>
                </div>
            </div>

            {/* Cards View */}
            {filteredBatteries.length === 0 ? (
                <div className="staff-battery-empty">
                    <div className="staff-battery-empty-icon">🔍</div>
                    <h3 className="staff-battery-empty-title">Không tìm thấy</h3>
                    <p className="staff-battery-empty-message">
                        Không có pin nào phù hợp với bộ lọc
                    </p>
                </div>
            ) : (
                <div className="staff-battery-table-container">
                    <table className="staff-battery-table">
                        <thead>
                            <tr>
                                <th>Mã Pin</th>
                                <th>Mẫu Pin</th>
                                <th>Trạng thái</th>
                                <th>Sức khỏe</th>
                                <th>Chu kỳ sạc</th>
                                <th>Vị trí</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBatteries.map((bat) => {
                                const id = bat.id || bat.batteryId;
                                const status = bat.status || 'N/A';
                                const health = bat.stateOfHealth || bat.health || bat.charge || 0;
                                const slot = bat.slotId || bat.slot || 'N/A';
                                const model = bat.model || 'N/A';
                                const cycles = bat.cycleCount || bat.cycles || 0;

                                return (
                                    <tr key={id}>
                                        {/* Battery ID */}
                                        <td>
                                            <div className="staff-battery-id">
                                                <span className="staff-battery-id-icon">🔋</span>
                                                <span className="staff-battery-id-text">BAT{id}</span>
                                            </div>
                                        </td>

                                        {/* Model */}
                                        <td>
                                            <span className="staff-battery-model">{model}</span>
                                        </td>

                                        {/* Status */}
                                        <td>
                                            <span className={`staff-battery-status ${formatStatus(status)}`}>
                                                {displayStatus(status)}
                                            </span>
                                        </td>

                                        {/* Health */}
                                        <td>
                                            <div className="staff-battery-health">
                                                <div className="staff-battery-health-bar">
                                                    <div 
                                                        className={`staff-battery-health-fill ${getHealthClass(health)}`}
                                                        style={{ width: `${health}%` }}
                                                    ></div>
                                                </div>
                                                <span className="staff-battery-health-text">{health}%</span>
                                            </div>
                                        </td>

                                        {/* Cycles */}
                                        <td>
                                            <div className="staff-battery-cycles">
                                                <span className="staff-battery-cycles-icon">🔄</span>
                                                <span className="staff-battery-cycles-text">{cycles}</span>
                                            </div>
                                        </td>

                                        {/* Slot */}
                                        <td>
                                            <span className="staff-battery-model">Hộc {slot}</span>
                                        </td>

                                        {/* Actions */}
                                        <td>
                                            <button 
                                                onClick={() => handleViewDetails(bat)}
                                                className="staff-battery-view-btn"
                                            >
                                                👁️ Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            <BatteryDetailModal 
                battery={selectedBattery} 
                onClose={handleCloseModal} 
            />
        </>
    );
};

export default BatteryStockView;