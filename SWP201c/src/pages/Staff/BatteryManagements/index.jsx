import React, { useState } from 'react';
import SwapConfirmView from './components/SwapConfirmView';
import BatteryStockView from './components/BatteryStockView';

const BatteryManagement = () => {
  const [activeTab, setActiveTab] = useState('swap-confirm');

  const getTabStyle = (tabName) => ({
    padding: '12px 20px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    color: activeTab === tabName ? '#10b981' : '#94a3b8',
    fontWeight: activeTab === tabName ? '600' : '500',
    fontSize: '16px',
    borderBottom: `3px solid ${activeTab === tabName ? '#10b981' : 'transparent'}`,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  });

  return (
    <div>
      <h1 style={{ marginTop: 0, marginBottom: '30px' }}>Quản lý Pin</h1>
      
      <div style={{ display: 'flex', borderBottom: '1px solid #334155' }}>
        <button style={getTabStyle('swap-confirm')} onClick={() => setActiveTab('swap-confirm')}>
          ✅ Xác nhận đổi pin
        </button>
        <button style={getTabStyle('stock')} onClick={() => setActiveTab('stock')}>
          🔋 Kho pin
        </button>
      </div>

      <div style={{ marginTop: '30px' }}>
        {activeTab === 'swap-confirm' && <SwapConfirmView />}
        {activeTab === 'stock' && <BatteryStockView />}
      </div>
    </div>
  );
};

export default BatteryManagement;