import React, { useState } from 'react';
import { useSubscriptionsData } from './hooks/useSubscriptionsData';
import SubscriptionRow from './components/SubscriptionRow';
import SubscriptionFormModal from './components/SubscriptionFormModal';

const AdminSubscriptions = () => {
  const { plans, isLoading, error, refetch, handleCreate, handleUpdate } = useSubscriptionsData();
  
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
      handleCloseModal();
    } else {
      alert(response.message); // Hiển thị lỗi
    }
  };

  const renderContent = () => {
    if (isLoading) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Đang tải danh sách gói cước...</p>;
    if (error) return ( <div style={{ color: '#ef4444', textAlign: 'center' }}><p>Lỗi: {error}</p><button onClick={refetch}>Thử lại</button></div> );
    if (plans.length === 0) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Không tìm thấy gói cước nào.</p>;

    return (
      <div style={{ background: '#1f2937', borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#374151' }}>
              <th style={{ padding: '15px 20px' }}>ID</th>
              <th style={{ padding: '15px 20px' }}>Tên Gói cước</th>
              <th style={{ padding: '15px 20px' }}>Phí (VNĐ)</th>
              <th style={{ padding: '15px 20px' }}>Quãng đường</th>
              <th style={{ padding: '15px 20px' }}>Mô tả</th>
              <th style={{ padding: '15px 20px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => <SubscriptionRow key={plan.planId} plan={plan} onEdit={handleOpenEditModal} />)}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px' }}>Quản lý Gói cước</h1>
            <p style={{ margin: '5px 0 0 0', color: '#9ca3af' }}>Tạo, sửa và quản lý các gói cước dịch vụ.</p>
          </div>
          <button onClick={handleOpenCreateModal} style={{ background: '#f59e0b', color: '#111827', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Thêm Gói cước
          </button>
        </div>
        {renderContent()}
      </div>
      <SubscriptionFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        plan={editingPlan}
      />
    </>
  );
};

export default AdminSubscriptions;