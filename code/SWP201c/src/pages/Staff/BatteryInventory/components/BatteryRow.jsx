// Staff/BatteryInventory/components/BatteryRow.jsx
import React from 'react';
import { 
  getStatusColor, 
  getHealthColor,
  formatBatteryId,
  formatVoltage,
  formatTemperature,
  formatCapacity
} from '../utils';

const BatteryRow = ({ battery, onUpdate }) => {
  return (
    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
      <td style={cellStyle}>{formatBatteryId(battery.batteryId)}</td>
      <td style={cellStyle}>{battery.stationName}</td>
      <td style={cellStyle}>
        <span style={{
          padding: '5px 10px',
          borderRadius: '6px',
          background: `${getStatusColor(battery.status)}20`,
          color: getStatusColor(battery.status),
          fontSize: '12px'
        }}>
          {battery.status}
        </span>
      </td>
      <td style={cellStyle}>{formatCapacity(battery.capacity)}</td>
      <td style={cellStyle}>
        <span style={{ color: getHealthColor(battery.health) }}>
          {battery.health}%
        </span>
      </td>
      <td style={cellStyle}>{battery.cycles || 0}</td>
      <td style={cellStyle}>{formatTemperature(battery.temperature)}</td>
      <td style={cellStyle}>{formatVoltage(battery.voltage)}</td>
      <td style={cellStyle}>
        <button
          onClick={() => onUpdate(battery)}
          style={{
            padding: '6px 12px',
            background: 'linear-gradient(135deg, #19c37d, #15a36a)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Cập nhật
        </button>
      </td>
    </tr>
  );
};

const cellStyle = {
  padding: '15px',
  color: '#E0E0E0'
};

export default BatteryRow;
