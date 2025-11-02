import React, { useState } from 'react';
import BatteryStockView from './components/BatteryStockView';
import '../../../assets/css/StaffBatteryManagement.css';

const BatteryManagement = () => {
  return (
    <div className="staff-battery-container">
      <div className="staff-battery-header">
        <h1>🔋 Quản lý Pin</h1>
        <p>Theo dõi tình trạng và kho pin trong hệ thống</p>
      </div>
      
      <BatteryStockView />
    </div>
  );
};

export default BatteryManagement;