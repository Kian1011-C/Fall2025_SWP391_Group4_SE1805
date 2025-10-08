// Admin Subscription Management
// Manage subscription plans and pricing

import React, { useState, useEffect } from 'react';
import contractService from '../../assets/js/services/contractService';
import DashboardLayout from '../../layouts/DashboardLayout';

const AdminSubscriptions = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    features: []
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await contractService.getContractPlans();
      
      if (result.success) {
        setPlans(result.data || []);
      } else {
        setError(result.message || 'Không thể tải danh sách gói dịch vụ');
      }
    } catch (err) {
      setError('Lỗi khi tải danh sách gói dịch vụ');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingPlan) {
        // Update existing plan
        const result = await contractService.updateContract(editingPlan.id, formData);
        if (result.success) {
          alert('Cập nhật gói dịch vụ thành công!');
          fetchPlans();
          resetForm();
        } else {
          alert(result.message || 'Cập nhật thất bại');
        }
      } else {
        // Create new plan (Note: Backend cần endpoint POST /api/subscriptions/plans)
        alert('Backend cần implement endpoint POST /api/subscriptions/plans để tạo gói mới');
      }
    } catch (err) {
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('Bạn có chắc muốn xóa gói dịch vụ này?')) return;
    
    try {
      setLoading(true);
      // Note: Backend cần endpoint DELETE /api/subscriptions/plans/:id
      alert('Backend cần implement endpoint DELETE /api/subscriptions/plans/:id');
    } catch (err) {
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      features: []
    });
    setEditingPlan(null);
    setShowAddModal(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading && plans.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#19c37d', fontSize: '1.5rem' }}>⏳ Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#ff6b6b', fontSize: '1.2rem' }}>⚠️ {error}</div>
        <button 
          onClick={fetchPlans}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#19c37d',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px' 
      }}>
        <div>
          <h1 style={{ color: '#FFFFFF', margin: '0 0 10px 0' }}>💎 Quản lý gói dịch vụ</h1>
          <p style={{ color: '#B0B0B0', margin: 0 }}>Quản lý gói subscription và giá cả</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #19c37d, #15a36a)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600',
            boxShadow: '0 4px 15px rgba(25, 195, 125, 0.3)'
          }}
        >
          + Thêm gói mới
        </button>
      </div>

      {/* Plans Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '25px'
      }}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: 'rgba(26, 32, 44, 0.8)',
              borderRadius: '20px',
              padding: '30px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                color: '#FFFFFF', 
                fontSize: '1.5rem', 
                margin: '0 0 10px 0' 
              }}>
                {plan.name || plan.planName}
              </h3>
              <p style={{ color: '#B0B0B0', margin: '0 0 20px 0', fontSize: '0.9rem' }}>
                {plan.description}
              </p>
              <div style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                color: '#19c37d',
                marginBottom: '5px'
              }}>
                {formatCurrency(plan.price)}
              </div>
              <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                {plan.duration || plan.swapLimit} lần đổi pin
              </div>
            </div>

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
                    <span style={{ color: '#19c37d' }}>✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <button
                onClick={() => {
                  setEditingPlan(plan);
                  setFormData({
                    name: plan.name || plan.planName,
                    description: plan.description,
                    price: plan.price,
                    duration: plan.duration || plan.swapLimit,
                    features: plan.features || []
                  });
                  setShowAddModal(true);
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'linear-gradient(135deg, #6ab7ff, #4a9eff)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                Chỉnh sửa
              </button>
              <button
                onClick={() => handleDelete(plan.id)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#B0B0B0'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📦</div>
          <div style={{ fontSize: '1.2rem' }}>Chưa có gói dịch vụ nào</div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#1a202c',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{ color: '#FFFFFF', marginBottom: '20px' }}>
              {editingPlan ? 'Chỉnh sửa gói dịch vụ' : 'Thêm gói dịch vụ mới'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
                  Tên gói
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
                  Mô tả
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
                    Giá (VND)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '8px' }}>
                    Số lần đổi
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#FFFFFF',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: loading ? '#666' : 'linear-gradient(135deg, #19c37d, #15a36a)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600'
                  }}
                >
                  {loading ? 'Đang xử lý...' : editingPlan ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default AdminSubscriptions;