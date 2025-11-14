// Driver/Contracts/components/EmptyContracts.jsx
// Empty state component when no contracts exist

import { useNavigate } from 'react-router-dom';

const EmptyContracts = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '1.5rem'
      }}>
        
      </div>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '0.75rem'
      }}>
        Chưa có hợp đồng nào
      </h3>
      <p style={{
        fontSize: '1rem',
        color: '#666',
        marginBottom: '2rem',
        maxWidth: '500px',
        margin: '0 auto 2rem'
      }}>
        Bạn chưa đăng ký gói dịch vụ nào. Hãy xem và chọn gói phù hợp với nhu cầu của bạn.
      </p>
      <button
        onClick={() => navigate('/driver/subscriptions')}
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          fontWeight: '600',
          color: '#fff',
          backgroundColor: '#9c88ff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#8c78ef';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#9c88ff';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        Xem gói dịch vụ
      </button>
    </div>
  );
};

export default EmptyContracts;
