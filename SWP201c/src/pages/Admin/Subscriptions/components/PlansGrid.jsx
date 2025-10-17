// Admin/Subscriptions/components/PlansGrid.jsx
// Grid layout for subscription plan cards

import React from 'react';
import { PlanCard } from './PlanCard';

export const PlansGrid = ({ plans, onEditPlan, onDeletePlan }) => {
  if (!plans || plans.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#B0B0B0'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📦</div>
        <div style={{ fontSize: '1.2rem' }}>Chưa có gói dịch vụ nào</div>
        <div style={{ fontSize: '0.9rem', marginTop: '10px' }}>
          Nhấn nút "Thêm gói mới" để tạo gói dịch vụ đầu tiên
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '25px'
    }}>
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onEdit={onEditPlan}
          onDelete={onDeletePlan}
        />
      ))}
    </div>
  );
};
