// Driver Support
// Issue reporting
// Customer support and issue reporting

import React, { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const DriverSupport = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Note: Backend cần API POST /api/support/tickets
      alert('Backend cần implement API POST /api/support/tickets để gửi yêu cầu hỗ trợ');
      
      // Reset form
      setFormData({
        subject: '',
        message: '',
        priority: 'normal'
      });
    } catch (err) {
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const faqItems = [
    {
      question: 'Làm sao để đổi pin?',
      answer: 'Vào mục "Đổi pin" trên menu, chọn trạm gần bạn và làm theo hướng dẫn.'
    },
    {
      question: 'Tôi có thể hủy gói dịch vụ không?',
      answer: 'Có, bạn có thể hủy gói bất kỳ lúc nào trong phần "Gói dịch vụ".'
    },
    {
      question: 'Thời gian đổi pin mất bao lâu?',
      answer: 'Quá trình đổi pin thường mất từ 3-5 phút.'
    },
    {
      question: 'Làm sao để liên hệ hỗ trợ khẩn cấp?',
      answer: 'Gọi hotline 1900-xxxx hoặc dùng nút "Hỗ trợ khẩn cấp" trong app.'
    }
  ];

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#FFFFFF', margin: '0 0 10px 0' }}>🎧 Hỗ trợ khách hàng</h1>
        <p style={{ color: '#B0B0B0', margin: 0 }}>Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '10px'
      }}>
        {[
          { id: 'contact', label: '📞 Liên hệ', icon: '📞' },
          { id: 'report', label: '🐛 Báo lỗi', icon: '🐛' },
          { id: 'faq', label: '❓ FAQ', icon: '❓' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #19c37d, #15a36a)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === tab.id ? 'white' : '#B0B0B0',
              border: activeTab === tab.id ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contact Form */}
      {activeTab === 'contact' && (
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#FFFFFF', marginBottom: '20px', fontSize: '1.3rem' }}>
            📧 Gửi yêu cầu hỗ trợ
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '10px' }}>
                Chủ đề
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
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
              <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '10px' }}>
                Mức độ ưu tiên
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontSize: '1rem'
                }}
              >
                <option value="low">Thấp</option>
                <option value="normal">Bình thường</option>
                <option value="high">Cao</option>
                <option value="urgent">Khẩn cấp</option>
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '10px' }}>
                Nội dung
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={6}
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
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px 28px',
                background: loading ? '#666' : 'linear-gradient(135deg, #19c37d, #15a36a)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: loading ? 'none' : '0 4px 15px rgba(25, 195, 125, 0.3)'
              }}
            >
              {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </button>
          </form>
        </div>
      )}

      {/* Report Issue */}
      {activeTab === 'report' && (
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#FFFFFF', marginBottom: '25px', fontSize: '1.3rem' }}>
            🐛 Báo cáo vấn đề
          </h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            {[
              { icon: '🔋', title: 'Lỗi pin', desc: 'Pin không hoạt động đúng', color: '#19c37d' },
              { icon: '🏪', title: 'Lỗi trạm', desc: 'Trạm đổi pin có vấn đề', color: '#6ab7ff' },
              { icon: '💳', title: 'Lỗi thanh toán', desc: 'Vấn đề với thanh toán', color: '#ffa500' },
              { icon: '📱', title: 'Lỗi ứng dụng', desc: 'App không hoạt động', color: '#9c88ff' }
            ].map((issue, index) => (
              <button
                key={index}
                style={{
                  background: `${issue.color}15`,
                  border: `1px solid ${issue.color}30`,
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${issue.color}25`;
                  e.currentTarget.style.borderColor = `${issue.color}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${issue.color}15`;
                  e.currentTarget.style.borderColor = `${issue.color}30`;
                }}
              >
                <div style={{ 
                  fontSize: '2.5rem',
                  padding: '15px',
                  background: `${issue.color}20`,
                  borderRadius: '12px'
                }}>
                  {issue.icon}
                </div>
                <div>
                  <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '600', marginBottom: '5px' }}>
                    {issue.title}
                  </div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.9rem' }}>
                    {issue.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      {activeTab === 'faq' && (
        <div style={{
          background: 'rgba(26, 32, 44, 0.8)',
          borderRadius: '20px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ color: '#FFFFFF', marginBottom: '25px', fontSize: '1.3rem' }}>
            ❓ Câu hỏi thường gặp
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {faqItems.map((item, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div style={{ 
                  color: '#FFFFFF', 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ color: '#19c37d' }}>Q:</span>
                  {item.question}
                </div>
                <div style={{ 
                  color: '#B0B0B0', 
                  fontSize: '0.95rem',
                  paddingLeft: '30px'
                }}>
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Info */}
      <div style={{
        marginTop: '30px',
        background: 'linear-gradient(135deg, rgba(25, 195, 125, 0.1), rgba(106, 183, 255, 0.1))',
        borderRadius: '15px',
        padding: '25px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📞</div>
          <div style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: '5px' }}>Hotline</div>
          <div style={{ color: '#19c37d', fontSize: '1.2rem', fontWeight: '700' }}>1900-xxxx</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📧</div>
          <div style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: '5px' }}>Email</div>
          <div style={{ color: '#6ab7ff', fontSize: '1.1rem' }}>support@evbattery.vn</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏰</div>
          <div style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: '5px' }}>Giờ làm việc</div>
          <div style={{ color: '#B0B0B0', fontSize: '1rem' }}>24/7 - Mọi lúc</div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default DriverSupport;
