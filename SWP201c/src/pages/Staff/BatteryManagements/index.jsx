import React from 'react';
// import SwapConfirmView from './components/SwapConfirmView'; // <-- Đã xóa
import BatteryStockView from './components/BatteryStockView';

const BatteryManagement = () => {
  // Xóa state quản lý tab
  // Xóa hàm getTabStyle

  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: '30px' }}>Quản lý Pin</h1>
      
      {/* Toàn bộ div chứa 2 nút bấm "Xác nhận đổi pin" và "Kho pin" đã bị xóa 
      */}

      {/* Hiển thị trực tiếp nội dung kho pin */}
      <div style={{ marginTop: '30px' }}>
        <BatteryStockView />
      </div>
    </div>
  );
};

export default BatteryManagement;