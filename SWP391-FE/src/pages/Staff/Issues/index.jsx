import React from 'react';
import { FiAlertTriangle, FiRefreshCw, FiFilter } from 'react-icons/fi';
import { useIssueData } from './hooks/useIssueData';
import IssueRow from './components/IssueRow';

const StaffIssues = () => {
  const { issues, isLoading, error, refetch } = useIssueData();

  const renderContent = () => {
    if (isLoading) return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Đang tải danh sách sự cố...</p>;
    if (error) return (
      <div style={{ color: '#ef4444', textAlign: 'center' }}>
        <p>Lỗi: {error}</p>
        <button onClick={() => refetch()} style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '10px auto' }}>
          <FiRefreshCw size={18} /> Thử lại
        </button>
      </div>
    );
    if (issues.length === 0) return <p style={{ color: '#94a3b8', textAlign: 'center' }}>Không có sự cố nào được báo cáo.</p>;

    return (
      <div style={{ background: '#1e293b', borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#334155' }}>
              <th style={{ padding: '15px 20px' }}>Mã Sự cố</th>
              <th style={{ padding: '15px 20px' }}>Mô tả</th>
              <th style={{ padding: '15px 20px' }}>Trạng thái</th>
              <th style={{ padding: '15px 20px' }}>Người báo cáo</th>
              <th style={{ padding: '15px 20px' }}>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {issues.map(issue => (
              <IssueRow 
                key={issue.id || issue.issueId} 
                issue={issue}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
            <h1 style={{ margin: 0, fontSize: '28px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiAlertTriangle size={32} /> Quản lý Sự cố
            </h1>
            <p style={{ margin: '5px 0 0 0', color: '#94a3b8' }}>Theo dõi và xử lý các sự cố được báo cáo từ hệ thống và tài xế.</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <FiFilter style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none', zIndex: 1 }} size={18} />
            <select onChange={(e) => refetch({ status: e.target.value })} style={{ background: '#334155', color: 'white', border: '1px solid #475569', padding: '10px 10px 10px 40px', borderRadius: '8px' }}>
            <option value="">Tất cả trạng thái</option>
            <option value="open">Mới</option>
            <option value="in_progress">Đang xử lý</option>
            <option value="resolved">Đã giải quyết</option>
            </select>
          </div>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default StaffIssues;