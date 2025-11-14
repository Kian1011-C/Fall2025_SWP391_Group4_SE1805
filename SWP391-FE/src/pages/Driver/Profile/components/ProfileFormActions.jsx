// Driver/Profile/components/ProfileFormActions.jsx
// Action buttons for profile form (Save/Cancel)

import React from 'react';

export const ProfileFormActions = ({ onSave, onCancel, isSaving }) => {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '15px', 
      marginTop: '30px',
      paddingTop: '25px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <button
        type="button"
        onClick={onCancel}
        disabled={isSaving}
        style={{
          flex: 1,
          padding: '14px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '10px',
          color: '#FFFFFF',
          cursor: isSaving ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          opacity: isSaving ? 0.5 : 1
        }}
      >
         Hủy
      </button>
      
      <button
        type="submit"
        onClick={onSave}
        disabled={isSaving}
        style={{
          flex: 1,
          padding: '14px',
          background: isSaving 
            ? 'rgba(25, 195, 125, 0.5)'
            : 'linear-gradient(135deg, #19c37d, #15a36a)',
          border: 'none',
          borderRadius: '10px',
          color: '#FFFFFF',
          cursor: isSaving ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          boxShadow: isSaving 
            ? 'none' 
            : '0 4px 15px rgba(25, 195, 125, 0.3)'
        }}
      >
        {isSaving ? '⏳ Đang lưu...' : ' Lưu thay đổi'}
      </button>
    </div>
  );
};
