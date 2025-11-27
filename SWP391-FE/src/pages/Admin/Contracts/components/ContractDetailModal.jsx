import React from 'react';

const DetailRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #374151' }}>
        <span style={{ color: '#9ca3af' }}>{label}</span>
        <span style={{ color: 'white', fontWeight: '600' }}>{value}</span>
    </div>
);

const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : '';
    const style = { padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    if (s === 'active') return { ...style, background: '#166534', color: '#86efac' };
    if (s === 'pending') return { ...style, background: '#9a3412', color: '#fdba74' };
    if (s === 'expired' || s === 'terminated') return { ...style, background: '#991b1b', color: '#fca5a5' };
    return { ...style, background: '#4b5563', color: '#e5e7eb' };
};

const ContractDetailModal = ({ contract, onClose }) => {
    if (!contract) return null;

    return (
        <div style={{ 
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
            padding: '20px',
            overflowY: 'auto'
        }} onClick={onClose}>
            <div style={{ 
                background: '#1f2937', 
                borderRadius: '16px', 
                width: '100%', 
                maxWidth: '800px', 
                border: '1px solid #374151',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column'
            }} onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div style={{ 
                    padding: '20px', 
                    borderBottom: '1px solid #374151',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '20px' }}>Chi tiết Hợp đồng</h2>
                        <p style={{ margin: '5px 0 0 0', color: '#9ca3af', fontSize: '14px' }}>
                            {contract.contractNumber}
                        </p>
                    </div>
                    <span style={getStatusStyle(contract.status)}>{contract.status}</span>
                </div>

                {/* Content */}
                <div style={{ 
                    padding: '20px', 
                    overflowY: 'auto',
                    flex: 1
                }}>
                    {/* Thông tin khách hàng */}
                    <div style={{ marginBottom: '25px' }}>
                        <h3 style={{ 
                            margin: '0 0 15px 0', 
                            fontSize: '16px', 
                            color: '#10b981',
                            borderBottom: '2px solid #10b981',
                            paddingBottom: '8px'
                        }}>
                            Thông tin Khách hàng
                        </h3>
                        <DetailRow label="Họ và tên" value={`${contract.firstName} ${contract.lastName}`} />
                        <DetailRow label="Email" value={contract.email} />
                        <DetailRow label="Số điện thoại" value={contract.phone || 'N/A'} />
                    </div>

                    {/* Thông tin xe */}
                    <div style={{ marginBottom: '25px' }}>
                        <h3 style={{ 
                            margin: '0 0 15px 0', 
                            fontSize: '16px', 
                            color: '#10b981',
                            borderBottom: '2px solid #10b981',
                            paddingBottom: '8px'
                        }}>
                            Thông tin Xe
                        </h3>
                        <DetailRow label="Biển số xe" value={contract.plateNumber} />
                        <DetailRow label="Mẫu xe" value={contract.vehicleModel} />
                        <DetailRow label="ID Xe" value={contract.vehicleId} />
                    </div>

                    {/* Thông tin gói dịch vụ */}
                    <div style={{ marginBottom: '25px' }}>
                        <h3 style={{ 
                            margin: '0 0 15px 0', 
                            fontSize: '16px', 
                            color: '#10b981',
                            borderBottom: '2px solid #10b981',
                            paddingBottom: '8px'
                        }}>
                            Thông tin Gói dịch vụ
                        </h3>
                        <DetailRow label="Tên gói" value={contract.planName} />
                        <DetailRow label="ID Gói" value={contract.planId} />
                        <DetailRow 
                            label="Phí cơ bản/tháng" 
                            value={contract.monthlyBaseFee ? `${contract.monthlyBaseFee.toLocaleString('vi-VN')}đ` : 'N/A'} 
                        />
                        <DetailRow 
                            label="Quãng đường tháng này" 
                            value={contract.monthlyDistance ? `${contract.monthlyDistance.toLocaleString('vi-VN')} km` : '0 km'} 
                        />
                    </div>

                    {/* Thông tin hợp đồng */}
                    <div style={{ marginBottom: '25px' }}>
                        <h3 style={{ 
                            margin: '0 0 15px 0', 
                            fontSize: '16px', 
                            color: '#10b981',
                            borderBottom: '2px solid #10b981',
                            paddingBottom: '8px'
                        }}>
                            Thông tin Hợp đồng
                        </h3>
                        <DetailRow label="Số hợp đồng" value={contract.contractNumber} />
                        <DetailRow label="ID Hợp đồng" value={contract.contractId} />
                        <DetailRow label="Ngày bắt đầu" value={new Date(contract.startDate).toLocaleDateString('vi-VN')} />
                        <DetailRow label="Ngày kết thúc" value={new Date(contract.endDate).toLocaleDateString('vi-VN')} />
                        <DetailRow label="Nơi ký" value={contract.signedPlace || 'N/A'} />
                        <DetailRow label="Trạng thái" value={contract.status} />
                    </div>
                </div>

                {/* Footer */}
                <div style={{ 
                    padding: '20px', 
                    background: '#111827', 
                    borderTop: '1px solid #374151', 
                    borderRadius: '0 0 16px 16px' 
                }}>
                    <button 
                        onClick={onClose} 
                        style={{ 
                            width: '100%', 
                            background: '#374151', 
                            color: 'white', 
                            border: 'none', 
                            padding: '12px', 
                            borderRadius: '8px', 
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContractDetailModal;