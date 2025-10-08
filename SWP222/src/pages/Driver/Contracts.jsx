// Driver Contract Management
// Hợp đồng thuê pin
// Battery rental contracts

import React, { useState, useEffect } from 'react';
import contractService from '../../assets/js/services/contractService';
import DashboardLayout from '../../layouts/DashboardLayout';

const DriverContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Note: Backend cần API GET /api/users/:userId/contracts
      // Tạm thời dùng getContractPlans để demo
      setContracts([]);
      setError('Backend cần API GET /api/users/:userId/contracts để hiển thị hợp đồng của user');
    } catch (err) {
      setError('Lỗi khi tải danh sách hợp đồng');
      console.error('Error fetching contracts:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': '#19c37d',
      'pending': '#ffa500',
      'expired': '#ff6b6b',
      'cancelled': '#95a5a6'
    };
    return colors[status] || '#9c88ff';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'active': 'Đang hoạt động',
      'pending': 'Chờ xử lý',
      'expired': 'Hết hạn',
      'cancelled': 'Đã hủy'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>⏳ Đang tải...</div>
      </div>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#FFFFFF', margin: '0 0 10px 0' }}>📄 Hợp đồng thuê pin</h1>
        <p style={{ color: '#B0B0B0', margin: 0 }}>Quản lý các hợp đồng thuê pin của bạn</p>
      </div>

      {error && (
        <div style={{
          background: 'rgba(255, 107, 107, 0.1)',
          border: '1px solid rgba(255, 107, 107, 0.3)',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '20px',
          color: '#ff6b6b'
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Contracts List */}
      {contracts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {contracts.map((contract) => (
            <div
              key={contract.id}
              style={{
                background: 'rgba(26, 32, 44, 0.8)',
                borderRadius: '20px',
                padding: '30px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onClick={() => setSelectedContract(contract)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '6px 15px',
                    background: `${getStatusColor(contract.status)}20`,
                    color: getStatusColor(contract.status),
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    border: `1px solid ${getStatusColor(contract.status)}40`,
                    marginBottom: '15px'
                  }}>
                    {getStatusLabel(contract.status)}
                  </div>
                  <h3 style={{ color: '#FFFFFF', margin: '0 0 10px 0', fontSize: '1.5rem' }}>
                    {contract.planName}
                  </h3>
                  <p style={{ color: '#B0B0B0', margin: 0 }}>
                    Mã hợp đồng: {contract.id}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#19c37d', fontSize: '2rem', fontWeight: '700' }}>
                    {formatCurrency(contract.amount)}
                  </div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                    {contract.swapLimit} lượt đổi pin
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '5px' }}>
                    Ngày bắt đầu
                  </div>
                  <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '500' }}>
                    {formatDate(contract.startDate)}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '5px' }}>
                    Ngày kết thúc
                  </div>
                  <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '500' }}>
                    {formatDate(contract.endDate)}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '5px' }}>
                    Đã sử dụng
                  </div>
                  <div style={{ color: '#6ab7ff', fontSize: '1.1rem', fontWeight: '500' }}>
                    {contract.usedSwaps} / {contract.swapLimit} lượt
                  </div>
                </div>
                <div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.9rem', marginBottom: '5px' }}>
                    Thanh toán
                  </div>
                  <div style={{ 
                    color: contract.paymentStatus === 'paid' ? '#19c37d' : '#ffa500',
                    fontSize: '1.1rem',
                    fontWeight: '500'
                  }}>
                    {contract.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '20px',
          padding: '60px 20px',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '20px' }}>📋</div>
          <h3 style={{ color: '#FFFFFF', marginBottom: '10px' }}>Chưa có hợp đồng nào</h3>
          <p style={{ color: '#B0B0B0', marginBottom: '25px' }}>
            Đăng ký gói dịch vụ để bắt đầu sử dụng
          </p>
          <button
            onClick={() => window.location.href = '/driver/subscriptions'}
            style={{
              padding: '14px 28px',
              background: 'linear-gradient(135deg, #19c37d, #15a36a)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)'
            }}
          >
            Xem gói dịch vụ
          </button>
        </div>
      )}

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setSelectedContract(null)}
        >
          <div
            style={{
              background: '#1a202c',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '600px',
              width: '100%',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: '#FFFFFF', marginBottom: '20px' }}>Chi tiết hợp đồng</h2>
            <div style={{ color: '#B0B0B0', marginBottom: '20px' }}>
              Chi tiết hợp đồng {selectedContract.id}
            </div>
            <button
              onClick={() => setSelectedContract(null)}
              style={{
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default DriverContracts;
