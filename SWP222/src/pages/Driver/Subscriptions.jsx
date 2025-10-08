// Driver Subscription Management
// Gói Basic / Plus / Premium
// Subscription plans and management

import React, { useState, useEffect } from 'react';
import contractService from '../../assets/js/services/contractService';
import authService from '../../assets/js/services/authService';
import userService from '../../assets/js/services/userService';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';

const DriverSubscriptions = () => {
  const { currentUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [userContracts, setUserContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching subscription data for user:', currentUser?.email);
      
      if (!currentUser) {
        setError('Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.');
        return;
      }

      const userId = currentUser.id || currentUser.user_id || currentUser.userId;
      if (!userId) {
        setError('Không tìm thấy User ID hợp lệ');
        return;
      }

      // Get available contract plans from API
      console.log('📝 Fetching available contract plans...');
      try {
        const plansResult = await contractService.getContractPlans();
        console.log('📝 Plans API response:', plansResult);
        if (plansResult.success && plansResult.data) {
          setPlans(plansResult.data || []);
        } else {
          console.warn('⚠️ No plans found from API');
          setPlans([]);
        }
      } catch (planError) {
        console.warn('⚠️ Plans API failed:', planError);
        setPlans([]);
      }

      // Get current user contracts/subscriptions
      console.log('📋 Fetching user contracts for userId:', userId);
      try {
        const contractsResponse = await contractService.getContracts(userId);
        console.log('📋 User contracts response:', contractsResponse);
        
        if (contractsResponse.success && contractsResponse.data) {
          const contracts = contractsResponse.data;
          setUserContracts(contracts);
          
          // Find active subscription
          const activeContract = contracts.find(contract => 
            contract.status === 'active' || contract.status === 'Active'
          );
          
          if (activeContract) {
            console.log('✅ Found active contract:', activeContract);
            setCurrentSubscription({
              id: activeContract.contractId || activeContract.id,
              name: activeContract.planName || activeContract.plan || 'Gói dịch vụ',
              contractNumber: activeContract.contractNumber,
              status: activeContract.status,
              monthlyFee: activeContract.monthlyFee || activeContract.monthlyTotalFee,
              startDate: activeContract.startDate,
              endDate: activeContract.endDate,
              vehiclePlate: activeContract.vehiclePlate,
              remaining: activeContract.remainingSwaps || 'Không giới hạn'
            });
          } else {
            console.log('ℹ️ No active contracts found');
            setCurrentSubscription(null);
          }
        } else {
          console.log('ℹ️ No contracts found for user');
          setUserContracts([]);
          setCurrentSubscription(null);
        }
      } catch (contractError) {
        console.warn('⚠️ Contract API failed:', contractError);
        setUserContracts([]);
        setCurrentSubscription(null);
      }

    } catch (err) {
      console.error('❌ Error fetching subscription data:', err);
      setError('Lỗi khi tải dữ liệu gói dịch vụ: ' + err.message);
      setPlans([]);
      setUserContracts([]);
      setCurrentSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!window.confirm(`Bạn có chắc muốn đăng ký gói ${plan.name || plan.planName}?\nGiá: ${formatCurrency(plan.monthlyFee || plan.fee || 0)}`)) {
      return;
    }

    try {
      setLoading(true);
      
      const userId = currentUser.id || currentUser.user_id || currentUser.userId;
      
      console.log('📝 Creating contract for plan:', plan);
      console.log('👤 User ID:', userId);
      
      // Create contract via API
      const result = await contractService.createContract({
        planId: plan.planId || plan.id,
        userId: userId,
        planName: plan.planName || plan.name,
        monthlyFee: plan.monthlyFee || plan.fee
      });

      console.log('📝 Contract creation result:', result);

      if (result.success) {
        alert(`Đăng ký gói ${plan.name || plan.planName} thành công!\nPhí hàng tháng: ${formatCurrency(plan.monthlyFee || plan.fee || 0)}`);
        fetchData(); // Refresh data
      } else {
        alert(result.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      console.error('❌ Error subscribing:', err);
      alert('Có lỗi xảy ra khi đăng ký: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getPlanColor = (planName) => {
    const name = (planName || '').toLowerCase();
    if (name.includes('basic')) return '#19c37d';
    if (name.includes('plus')) return '#6ab7ff';
    if (name.includes('premium')) return '#ffa500';
    return '#9c88ff';
  };

  if (loading) {
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
          onClick={fetchData}
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
    <DashboardLayout role="driver">
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Debug Info */}
        {import.meta.env.VITE_ENABLE_DEBUG === 'true' && (
          <div style={{
            background: 'rgba(255, 165, 0, 0.1)',
            border: '1px solid rgba(255, 165, 0, 0.3)',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            fontSize: '0.9rem',
            color: '#ffa500'
          }}>
            <strong>🔧 Subscriptions Debug Info:</strong><br/>
            User ID: {currentUser?.id || currentUser?.user_id || currentUser?.userId}<br/>
            Available Plans: {plans.length}<br/>
            User Contracts: {userContracts.length}<br/>
            Current Subscription: {currentSubscription ? 'Yes' : 'No'}<br/>
            Plans Data: {plans.length > 0 ? 'Loaded' : 'Empty'}<br/>
            Error: {error || 'None'}<br/>
          </div>
        )}

        {/* Header */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ 
          color: '#FFFFFF', 
          margin: '0 0 15px 0',
          fontSize: '2.5rem',
          background: 'linear-gradient(135deg, #19c37d, #6ab7ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          💎 Gói dịch vụ
        </h1>
        <p style={{ color: '#B0B0B0', margin: 0, fontSize: '1.1rem' }}>
          Chọn gói phù hợp với nhu cầu của bạn
        </p>
      </div>


      {/* Plans Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px',
        marginBottom: '40px'
      }}>
        {plans.map((plan, index) => {
          const planColor = getPlanColor(plan.name || plan.planName);
          const isPopular = index === 1; // Middle plan is popular

          return (
            <div
              key={plan.id}
              style={{
                background: 'rgba(26, 32, 44, 0.8)',
                borderRadius: '25px',
                padding: isPopular ? '40px 30px' : '35px 30px',
                border: isPopular ? `2px solid ${planColor}` : '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                position: 'relative',
                transform: isPopular ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.3s ease',
                boxShadow: isPopular ? `0 20px 60px ${planColor}30` : 'none'
              }}
            >
              {isPopular && (
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: `linear-gradient(135deg, ${planColor}, ${planColor}dd)`,
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  boxShadow: `0 4px 15px ${planColor}40`
                }}>
                  PHỔ BIẾN NHẤT
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '15px',
                  filter: `drop-shadow(0 4px 15px ${planColor}40)`
                }}>
                  {index === 0 ? '⚡' : index === 1 ? '💎' : '👑'}
                </div>
                <h3 style={{ 
                  color: '#FFFFFF', 
                  fontSize: '1.8rem', 
                  margin: '0 0 10px 0',
                  fontWeight: '700'
                }}>
                  {plan.name || plan.planName}
                </h3>
                <p style={{ 
                  color: '#B0B0B0', 
                  margin: '0 0 25px 0',
                  fontSize: '0.95rem',
                  minHeight: '40px'
                }}>
                  {plan.description || 'Gói dịch vụ chất lượng'}
                </p>
                <div style={{ 
                  fontSize: '3rem', 
                  fontWeight: '700', 
                  color: planColor,
                  marginBottom: '5px'
                }}>
                  {formatCurrency(plan.monthlyFee || plan.fee || plan.price || 0)}
                </div>
                <div style={{ color: '#B0B0B0', fontSize: '0.95rem' }}>
                  {plan.monthlyDistance ? `${plan.monthlyDistance} km/tháng` : 
                   plan.swapLimit ? `${plan.swapLimit} lần đổi pin` :
                   plan.duration || 'Theo hợp đồng'}
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: '30px' }}>
                {(plan.features || [
                  'Đổi pin tại mọi trạm',
                  'Hỗ trợ 24/7',
                  'Không phí ẩn'
                ]).map((feature, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                    color: '#E0E0E0',
                    fontSize: '0.95rem'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: `${planColor}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: planColor,
                      fontSize: '0.9rem',
                      fontWeight: '700'
                    }}>
                      ✓
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Subscribe Button */}
              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: loading ? '#666' : `linear-gradient(135deg, ${planColor}, ${planColor}dd)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  transition: 'all 0.3s ease',
                  boxShadow: loading ? 'none' : `0 8px 25px ${planColor}40`
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 12px 35px ${planColor}50`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 8px 25px ${planColor}40`;
                  }
                }}
              >
                {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
              </button>
            </div>
          );
        })}
      </div>

      {plans.length === 0 && !loading && (
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '20px',
          textAlign: 'center',
          padding: '60px 20px',
          color: '#B0B0B0',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '30px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📦</div>
          <div style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#FFFFFF' }}>
            Hiện chưa có gói dịch vụ nào
          </div>
          <div style={{ fontSize: '1rem', marginBottom: '20px' }}>
            Vui lòng liên hệ admin để được hỗ trợ
          </div>
          <button
            onClick={fetchData}
            style={{
              padding: '12px 24px',
              background: '#19c37d',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🔄 Tải lại
          </button>
        </div>
      )}

      {/* FAQ */}
      <div style={{
        background: 'rgba(26, 32, 44, 0.8)',
        borderRadius: '20px',
        padding: '30px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ 
          color: '#FFFFFF', 
          marginBottom: '20px',
          fontSize: '1.3rem'
        }}>
          ❓ Câu hỏi thường gặp
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: '8px' }}>
              Làm sao để thay đổi gói?
            </div>
            <div style={{ color: '#B0B0B0', fontSize: '0.95rem' }}>
              Bạn có thể nâng cấp hoặc hạ cấp gói bất kỳ lúc nào. Phần chênh lệch sẽ được hoàn trả hoặc tính thêm.
            </div>
          </div>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: '8px' }}>
              Gói có tự động gia hạn không?
            </div>
            <div style={{ color: '#B0B0B0', fontSize: '0.95rem' }}>
              Các gói sẽ tự động gia hạn trừ khi bạn hủy trước kỳ thanh toán.
            </div>
          </div>
          <div>
            <div style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: '8px' }}>
              Số lượt đổi pin có tích lũy không?
            </div>
            <div style={{ color: '#B0B0B0', fontSize: '0.95rem' }}>
              Số lượt đổi pin không sử dụng trong tháng sẽ không được chuyển sang tháng tiếp theo.
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default DriverSubscriptions;
