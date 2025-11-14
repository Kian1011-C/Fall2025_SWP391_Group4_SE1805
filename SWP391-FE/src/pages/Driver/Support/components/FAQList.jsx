// Driver/Support/components/FAQList.jsx
// Frequently asked questions list

import { getFAQItems } from '../utils';

const FAQList = () => {
  const faqItems = getFAQItems();

  return (
    <div style={{
      background: 'rgba(26, 32, 44, 0.8)',
      borderRadius: '20px',
      padding: '30px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h3 style={{ color: '#FFFFFF', marginBottom: '25px', fontSize: '1.3rem' }}>
         Câu hỏi thường gặp
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {faqItems.map((item, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(25, 195, 125, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
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
              paddingLeft: '30px',
              lineHeight: '1.6'
            }}>
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQList;
