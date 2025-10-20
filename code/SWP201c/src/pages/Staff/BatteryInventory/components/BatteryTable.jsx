// Staff/BatteryInventory/components/BatteryTable.jsx
import React from 'react';
import BatteryRow from './BatteryRow';

const BatteryTable = ({ batteries, onUpdateBattery }) => {
  if (batteries.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px', 
        color: '#E0E0E0' 
      }}>
        Không có pin nào
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <thead>
          <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <th style={headerStyle}>ID Pin</th>
            <th style={headerStyle}>Trạm</th>
            <th style={headerStyle}>Trạng thái</th>
            <th style={headerStyle}>Dung lượng</th>
            <th style={headerStyle}>Sức khỏe</th>
            <th style={headerStyle}>Chu kỳ</th>
            <th style={headerStyle}>Nhiệt độ</th>
            <th style={headerStyle}>Điện áp</th>
            <th style={headerStyle}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {batteries.map(battery => (
            <BatteryRow
              key={battery.id}
              battery={battery}
              onUpdate={onUpdateBattery}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const headerStyle = {
  padding: '15px',
  textAlign: 'left',
  color: '#E0E0E0',
  fontWeight: 'bold',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
};

export default BatteryTable;
