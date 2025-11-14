// Driver/Subscriptions/components/SubscriptionsHeader.jsx
// Header section for subscriptions page

const SubscriptionsHeader = () => {
  return (
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
         Gói dịch vụ
      </h1>
      <p style={{ color: '#B0B0B0', margin: 0, fontSize: '1.1rem' }}>
        Chọn gói phù hợp với nhu cầu của bạn
      </p>
    </div>
  );
};

export default SubscriptionsHeader;
