import React from 'react';

const SubscriptionRow = ({ plan, onEdit }) => {
  const price = plan.basePrice || plan.monthlyFee || 0;
  const distance = plan.baseDistance || 0;

  return (
    <tr style={{ borderTop: '1px solid #374151' }}>
      <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'white' }}>{plan.planId}</td>
      <td style={{ padding: '15px 20px' }}>{plan.planName}</td>
      <td style={{ padding: '15px 20px' }}>{price.toLocaleString('vi-VN')} ₫</td>
      <td style={{ padding: '15px 20px' }}>
        {plan.isUnlimited ? 'Không giới hạn' : `${distance} km`}
      </td>
      <td style={{ padding: '15px 20px', maxWidth: '300px' }}>{plan.description}</td>
      <td style={{ padding: '15px 20px' }}>
        <button 
          onClick={() => onEdit(plan)} 
          style={{ background: '#374151', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
          Sửa
        </button>
      </td>
    </tr>
  );
};

export default SubscriptionRow;