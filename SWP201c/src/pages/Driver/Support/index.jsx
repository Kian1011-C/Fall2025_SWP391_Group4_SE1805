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
      alert('✅ Gửi yêu cầu hỗ trợ thành công! Chúng tôi sẽ phản hồi sớm nhất có thể.');
      reset();
    } else {
      const errorMessage = result.error || 'Không thể gửi yêu cầu hỗ trợ';
      
      // Check if it's an API endpoint issue
      if (errorMessage.includes('API endpoint không tồn tại')) {
        alert('⚠️ Chức năng báo cáo đang được phát triển. Vui lòng liên hệ trực tiếp qua hotline: 1900-xxxx');
      } else {
        alert('❌ Có lỗi xảy ra: ' + errorMessage);
      }
    }
  };

  // Handle issue report click
  const handleIssueClick = async (issue) => {
    const userId = currentUser?.id || currentUser?.user_id || currentUser?.userId;
    const reportData = formatIssueReport(issue.type, userId);
    
    console.log('📝 Reporting issue:', reportData);
    
    // Submit the issue report using the API
    const result = await submitTicket(reportData, userId);
    
    if (result.success) {
      alert(`✅ Báo cáo ${issue.title} đã được gửi thành công!`);
    } else {
      const errorMessage = result.error || 'Không thể gửi báo cáo';
      
      // Check if it's an API endpoint issue
      if (errorMessage.includes('API endpoint không tồn tại')) {
        alert(`⚠️ Chức năng báo cáo ${issue.title} đang được phát triển. Vui lòng liên hệ trực tiếp qua hotline: 1900-xxxx`);
      } else {
        alert(`❌ Có lỗi xảy ra khi báo cáo ${issue.title}: ` + errorMessage);
      }
    }
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
