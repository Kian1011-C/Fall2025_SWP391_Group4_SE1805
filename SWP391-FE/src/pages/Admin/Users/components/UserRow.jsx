import React from 'react';

const getStatusStyle = (status) => (status === 'active' ? { color: '#10b981' } : { color: '#ef4444' });
const getRoleStyle = (role) => {
  const s = role ? role.toLowerCase() : '';
  const style = { padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
  if (s === 'admin') return { ...style, background: '#f59e0b', color: '#111827' };
  if (s === 'staff') return { ...style, background: '#3b82f6', color: 'white' };
  return { ...style, background: '#4b5563', color: 'white' };
};

const UserRow = ({ user, onEdit, onDelete }) => {
  return (
    <tr style={{ borderTop: '1px solid #374151' }}>
      <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'white' }}>{user.userId}</td>
      <td style={{ padding: '15px 20px' }}>{user.lastName} {user.firstName}</td>
      <td style={{ padding: '15px 20px' }}>{user.email}</td>
      <td style={{ padding: '15px 20px' }}>
        <span style={getRoleStyle(user.role)}>
          {user.role}
        </span>
      </td>
      <td style={{ padding: '15px 20px' }}>
        <span style={getStatusStyle(user.status)}>{user.status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa'}</span>
      </td>
      <td style={{ padding: '15px 20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => onEdit(user)} 
          style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
           Sửa
        </button>
        <button 
          onClick={() => onDelete(user.userId)} 
          style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
           Xóa
        </button>
      </td>
    </tr>
  );
};

export default UserRow;