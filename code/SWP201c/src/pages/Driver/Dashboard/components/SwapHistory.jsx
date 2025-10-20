// Swap History Component
import React, { useMemo } from 'react';

const SwapHistory = ({ swaps = [], page = 1, pageSize = 5, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(swaps.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);

  const visible = useMemo(() => {
    const start = (current - 1) * pageSize;
    return swaps.slice(start, start + pageSize);
  }, [swaps, current, pageSize]);

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
        🔄 Lịch sử đổi pin
      </h3>

      {visible.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {visible.map((swap, index) => (
            <div key={swap.swapId || swap.id || index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '10px',
              padding: '15px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '5px' }}>
                  🏪 {swap.stationName || swap.station?.name || 'Trạm không rõ'}
                </div>
                <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>
                  {swap.time ? new Date(swap.time).toLocaleString('vi-VN') : (swap.createdAt ? new Date(swap.createdAt).toLocaleString('vi-VN') : 'N/A')}
                </div>
                <div style={{ color: '#B0B0B0', fontSize: '0.7rem', marginTop: '2px' }}>
                  ID: {swap.swapId || swap.id || 'N/A'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#19c37d', fontSize: '0.9rem', fontWeight: '600' }}>
                  {typeof swap.newBattery === 'number' ? `${swap.newBattery}%` : (swap.newBatteryLevel ? `${swap.newBatteryLevel}%` : '—')}
                </div>
                <div style={{ color: '#B0B0B0', fontSize: '0.7rem' }}>
                  Cũ → Mới: {swap.oldBattery ?? swap.oldBatteryLevel ?? '—'} → {swap.newBattery ?? swap.newBatteryLevel ?? '—'}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <button disabled={current === 1} onClick={() => onPageChange?.(current - 1)}
              style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', cursor: current === 1 ? 'not-allowed' : 'pointer' }}>
              ← Trước
            </button>
            <span style={{ color: '#B0B0B0', fontSize: 13 }}>{current}/{totalPages}</span>
            <button disabled={current === totalPages} onClick={() => onPageChange?.(current + 1)}
              style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#fff', cursor: current === totalPages ? 'not-allowed' : 'pointer' }}>
              Sau →
            </button>
          </div>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'center', padding: '40px', color: '#B0B0B0'
        }}>
          <div style={{ fontSize: '3rem' }}>📭</div>
          <div>Chưa có lịch sử đổi pin</div>
        </div>
      )}
    </div>
  );
};

export default SwapHistory;


