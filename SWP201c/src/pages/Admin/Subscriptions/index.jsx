import React, { useState } from 'react';
import { useSubscriptionsData } from './hooks/useSubscriptionsData';
import SubscriptionRow from './components/SubscriptionRow';
import SubscriptionFormModal from './components/SubscriptionFormModal';
import '../../../assets/css/AdminSubscriptions.css';

const AdminSubscriptions = () => {
  const { plans, isLoading, error, refetch, handleCreate, handleUpdate, handleDelete } = useSubscriptionsData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const handleOpenCreateModal = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (plan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleSave = async (formData, planId) => {
    let response;
    if (planId) {
      response = await handleUpdate(planId, formData);
    } else {
      response = await handleCreate(formData);
    }
    
    if (response.success) {
      alert(response.message || 'Thao tác thành công!');
      handleCloseModal();
    } else {
      alert(`Lỗi: ${response.message}`);
    }
  };

  const handleDeletePlan = async (planId) => {
    const response = await handleDelete(planId);
    if (response.success) {
      alert(response.message || 'Xóa gói cước thành công!');
    } else {
      alert(`Lỗi: ${response.message}`);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="subscriptions-loading">
          <div className="subscriptions-loading-spinner"></div>
          <p>Đang tải danh sách gói cước...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="subscriptions-error">
          <p>⚠️ Lỗi: {error}</p>
          <button onClick={refetch}>🔄 Thử lại</button>
        </div>
      );
    }
    
    if (plans.length === 0) {
      return (
        <div className="subscriptions-empty">
          <div className="subscriptions-empty-icon">📦</div>
          <p>Không tìm thấy gói cước nào</p>
        </div>
      );
    }

    return (
      <div className="subscriptions-table-container">
        <table className="subscriptions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên Gói cước</th>
              <th>Phí cơ bản</th>
              <th>Quãng đường</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <SubscriptionRow 
                key={plan.planId} 
                plan={plan} 
                onEdit={handleOpenEditModal}
                onDelete={handleDeletePlan}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="subscriptions-container">
      <div className="subscriptions-header">
        <div className="subscriptions-header-left">
          <h1>⚡ Quản lý Gói cước</h1>
          <p>Tạo, sửa và quản lý các gói cước dịch vụ cho khách hàng</p>
        </div>
        <button onClick={handleOpenCreateModal} className="subscriptions-add-btn">
          ➕ Thêm Gói cước
        </button>
      </div>
      
      {renderContent()}
      
      <SubscriptionFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        plan={editingPlan}
      />
    </div>
  );
};

export default AdminSubscriptions;