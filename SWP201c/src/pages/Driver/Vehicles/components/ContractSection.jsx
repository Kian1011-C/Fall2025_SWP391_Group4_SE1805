// Vehicle Detail Modal - Contract Section
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContractSection = ({ vehicleContract, onClose }) => {
  const navigate = useNavigate();

  if (vehicleContract) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#B0B0B0' }}>Tên gói:</span>
          <span style={{ color: '#FFFFFF', fontWeight: '600' }}>
            {vehicleContract.planName}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#B0B0B0' }}>Số hợp đồng:</span>
          <span style={{ color: '#9c88ff', fontWeight: '600' }}>
            {vehicleContract.contractNumber}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#B0B0B0' }}>Trạng thái:</span>
          <span style={{ 
            color: vehicleContract.status === 'active' ? '#19c37d' : '#ffa500',
            fontWeight: '600',
            background: vehicleContract.status === 'active' ? 'rgba(25, 195, 125, 0.2)' : 'rgba(255, 165, 0, 0.2)',
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '0.85rem'
          }}>
            {vehicleContract.status === 'active' ? '✓ Đang hoạt động' : '⏸ Tạm dừng'}
          </span>
        </div>
        {vehicleContract.monthlyFee && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#B0B0B0' }}>Phí hàng tháng:</span>
            <span style={{ color: '#ffa500', fontWeight: '600' }}>
              {vehicleContract.monthlyFee.toLocaleString()} VNĐ
            </span>
          </div>
        )}
        {vehicleContract.monthlyDistance && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#B0B0B0' }}>Quãng đường/tháng:</span>
            <span style={{ color: '#6ab7ff', fontWeight: '600' }}>
              {vehicleContract.monthlyDistance.toLocaleString()} km
            </span>
          </div>
        )}
        {vehicleContract.startDate && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#B0B0B0' }}>Ngày bắt đầu:</span>
            <span style={{ color: '#FFFFFF', fontWeight: '600' }}>
              {new Date(vehicleContract.startDate).toLocaleDateString('vi-VN')}
            </span>
          </div>
        )}
        {vehicleContract.endDate && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#B0B0B0' }}>Ngày hết hạn:</span>
            <span style={{ color: '#FFFFFF', fontWeight: '600' }}>
              {new Date(vehicleContract.endDate).toLocaleDateString('vi-VN')}
            </span>
          </div>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
            navigate('/driver/contracts');
          }}
          style={{
            marginTop: '10px',
            padding: '10px',
            background: 'rgba(25, 195, 125, 0.2)',
            color: '#19c37d',
            border: '1px solid rgba(25, 195, 125, 0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}
        >
          📋 Xem chi tiết hợp đồng
        </button>
      </div>
    );
  }

  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      background: 'rgba(255, 165, 0, 0.1)',
      borderRadius: '8px',
      border: '1px dashed rgba(255, 165, 0, 0.3)'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚠️</div>
      <div style={{ color: '#ffa500', fontSize: '0.9rem', marginBottom: '8px' }}>
        Chưa có gói dịch vụ nào
      </div>
      <div style={{ color: '#B0B0B0', fontSize: '0.85rem', marginBottom: '15px' }}>
        Đăng ký gói để sử dụng dịch vụ đổi pin
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
          navigate('/driver/subscriptions');
        }}
        style={{
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #19c37d, #15a36a)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: '600',
          boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)'
        }}
      >
        📦 Đăng ký gói ngay
      </button>
    </div>
  );
};

export default ContractSection;
