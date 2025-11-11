// Driver/Support/components/ContactInfo.jsx
// Contact information display

import { getContactInfo } from '../utils';

const ContactInfo = () => {
  const contactInfo = getContactInfo();

  return (
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
      {contactInfo.map((info, index) => (
        <div key={index} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{info.icon}</div>
          <div style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: '5px' }}>
            {info.label}
          </div>
          <div style={{ 
            color: info.color, 
            fontSize: info.type === 'phone' ? '1.2rem' : '1.1rem',
            fontWeight: info.type === 'phone' ? '700' : 'normal'
          }}>
            {info.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactInfo;
