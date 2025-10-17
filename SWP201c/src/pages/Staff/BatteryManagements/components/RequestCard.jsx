import React from 'react';

const RequestCard = ({ request, onAccept, onDecline, isSubmitting }) => {
  return (
    <div style={{ background: '#1e293b', padding: '25px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #334155' }}>
      <h3 style={{ margin: '0 0 15px 0', color: 'white', borderBottom: '1px solid #334155', paddingBottom: '15px' }}>Yêu cầu #{request.swapId}</h3>
      <p><strong style={{ color: '#94a3b8', minWidth: '100px', display: 'inline-block' }}>Tài xế ID:</strong> {request.userId}</p>
      <p><strong style={{ color: '#94a3b8', minWidth: '100px', display: 'inline-block' }}>Trạm ID:</strong> {request.stationId}</p>
      <p><strong style={{ color: '#94a3b8', minWidth: '100px', display: 'inline-block' }}>Thời gian:</strong> {new Date(request.swapDate).toLocaleString('vi-VN')}</p>
      <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
        <button onClick={() => onAccept(request.swapId)} disabled={isSubmitting} style={{ flex: 1, background: '#10b981', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', opacity: isSubmitting ? 0.5 : 1 }}>{isSubmitting ? 'Đang xử lý...' : '✅ Chấp nhận'}</button>
        <button onClick={() => onDecline(request.swapId)} disabled={isSubmitting} style={{ flex: 1, background: '#475569', color: '#e2e8f0', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', opacity: isSubmitting ? 0.5 : 1 }}>{isSubmitting ? 'Đang xử lý...' : '❌ Từ chối'}</button>
      </div>
    </div>
  );
};
export default RequestCard;