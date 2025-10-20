// Admin/Subscriptions/components/PlanCard.jsx
// Individual subscription plan card component

import React from 'react';
import { formatCurrency, getPlanName, getPlanDuration } from '../utils';

export const PlanCard = ({ plan, onEdit, onDelete }) => {
  return (
    <div
      style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(25, 195, 125, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Plan Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          color: '#FFFFFF', 
          fontSize: '1.5rem', 
          margin: '0 0 10px 0' 
        }}>
          {getPlanName(plan)}
        </h3>
        <p style={{ 
          color: '#B0B0B0', 
          margin: '0 0 20px 0', 
          fontSize: '0.9rem',
          minHeight: '40px'
        }}>
          {plan.description || 'Không có mô tả'}
        </p>
        
        {/* Price */}
        <div style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          color: '#19c37d',
          marginBottom: '5px'
        }}>
          {formatCurrency(plan.price)}
        </div>
        
        {/* Duration */}
        <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
          {getPlanDuration(plan)} lần đổi pin
        </div>
      </div>

      {/* Features */}
      {plan.features && plan.features.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          {plan.features.map((feature, idx) => (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
              color: '#E0E0E0',
              fontSize: '0.9rem'
            }}>
              <span style={{ color: '#19c37d', fontWeight: 'bold' }}>✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginTop: '20px',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <button
          onClick={() => onEdit(plan)}
          style={{
            flex: 1,
            padding: '10px',
            background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Chỉnh sửa
        </button>
        <button
          onClick={() => onDelete(plan.id)}
          style={{
            flex: 1,
            padding: '10px',
            background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Xóa
        </button>
      </div>
    </div>
  );
};
