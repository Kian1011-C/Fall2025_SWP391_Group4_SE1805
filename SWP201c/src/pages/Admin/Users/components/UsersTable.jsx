// Admin/Users/components/UsersTable.jsx
// Main table component displaying users

import React from 'react';
import { getRoleLabel, getRoleColor, getStatusColor, getStatusLabel } from '../utils';

export const UsersTable = ({ 
  users, 
  loading, 
  error, 
  onToggleStatus, 
  onDelete 
}) => {
  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: '#FFFFFF' 
      }}>
        <h2>Đang tải dữ liệu người dùng...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center', 
        color: '#ff6b6b' 
      }}>
        <h2>Lỗi: {error}</h2>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '12px',
        padding: '40px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👥</div>
        <h3 style={{ color: '#FFFFFF', marginBottom: '10px' }}>
          Không tìm thấy người dùng
        </h3>
        <p style={{ color: '#B0B0B0' }}>
          Thử thay đổi bộ lọc hoặc tìm kiếm
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <th style={{ 
              padding: '15px', 
              textAlign: 'left', 
              color: '#FFFFFF', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              Người dùng
            </th>
            <th style={{ 
              padding: '15px', 
              textAlign: 'left', 
              color: '#FFFFFF', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              Liên hệ
            </th>
            <th style={{ 
              padding: '15px', 
              textAlign: 'left', 
              color: '#FFFFFF', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              Vai trò
            </th>
            <th style={{ 
              padding: '15px', 
              textAlign: 'left', 
              color: '#FFFFFF', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              Trạng thái
            </th>
            <th style={{ 
              padding: '15px', 
              textAlign: 'left', 
              color: '#FFFFFF', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              Ngày tham gia
            </th>
            <th style={{ 
              padding: '15px', 
              textAlign: 'left', 
              color: '#FFFFFF', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)' 
            }}>
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr 
              key={user.id} 
              style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
            >
              <td style={{ padding: '15px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px' 
                }}>
                  <span style={{ fontSize: '2rem' }}>{user.avatar || '👤'}</span>
                  <div>
                    <div style={{ color: '#FFFFFF', fontWeight: '500' }}>
                      {user.name}
                    </div>
                    <div style={{ color: '#B0B0B0', fontSize: '0.8rem' }}>
                      ID: {user.id}
                    </div>
                  </div>
                </div>
              </td>
              <td style={{ padding: '15px' }}>
                <div style={{ color: '#FFFFFF' }}>{user.email}</div>
                <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                  {user.phone}
                </div>
              </td>
              <td style={{ padding: '15px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: getRoleColor(user.role),
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {getRoleLabel(user.role)}
                </span>
              </td>
              <td style={{ padding: '15px' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  backgroundColor: getStatusColor(user.status),
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {getStatusLabel(user.status)}
                </span>
              </td>
              <td style={{ padding: '15px', color: '#E0E0E0' }}>
                {user.joinDate}
              </td>
              <td style={{ padding: '15px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onToggleStatus(user.id)}
                    style={{
                      padding: '6px 12px',
                      background: user.status === 'active' ? '#f39c12' : '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                    title={user.status === 'active' ? 'Tắt' : 'Bật'}
                  >
                    {user.status === 'active' ? '⏸️' : '▶️'}
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    style={{
                      padding: '6px 12px',
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                    title="Xóa"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
