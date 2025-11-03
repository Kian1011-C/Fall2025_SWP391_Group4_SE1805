// Driver/Support/index.jsx
// Container component for Support page - orchestrates tabs and forms

import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useSupportForm, useSupportSubmit } from './hooks';
import { formatIssueReport } from './utils';
import supportService from '../../../assets/js/services/supportService.js';
import {
  SupportHeader,
  SupportTabs,
  ContactForm,
  IssueReportGrid,
  FAQList,
  ContactInfo
} from './components';

const Support = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('contact');
  
  // Form management
  const { formData, errors, updateField, validate, reset } = useSupportForm();
  
  // Submission handling
  const { submitTicket, loading } = useSupportSubmit();
  const [issues, setIssues] = useState([]);
  const [issuesError, setIssuesError] = useState(null);

  // Handle contact form submission
  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    const userId = currentUser?.id || currentUser?.user_id || currentUser?.userId;
    const result = await submitTicket(formData, userId);

    if (result.success) {
      reset();
    }
  };

  // Handle issue report click
  const handleIssueClick = async (issue) => {
    const userId = currentUser?.id || currentUser?.user_id || currentUser?.userId;
    const reportData = formatIssueReport(issue.type, userId);
    
    console.log('📝 Reporting issue:', reportData);
    
    // Note: Backend cần API POST /api/support/tickets
    alert(`Báo cáo ${issue.title}\n\nBackend cần implement API POST /api/support/tickets`);
  };

  // Load user's issues list
  useEffect(() => {
    const userId = currentUser?.id || currentUser?.user_id || currentUser?.userId;
    if (!userId) return;
    (async () => {
      const res = await supportService.listUserIssues({ userId, role: 'EV Driver' });
      if (res.success) setIssues(res.data);
      else setIssuesError(res.message);
    })();
  }, [currentUser]);

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <SupportHeader />

        {/* Tabs */}
        <SupportTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'contact' && (
          <ContactForm
            formData={formData}
            onFieldChange={updateField}
            onSubmit={handleSubmit}
            loading={loading}
            errors={errors}
          />
        )}

        {activeTab === 'report' && (
          <IssueReportGrid onIssueClick={handleIssueClick} />
        )}

        {activeTab === 'faq' && (
          <FAQList />
        )}

        {/* Contact Info (always visible) */}
        <ContactInfo />

        {/* User Issues List */}
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#FFFFFF', marginBottom: '12px' }}>Yêu cầu đã gửi</h3>
          {issuesError && (
            <div style={{ color: '#ff6b6b', marginBottom: '10px' }}>{issuesError}</div>
          )}
          {issues.length === 0 ? (
            <div style={{ color: '#9ca3af' }}>Chưa có yêu cầu nào.</div>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {issues.map((it) => (
                <div key={it.issueId || it.id}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '12px'
                  }}
                >
                  <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{it.title || `Vấn đề #${it.issueId || it.id}`}</div>
                  <div style={{ color: '#B0B0B0', fontSize: '0.9rem', marginTop: '4px' }}>{it.description}</div>
                  <div style={{ color: '#9c88ff', fontSize: '0.85rem', marginTop: '6px' }}>
                    Trạng thái: {it.status}
                  </div>
                  <div style={{ color: '#6ab7ff', fontSize: '0.85rem' }}>
                    Trạm: {it.stationId ?? 'N/A'} • {new Date(it.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support;
