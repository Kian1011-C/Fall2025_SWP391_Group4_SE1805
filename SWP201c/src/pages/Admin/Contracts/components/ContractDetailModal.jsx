import React from 'react';

const DetailRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #374151' }}>
        <span style={{ color: '#9ca3af' }}>{label}</span>
        <span style={{ color: 'white', fontWeight: '600' }}>{value}</span>
    </div>
);

const ContractDetailModal = ({ contract, onClose }) => {
    if (!contract) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={onClose}>
            <div style={{ background: '#1f2937', borderRadius: '16px', width: '90%', maxWidth: '600px', border: '1px solid #374151' }} onClick={e => e.stopPropagation()}>
                <div style={{ padding: '20px', borderBottom: '1px solid #374151' }}>
                    <h2 style={{ margin: 0, fontSize: '20px' }}>Chi tiết Hợp đồng #{contract.contractId}</h2>
                </div>
                <div style={{ padding: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
                    <DetailRow label="Số hợp đồng" value={contract.contractNumber} />
                    <DetailRow label="Tài xế ID" value={contract.userId} />
                    <DetailRow label="Xe ID" value={contract.vehicleId} />
                    <DetailRow label="Gói cước ID" value={contract.planId} />
                    <DetailRow label="Trạng thái" value={contract.status} />
                    <DetailRow label="Ngày bắt đầu" value={new Date(contract.startDate).toLocaleDateString('vi-VN')} />
                    <DetailRow label="Ngày kết thúc" value={new Date(contract.endDate).toLocaleDateString('vi-VN')} />
                </div>
                <div style={{ padding: '20px', background: '#111827', borderTop: '1px solid #374151', borderRadius: '0 0 16px 16px' }}>
                    <button onClick={onClose} style={{ width: '100%', background: '#374151', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer' }}>Đóng</button>
                </div>
            </div>
        </div>
    );
};

export default ContractDetailModal;