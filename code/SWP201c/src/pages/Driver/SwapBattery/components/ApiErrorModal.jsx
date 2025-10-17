import React from 'react';
import './ApiErrorModal.css';

const ApiErrorModal = ({ isOpen, onClose, error, onRetry }) => {
  if (!isOpen) return null;

  const getErrorIcon = (errorType) => {
    switch (errorType) {
      case 'CORS':
        return '🌐';
      case '404':
        return '🔍';
      case '405':
        return '⚠️';
      default:
        return '❌';
    }
  };

  const getErrorTitle = (errorType) => {
    switch (errorType) {
      case 'CORS':
        return 'Lỗi Kết Nối';
      case '404':
        return 'API Không Tồn Tại';
      case '405':
        return 'Phương Thức Không Hợp Lệ';
      default:
        return 'Lỗi Hệ Thống';
    }
  };

  const getErrorDescription = (errorType) => {
    switch (errorType) {
      case 'CORS':
        return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.';
      case '404':
        return 'API endpoint không tồn tại. Vui lòng liên hệ quản trị viên để được hỗ trợ.';
      case '405':
        return 'Phương thức API không được hỗ trợ. Vui lòng liên hệ quản trị viên để được hỗ trợ.';
      default:
        return 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.';
    }
  };

  return (
    <div className="api-error-modal-overlay">
      <div className="api-error-modal">
        <div className="api-error-modal-header">
          <div className="api-error-icon">
            {getErrorIcon(error?.errorType)}
          </div>
          <h3 className="api-error-title">
            {getErrorTitle(error?.errorType)}
          </h3>
        </div>
        
        <div className="api-error-modal-body">
          <p className="api-error-description">
            {getErrorDescription(error?.errorType)}
          </p>
          
          {error?.message && (
            <div className="api-error-details">
              <strong>Chi tiết lỗi:</strong>
              <code>{error.message}</code>
            </div>
          )}
        </div>
        
        <div className="api-error-modal-footer">
          <button 
            className="api-error-btn api-error-btn-secondary"
            onClick={onClose}
          >
            Đóng
          </button>
          {onRetry && (
            <button 
              className="api-error-btn api-error-btn-primary"
              onClick={onRetry}
            >
              Thử Lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiErrorModal;
