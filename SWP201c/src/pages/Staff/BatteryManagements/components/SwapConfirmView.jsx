import React from 'react';
import { useSwapConfirmData } from '../hooks/useSwapConfirmData';
import RequestCard from './RequestCard';

const SwapConfirmView = () => {
  const { requests, isLoading, error, isSubmitting, handleAcceptRequest, handleDeclineRequest } = useSwapConfirmData();

  if (isLoading) return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Đang tải danh sách yêu cầu...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div>
      {requests.length > 0 ? (
        requests.map(req => (
          <RequestCard 
            key={req.swapId} 
            request={req}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
            isSubmitting={isSubmitting}
          />
        ))
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', background: '#1e2b3b', borderRadius: '16px' }}>
          <div style={{fontSize: '48px'}}>🎉</div>
          <h3 style={{color: 'white'}}>Không có yêu cầu nào</h3>
          <p style={{color: '#94a3b8'}}>Tất cả các yêu cầu đã được xử lý.</p>
        </div>
      )}
    </div>
  );
};
export default SwapConfirmView;