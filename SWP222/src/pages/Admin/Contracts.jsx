// Admin Contract Management
// Manage user contracts and transactions

import React, { useState, useEffect } from 'react';
import contractService from '../../assets/js/services/contractService';
import DashboardLayout from '../../layouts/DashboardLayout';

const AdminContracts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch contracts from API
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Note: Backend cần API GET /api/contracts (get all)
      // Tạm thời dùng endpoint có sẵn
      const result = await contractService.getContractPlans();
      
      if (result.success) {
        // Map plans to contract format hoặc dùng endpoint khác
        // setContracts(result.data);
        setError('Backend cần implement GET /api/contracts endpoint');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Không thể tải dữ liệu hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'active': 'Đang hoạt động',
      'pending': 'Chờ xử lý',
      'expired': 'Hết hạn',
      'cancelled': 'Đã hủy'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'active': '#27ae60',
      'pending': '#f39c12',
      'expired': '#e74c3c',
      'cancelled': '#95a5a6'
    };
    return colorMap[status] || '#95a5a6';
  };

  const getTypeLabel = (type) => {
    const typeMap = {
      'monthly': 'Hàng tháng',
      'annual': 'Hàng năm',
      'pay-per-use': 'Trả theo lần'
    };
    return typeMap[type] || type;
  };

  const getPaymentStatusColor = (status) => {
    const colorMap = {
      'paid': '#27ae60',
      'pending': '#f39c12',
      'failed': '#e74c3c'
    };
    return colorMap[status] || '#95a5a6';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || contract.status === selectedStatus;
    const matchesType = selectedType === 'all' || contract.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: contracts.length,
    active: contracts.filter(c => c.status === 'active').length,
    pending: contracts.filter(c => c.status === 'pending').length,
    expired: contracts.filter(c => c.status === 'expired').length,
    totalRevenue: contracts.filter(c => c.paymentStatus === 'paid').reduce((sum, c) => sum + c.amount, 0)
  };

  const handleViewDetails = (contract) => {
    setSelectedContract(contract);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (contractId, newStatus) => {
    try {
      const result = await contractService.updateContract(contractId, { status: newStatus });
      
      if (result.success) {
        fetchContracts();
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#FFFFFF' }}>
        <h2>Đang tải dữ liệu hợp đồng...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
        <h2>Lỗi: {error}</h2>
        <button onClick={fetchContracts} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#FFFFFF', marginBottom: '10px' }}>📋 Quản lý giao dịch</h1>
        <p style={{ color: '#E0E0E0' }}>Quản lý hợp đồng và giao dịch của người dùng</p>
      </div>

      {/* Statistics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
        gap: '15px', 
        marginBottom: '30px' 
      }}>
        {[
          { label: 'Tổng hợp đồng', value: stats.total, color: '#6ab7ff' },
          { label: 'Đang hoạt động', value: stats.active, color: '#27ae60' },
          { label: 'Chờ xử lý', value: stats.pending, color: '#f39c12' },
          { label: 'Hết hạn', value: stats.expired, color: '#e74c3c' },
          { label: 'Doanh thu', value: formatCurrency(stats.totalRevenue), color: '#19c37d' }
        ].map((stat, index) => (
          <div key={index} style={{
            background: 'rgba(26, 32, 44, 0.8)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: index === 4 ? '18px' : '24px', fontWeight: 'bold', color: stat.color }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '14px', color: '#E0E0E0', marginTop: '5px' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo mã hợp đồng, tên khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '300px',
            padding: '12px 16px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            fontSize: '14px'
          }}
        />

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            fontSize: '14px'
          }}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="pending">Chờ xử lý</option>
          <option value="expired">Hết hạn</option>
          <option value="cancelled">Đã hủy</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{
            padding: '12px 16px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            fontSize: '14px'
          }}
        >
          <option value="all">Tất cả loại</option>
          <option value="monthly">Hàng tháng</option>
          <option value="annual">Hàng năm</option>
          <option value="pay-per-use">Trả theo lần</option>
        </select>
      </div>

      {/* Contracts Table */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <th style={{ padding: '15px', textAlign: 'left', color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Mã hợp đồng</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Khách hàng</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Loại</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Trạng thái</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Số tiền</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Sử dụng</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#FFFFFF', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredContracts.map(contract => (
              <tr key={contract.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '15px', color: '#FFFFFF', fontWeight: '600' }}>{contract.id}</td>
                <td style={{ padding: '15px' }}>
                  <div style={{ color: '#FFFFFF', fontWeight: '500' }}>{contract.userName}</div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>{contract.userEmail}</div>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {getTypeLabel(contract.type)}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    backgroundColor: getStatusColor(contract.status),
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {getStatusLabel(contract.status)}
                  </span>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ color: '#27ae60', fontWeight: '600' }}>{formatCurrency(contract.amount)}</div>
                  <div style={{ 
                    color: getPaymentStatusColor(contract.paymentStatus), 
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {contract.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ color: '#FFFFFF', marginBottom: '5px' }}>
                    {contract.usedSwaps}/{contract.totalSwaps}
                  </div>
                  <div style={{ 
                    width: '80px', 
                    height: '6px', 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    borderRadius: '3px', 
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(contract.usedSwaps / contract.totalSwaps) * 100}%`,
                      height: '100%',
                      backgroundColor: '#27ae60'
                    }}></div>
                  </div>
                </td>
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleViewDetails(contract)}
                      style={{
                        padding: '6px 12px',
                        background: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      �️
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(contract.id, 'active')}
                      style={{
                        padding: '6px 12px',
                        background: '#27ae60',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      ✅
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Contract Detail Modal */}
      {showDetailModal && selectedContract && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(26, 32, 44, 0.95)',
            borderRadius: '12px',
            padding: '30px',
            width: '600px',
            maxHeight: '80vh',
            overflowY: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#FFFFFF', margin: 0 }}>Chi tiết hợp đồng {selectedContract.id}</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Customer Info */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h4 style={{ color: '#FFFFFF', marginBottom: '10px' }}>Thông tin khách hàng</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Tên khách hàng:</div>
                    <div style={{ color: '#FFFFFF', fontWeight: '500' }}>{selectedContract.userName}</div>
                  </div>
                  <div>
                    <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Email:</div>
                    <div style={{ color: '#FFFFFF', fontWeight: '500' }}>{selectedContract.userEmail}</div>
                  </div>
                </div>
              </div>

              {/* Contract Info */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h4 style={{ color: '#FFFFFF', marginBottom: '10px' }}>Thông tin hợp đồng</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Loại hợp đồng:</div>
                    <div style={{ color: '#FFFFFF', fontWeight: '500' }}>{getTypeLabel(selectedContract.type)}</div>
                  </div>
                  <div>
                    <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Trạng thái:</div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      backgroundColor: getStatusColor(selectedContract.status),
                      color: 'white',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {getStatusLabel(selectedContract.status)}
                    </span>
                  </div>
                  <div>
                    <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Số tiền:</div>
                    <div style={{ color: '#27ae60', fontWeight: '600', fontSize: '1.1rem' }}>
                      {formatCurrency(selectedContract.amount)}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Thanh toán:</div>
                    <div style={{ color: getPaymentStatusColor(selectedContract.paymentStatus), fontWeight: '500' }}>
                      {selectedContract.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Ngày bắt đầu:</div>
                    <div style={{ color: '#FFFFFF', fontWeight: '500' }}>{selectedContract.startDate}</div>
                  </div>
                  <div>
                    <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Ngày kết thúc:</div>
                    <div style={{ color: '#FFFFFF', fontWeight: '500' }}>
                      {selectedContract.endDate || 'Không giới hạn'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Info */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '15px'
              }}>
                <h4 style={{ color: '#FFFFFF', marginBottom: '10px' }}>Thông tin sử dụng</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Tổng lần đổi pin:</div>
                    <div style={{ color: '#FFFFFF', fontWeight: '500' }}>{selectedContract.totalSwaps}</div>
                  </div>
                  <div>
                    <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Đã sử dụng:</div>
                    <div style={{ color: '#FFFFFF', fontWeight: '500' }}>{selectedContract.usedSwaps}</div>
                  </div>
                  <div>
                    <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Còn lại:</div>
                    <div style={{ color: '#27ae60', fontWeight: '600' }}>
                      {selectedContract.totalSwaps - selectedContract.usedSwaps}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>Lần đổi pin cuối:</div>
                    <div style={{ color: '#FFFFFF', fontWeight: '500' }}>
                      {selectedContract.lastSwap || 'Chưa sử dụng'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '25px', textAlign: 'right' }}>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  padding: '12px 24px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default AdminContracts;