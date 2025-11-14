// Driver/Profile/components/ProfileAvatar.jsx
// Avatar and basic info section

import React from 'react';
import { getRoleBadgeColor, getUserInitials } from '../utils';

export const ProfileAvatar = ({ user, onEdit, isEditing }) => {
  const roleBadge = getRoleBadgeColor(user?.role);
  const initials = getUserInitials(user);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '30px',
      paddingBottom: '30px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '30px'
    }}>
      {/* Avatar Circle */}
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: user?.avatar ? `url(${user.avatar})` : 'linear-gradient(135deg, #19c37d, #6ab7ff)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '3rem',
        fontWeight: '700',
        color: '#FFFFFF',
        boxShadow: '0 10px 30px rgba(25, 195, 125, 0.3)',
        border: '3px solid rgba(255, 255, 255, 0.2)'
      }}>
        {!user?.avatar && initials}
      </div>

      {/* User Info */}
      <div style={{ flex: 1 }}>
        <h2 style={{ 
          color: '#FFFFFF', 
          margin: '0 0 10px 0', 
          fontSize: '1.8rem',
          fontWeight: '600'
        }}>
          {user?.fullName || user?.name || user?.username || 'Driver'}
        </h2>
        <p style={{ color: '#B0B0B0', margin: '0 0 15px 0', fontSize: '1rem' }}>
          {user?.email || 'email@example.com'}
        </p>
        <div style={{
          display: 'inline-block',
          padding: '6px 15px',
          background: roleBadge.bg,
          color: roleBadge.color,
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: '600',
          border: roleBadge.border
        }}>
          {user?.role || 'DRIVER'}
        </div>
      </div>

      {/* Edit Button */}
      {!isEditing && (
        <button
          onClick={onEdit}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #19c37d, #15a36a)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
           Chỉnh sửa
        </button>
      )}
    </div>
  );
};
