// Driver/Support/index.jsx
// Container component for Support page - orchestrates tabs and forms

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { useSupportForm, useSupportSubmit } from './hooks';
import { formatIssueReport } from './utils';
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
      </div>
    </DashboardLayout>
  );
};

export default Support;
