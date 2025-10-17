// Driver/Support/components/ContactForm.jsx
// Contact/support ticket submission form

import PropTypes from 'prop-types';
import { getPriorityOptions } from '../utils';

const ContactForm = ({ formData, onFieldChange, onSubmit, loading, errors }) => {
  const priorityOptions = getPriorityOptions();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
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
        {/* Subject Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '10px' }}>
            Chủ đề
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => onFieldChange('subject', e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: errors.subject 
                ? '1px solid #ff6b6b' 
                : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '1rem'
            }}
          />
          {errors.subject && (
            <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '5px' }}>
              {errors.subject}
            </div>
          )}
        </div>

        {/* Priority Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '10px' }}>
            Mức độ ưu tiên
          </label>
          <select
            value={formData.priority}
            onChange={(e) => onFieldChange('priority', e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            {priorityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Message Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#E0E0E0', display: 'block', marginBottom: '10px' }}>
            Nội dung
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => onFieldChange('message', e.target.value)}
            required
            rows={6}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: errors.message 
                ? '1px solid #ff6b6b' 
                : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '1rem',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          {errors.message && (
            <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '5px' }}>
              {errors.message}
            </div>
          )}
        </div>

        {/* Submit Button */}
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
            boxShadow: loading ? 'none' : '0 4px 15px rgba(25, 195, 125, 0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(25, 195, 125, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(25, 195, 125, 0.3)';
            }
          }}
        >
          {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
        </button>
      </form>
    </div>
  );
};

ContactForm.propTypes = {
  formData: PropTypes.shape({
    subject: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object
};

ContactForm.defaultProps = {
  errors: {}
};

export default ContactForm;
