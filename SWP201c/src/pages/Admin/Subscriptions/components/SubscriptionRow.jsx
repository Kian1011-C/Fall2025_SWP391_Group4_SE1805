import React from 'react';

const SubscriptionRow = ({ plan, onEdit, onDelete }) => {
  const price = plan.basePrice || plan.monthlyFee || 0;
  const distance = plan.baseDistance || 0;
  const isUnlimited = plan.isUnlimited || distance === -1;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn xóa gói cước "${plan.planName}"?\n\nGói cước sẽ bị vô hiệu hóa và không thể khôi phục.`)) {
      onDelete(plan.planId);
    }
  };

  return (
    <tr>
      <td className="subscription-id">{plan.planId}</td>
      <td className="subscription-name">{plan.planName}</td>
      <td className="subscription-price">{price.toLocaleString('vi-VN')} ₫</td>
      <td>
        <span className={`subscription-distance ${isUnlimited ? 'unlimited' : ''}`}>
          {isUnlimited ? '♾️ Không giới hạn' : `🛣️ ${distance} km`}
        </span>
      </td>
      <td className="subscription-description">{plan.description || 'Không có mô tả'}</td>
      <td>
        <div className="subscription-actions">
          <button 
            onClick={() => onEdit(plan)} 
            className="subscription-btn subscription-btn-edit"
            title="Chỉnh sửa gói cước"
          >
            <span>✏️</span>
            <span>Sửa</span>
          </button>
          <button 
            onClick={handleDelete}
            className="subscription-btn subscription-btn-delete"
            title="Xóa gói cước"
          >
            <span>🗑️</span>
            <span>Xóa</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SubscriptionRow;