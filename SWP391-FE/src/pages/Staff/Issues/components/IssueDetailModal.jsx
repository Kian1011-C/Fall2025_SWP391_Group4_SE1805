import React, { useState, useEffect } from 'react';
import { showToast } from '../../../../assets/js/helpers/helpers';
import { API_CONFIG, apiUtils } from '../../../../assets/js/config/api';

const IssueDetailModal = ({ issue, onClose, onUpdate }) => {
  const [issueDetail, setIssueDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Fetch chi tiết sự cố từ API
  useEffect(() => {
    const fetchIssueDetail = async () => {
      setIsLoading(true);
      try {
        const issueId = issue.issueId || issue.id;
        const response = await apiUtils.get(`${API_CONFIG.ENDPOINTS.ISSUES.GET_BY_ID}/${issueId}`);
        
        if (response.success || response.data) {
          const data = response.data || response;
          setIssueDetail(data);
          setNewStatus(data.status || issue.status);
        } else {
          // Fallback to issue prop if API fails
          setIssueDetail(issue);
          setNewStatus(issue.status);
          showToast('Không thể tải chi tiết sự cố từ server', 'warning');
        }
      } catch (error) {
        console.error('Error fetching issue detail:', error);
        // Fallback to issue prop
        setIssueDetail(issue);
        setNewStatus(issue.status);
        showToast('Lỗi khi tải chi tiết sự cố', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIssueDetail();
  }, [issue]);

  // Lock scroll when modal is open
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    };
  }, []);

  const handleUpdateStatus = async () => {
    if (!newStatus || newStatus === (issueDetail?.status || issue.status)) {
      showToast('Vui lòng chọn trạng thái mới', 'warning');
      return;
    }

    setIsUpdating(true);
    try {
      const issueId = issueDetail?.issueId || issueDetail?.id || issue.issueId || issue.id;
      const response = await apiUtils.put(`${API_CONFIG.ENDPOINTS.ISSUES.UPDATE}/${issueId}`, {
        status: newStatus
      });

      if (response.success || response.data) {
        showToast('Cập nhật trạng thái sự cố thành công!', 'success');
        if (onUpdate) {
          onUpdate();
        }
        onClose();
      } else {
        showToast(response.message || 'Không thể cập nhật trạng thái', 'error');
      }
    } catch (error) {
      console.error('Error updating issue status:', error);
      showToast('Lỗi khi cập nhật trạng thái sự cố', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : '';
    const style = { padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', display: 'inline-block' };
    if (s === 'open' || s === 'mới') return { ...style, background: '#991b1b', color: '#fecaca' };
    if (s === 'in_progress' || s === 'đang xử lý') return { ...style, background: '#9a3412', color: '#fdba74' };
    if (s === 'resolved' || s === 'đã giải quyết') return { ...style, background: '#166534', color: '#86efac' };
    return { ...style, background: '#475569', color: '#cbd5e1' };
  };

  const getStatusText = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'open') return 'Mới';
    if (s === 'in_progress') return 'Đang xử lý';
    if (s === 'resolved') return 'Đã giải quyết';
    return status;
  };

  if (!issueDetail && !isLoading) {
    return null;
  }

  const displayData = issueDetail || issue;
  const issueId = displayData.issueId || displayData.id;
  const description = displayData.description || 'Không có mô tả';
  const status = displayData.status || 'N/A';
  const userId = displayData.userId || displayData.user_id || 'N/A';
  const stationId = displayData.stationId || displayData.station_id || 'N/A';
  const createdAt = displayData.createdAt || displayData.created_at;
  const updatedAt = displayData.updatedAt || displayData.updated_at;
  const resolvedAt = displayData.resolvedAt || displayData.resolved_at;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(8px)',
        zIndex: 999999,
        overflow: 'hidden'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(148, 163, 184, 0.2)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '28px', 
            fontWeight: '800',
            background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Chi tiết Sự cố #{issueId}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              background: 'rgba(148, 163, 184, 0.1)',
              color: '#94a3b8',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(239, 68, 68, 0.2)';
              e.target.style.color = '#ef4444';
              e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(148, 163, 184, 0.1)';
              e.target.style.color = '#94a3b8';
              e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
            }}
          >
            ×
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
            <p>Đang tải thông tin sự cố...</p>
          </div>
        ) : (
          <>
            {/* Content */}
            <div style={{ marginBottom: '24px' }}>
              {/* Status */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>
                  Trạng thái
                </label>
                <span style={getStatusStyle(status)}>{getStatusText(status)}</span>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>
                  Mô tả sự cố
                </label>
                <div style={{
                  padding: '16px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  color: '#cbd5e1',
                  lineHeight: '1.6'
                }}>
                  {description}
                </div>
              </div>

              {/* User & Station Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>
                    Người báo cáo
                  </label>
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    color: '#cbd5e1'
                  }}>
                    User: {userId}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>
                    Trạm liên quan
                  </label>
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    color: '#cbd5e1'
                  }}>
                    Trạm #{stationId}
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>
                  Thông tin thời gian
                </label>
                <div style={{
                  padding: '16px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  color: '#cbd5e1'
                }}>
                  {createdAt && (
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#e2e8f0' }}>Thời gian tạo:</strong> {new Date(createdAt).toLocaleString('vi-VN')}
                    </div>
                  )}
                  {updatedAt && (
                    <div style={{ marginBottom: '8px' }}>
                      <strong style={{ color: '#e2e8f0' }}>Cập nhật lần cuối:</strong> {new Date(updatedAt).toLocaleString('vi-VN')}
                    </div>
                  )}
                  {resolvedAt && (
                    <div>
                      <strong style={{ color: '#e2e8f0' }}>Thời gian giải quyết:</strong> {new Date(resolvedAt).toLocaleString('vi-VN')}
                    </div>
                  )}
                </div>
              </div>

              {/* Update Status Section */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>
                  Cập nhật trạng thái
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  disabled={isUpdating}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '2px solid rgba(148, 163, 184, 0.2)',
                    borderRadius: '12px',
                    color: '#E5E7EB',
                    fontSize: '15px',
                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="open">Mới</option>
                  <option value="in_progress">Đang xử lý</option>
                  <option value="resolved">Đã giải quyết</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={isUpdating}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(148, 163, 184, 0.1)',
                  color: '#cbd5e1',
                  border: '2px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isUpdating) {
                    e.target.style.background = 'rgba(148, 163, 184, 0.2)';
                    e.target.style.borderColor = 'rgba(148, 163, 184, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(148, 163, 184, 0.1)';
                  e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                }}
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={isUpdating || newStatus === status}
                style={{
                  padding: '12px 24px',
                  background: isUpdating || newStatus === status ? 'rgba(59, 130, 246, 0.5)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '600',
                  boxShadow: isUpdating || newStatus === status ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.4)',
                  cursor: isUpdating || newStatus === status ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  if (!isUpdating && newStatus !== status) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = isUpdating || newStatus === status ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.4)';
                }}
              >
                {isUpdating ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    Đang cập nhật...
                  </>
                ) : (
                  ' Cập nhật trạng thái'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default IssueDetailModal;
