// Swap History Component
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SwapHistory = ({ swaps }) => {
  const navigate = useNavigate();

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
        🔋 Lịch sử đổi pin gần đây
      </h3>
      
      {swaps.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {swaps.map((swap, index) => (
            <div
              key={swap.id || index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '10px',
                padding: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '5px' }}>
                  🔋 Đổi pin tại trạm {swap.stationId || 'N/A'}
                </div>
                <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>
                  {swap.createdAt ? new Date(swap.createdAt).toLocaleString('vi-VN') : 'N/A'}
                </div>
                <div style={{ color: '#B0B0B0', fontSize: '0.7rem', marginTop: '2px' }}>
                  ID: {swap.id || 'N/A'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{
                  background: swap.status === 'completed' ? 'rgba(25, 195, 125, 0.2)' : 
                             swap.status === 'processing' ? 'rgba(255, 165, 0, 0.2)' : 'rgba(255, 107, 107, 0.2)',
                  color: swap.status === 'completed' ? '#19c37d' : 
                         swap.status === 'processing' ? '#ffa500' : '#ff6b6b',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginBottom: '5px'
                }}>
                  {swap.status === 'completed' ? '✅ Hoàn thành' : 
                   swap.status === 'processing' ? '⏳ Đang xử lý' : '❌ Thất bại'}
                </div>
                <div style={{ color: '#19c37d', fontSize: '0.9rem', fontWeight: '600' }}>
                  {swap.completedAt ? 
                    `${Math.round((new Date(swap.completedAt) - new Date(swap.createdAt)) / 60000)} phút` : 
                    'Đang xử lý...'
                  }
                </div>
                <div style={{ color: '#B0B0B0', fontSize: '0.7rem' }}>
                  Xe: {swap.vehicleId || 'N/A'}
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/driver/swap-battery')}
            style={{
              background: 'rgba(25, 195, 125, 0.1)',
              border: '1px solid rgba(25, 195, 125, 0.3)',
              borderRadius: '8px',
              padding: '10px',
              color: '#19c37d',
              cursor: 'pointer',
              fontSize: '0.9rem',
              marginTop: '10px'
            }}
          >
            🔋 Xem tất cả lịch sử đổi pin
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '15px',
          textAlign: 'center',
          padding: '40px',
          color: '#B0B0B0'
        }}>
          <div style={{ fontSize: '3rem' }}>📭</div>
          <div>Chưa có lịch sử đổi pin nào</div>
          <button
            onClick={() => navigate('/driver/swap-battery')}
            style={{
              background: 'linear-gradient(135deg, #19c37d, #15a36a)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              cursor: 'pointer',
              fontSize: '1rem',
              marginTop: '10px'
            }}
          >
            🔋 Đổi pin ngay
          </button>
        </div>
      )}
    </div>
  );
};

export default SwapHistory;
