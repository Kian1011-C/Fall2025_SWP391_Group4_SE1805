// Driver/Subscriptions/components/FAQSection.jsx
// Frequently Asked Questions section

import { getFAQItems } from '../utils';

const FAQSection = () => {
  const faqItems = getFAQItems();

  return (
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
        {faqItems.map((item, index) => (
          <div key={index}>
            <div style={{ color: '#FFFFFF', fontWeight: '600', marginBottom: '8px' }}>
              {item.question}
            </div>
            <div style={{ color: '#B0B0B0', fontSize: '0.95rem' }}>
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
