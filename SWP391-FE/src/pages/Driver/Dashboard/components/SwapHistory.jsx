// Swap History Component
import React, { useState, useEffect } from 'react';
import { FiClock, FiMapPin, FiCheckCircle, FiXCircle, FiActivity, FiBattery } from 'react-icons/fi';
import { apiUtils } from '../../../../assets/js/config/api';
import { useAuth } from '../../../../context/AuthContext';

const SwapHistory = () => {
  const { currentUser } = useAuth();
  const [swapHistory, setSwapHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchSwapHistory = async () => {
      // Try both userId and id
      const userId = currentUser?.userId || currentUser?.id;
      
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Call API: GET /api/users/{userId}/swaps (get all, we'll paginate on frontend)
        const response = await apiUtils.get(`/api/users/${userId}/swaps`);
        
        // Backend trả về: { success, data, message, total }
        if (response?.success) {
          setSwapHistory(response.data || []);
        } else {
          setError(response?.message || 'Không thể tải lịch sử');
        }
      } catch (err) {
        console.error('Lỗi khi tải lịch sử đổi pin:', err);
        setError(err.message || 'Không thể tải lịch sử');
      } finally {
        setLoading(false);
      }
    };

    fetchSwapHistory();
  }, [currentUser]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = swapHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(swapHistory.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return <FiCheckCircle style={{ color: '#19c37d' }} />;
      case 'CANCELLED':
      case 'FAILED':
        return <FiXCircle style={{ color: '#ff6b6b' }} />;
      case 'INITIATED':
      case 'IN_PROGRESS':
        return <FiActivity style={{ color: '#ffa500' }} />;
      case 'AUTO':
        return <FiCheckCircle style={{ color: '#6ab7ff' }} />;
      default:
        return <FiActivity style={{ color: '#808080' }} />;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'FAILED':
        return 'Thất bại';
      case 'INITIATED':
        return 'Đang khởi tạo';
      case 'IN_PROGRESS':
        return 'Đang thực hiện';
      case 'AUTO':
        return 'Tự động';
      default:
        return status || 'Không rõ';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return '#19c37d';
      case 'CANCELLED':
      case 'FAILED':
        return '#ff6b6b';
      case 'INITIATED':
      case 'IN_PROGRESS':
        return '#ffa500';
      case 'AUTO':
        return '#6ab7ff';
      default:
        return '#808080';
    }
  };

  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h3 style={{ 
        color: '#FFFFFF', 
        marginBottom: '20px',
        fontSize: '1.3rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <FiBattery /> Lịch sử đổi pin gần đây
      </h3>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#B0B0B0' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏳</div>
          <div>Đang tải lịch sử...</div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚠️</div>
          <div style={{ color: '#ff6b6b' }}>{error}</div>
        </div>
      ) : swapHistory.length > 0 ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {currentItems.map((swap, index) => (
            <div
              key={swap.swapId || index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    {getStatusIcon(swap.swapStatus)}
                    <span style={{ 
                      color: getStatusColor(swap.swapStatus),
                      fontWeight: '600',
                      fontSize: '1rem'
                    }}>
                      {getStatusText(swap.swapStatus)}
                    </span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    color: '#B0B0B0',
                    fontSize: '0.85rem',
                    marginBottom: '5px'
                  }}>
                    <FiMapPin size={14} />
                    <span>Trạm #{swap.stationId}</span>
                  </div>
                  <div style={{ 
                    color: '#808080',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <FiClock size={12} />
                    {formatDate(swap.swapDate)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {swap.newBatteryId && (
                    <div style={{ 
                      color: '#19c37d',
                      fontSize: '0.9rem',
                      marginBottom: '3px',
                      fontWeight: '600'
                    }}>
                      🔋 Pin #{swap.newBatteryId}
                    </div>
                  )}
                  {swap.oldBatteryId && (
                    <div style={{ 
                      color: '#808080',
                      fontSize: '0.8rem'
                    }}>
                      Cũ: #{swap.oldBatteryId}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Distance info */}
              {swap.distanceUsed && (
                <div style={{
                  background: 'rgba(106, 183, 255, 0.1)',
                  border: '1px solid rgba(106, 183, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>
                    Quãng đường đã đi:
                  </span>
                  <span style={{ color: '#6ab7ff', fontSize: '0.85rem', fontWeight: '600' }}>
                    {swap.distanceUsed.toFixed(1)} km
                  </span>
                </div>
              )}
            </div>
          ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              marginTop: '20px'
            }}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 16px',
                  background: currentPage === 1 ? 'rgba(255, 255, 255, 0.05)' : 'rgba(25, 195, 125, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: currentPage === 1 ? '#666' : '#19c37d',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                ← Trước
              </button>

              <div style={{ display: 'flex', gap: '5px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    style={{
                      padding: '8px 12px',
                      background: currentPage === pageNum 
                        ? 'linear-gradient(135deg, #19c37d, #15a36a)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      border: currentPage === pageNum 
                        ? '1px solid #19c37d' 
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: currentPage === pageNum ? '#FFFFFF' : '#B0B0B0',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      minWidth: '40px'
                    }}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 16px',
                  background: currentPage === totalPages ? 'rgba(255, 255, 255, 0.05)' : 'rgba(25, 195, 125, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  color: currentPage === totalPages ? '#666' : '#19c37d',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                Sau →
              </button>
            </div>
          )}

          {/* Info text */}
          <div style={{
            textAlign: 'center',
            color: '#808080',
            fontSize: '0.85rem',
            marginTop: '15px'
          }}>
          </div>
        </>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px',
          textAlign: 'center',
          padding: '40px',
          color: '#B0B0B0'
        }}>
          <div style={{ fontSize: '2rem' }}>🔋</div>
          <div>Chưa có lịch sử đổi pin</div>
        </div>
      )}
    </div>
  );
};

export default SwapHistory;
