import React from 'react';

const DetailRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #374151' }}>
        <span style={{ color: '#9ca3af' }}>{label}</span>
        <span style={{ color: 'white', fontWeight: '600' }}>{value}</span>
    </div>
);

const TransactionDetailModal = ({ transaction, onClose }) => {
    if (!transaction) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
            <div style={{ background: '#1f2937', borderRadius: '16px', width: '90%', maxWidth: '600px', border: '1px solid #374151' }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '20px', borderBottom: '1px solid #374151' }}>
                    <h2 style={{ margin: 0, fontSize: '20px' }}>Chi tiết Giao dịch #{transaction.swapId}</h2>
                </div>
                <div style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
                    <DetailRow label="ID Giao dịch" value={transaction.swapId} />
                    <DetailRow label="Trạng thái" value={transaction.swapStatus} />
                    <DetailRow label="Thời gian" value={new Date(transaction.swapDate).toLocaleString('vi-VN')} />
                    <hr style={{ border: 'none', borderTop: '1px solid #374151' }} />
                    <DetailRow label="Tài xế ID" value={transaction.userId || 'N/A'} />
                    <DetailRow label="Hợp đồng ID" value={transaction.contractId || 'N/A'} />
                    <DetailRow label="Xe ID" value={transaction.vehicleId || 'N/A'} />
                    <hr style={{ border: 'none', borderTop: '1px solid #374151' }} />
                    <DetailRow label="Trạm ID" value={transaction.stationId || 'N/A'} />
                    <DetailRow label="Trụ ID" value={transaction.towerId || 'N/A'} />
                    <DetailRow label="Nhân viên ID" value={transaction.staffId || 'Tự động'} />
                    <hr style={{ border: 'none', borderTop: '1px solid #374151' }} />
                    <DetailRow label="Pin Cũ ID" value={transaction.oldBatteryId || 'N/A'} />
                    <DetailRow label="Pin Mới ID" value={transaction.newBatteryId || 'N/A'} />
                </div>
                <div style={{ padding: '20px', background: '#111827', borderTop: '1px solid #374151', borderRadius: '0 0 16px 16px' }}>
                    <button onClick={onClose} style={{ width: '100%', background: '#374151', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailModal;