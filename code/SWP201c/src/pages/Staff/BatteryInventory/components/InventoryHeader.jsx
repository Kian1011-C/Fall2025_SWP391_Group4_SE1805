// Staff/BatteryInventory/components/InventoryHeader.jsx
import React from 'react';

const InventoryHeader = () => {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h1 style={{ color: '#FFFFFF', marginBottom: '10px' }}>
        🔋 Quản lý kho pin
      </h1>
      <p style={{ color: '#E0E0E0' }}>
        Theo dõi và cập nhật trạng thái pin (đang dùng, sạc, hỏng)
      </p>
    </div>
  );
};

export default InventoryHeader;
