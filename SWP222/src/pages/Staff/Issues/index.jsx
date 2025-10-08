// Staff Issues Management - Refactored
import React from 'react';

const StaffIssues = () => {
  const [issues, setIssues] = React.useState([
    { id: 1, title: 'Pin lỗi BAT-001', priority: 'High', status: 'Pending', reporter: 'Nguyễn Văn A', date: '2025-10-06' },
    { id: 2, title: 'Máy đổi pin kẹt', priority: 'Critical', status: 'In Progress', reporter: 'Trần Thị B', date: '2025-10-06' },
    { id: 3, title: 'Màn hình lỗi', priority: 'Medium', status: 'Resolved', reporter: 'Lê Văn C', date: '2025-10-05' }
  ]);

  const [filter, setFilter] = React.useState('all');
  const [showModal, setShowModal] = React.useState(false);
  const [selectedIssue, setSelectedIssue] = React.useState(null);

  const getPriorityColor = (priority) => ({
    'Critical': '#ff4757',
    'High': '#ff6348',
    'Medium': '#ffa500',
    'Low': '#4F8CFF'
  }[priority] || '#999');

  const getStatusColor = (status) => ({
    'Pending': '#ffa500',
    'In Progress': '#4F8CFF',
    'Resolved': '#19c37d',
    'Closed': '#6c757d'
  }[status] || '#999');

  const filteredIssues = filter === 'all' ? issues : issues.filter(i => i.status === filter);

  return (
    <div style={{ padding: '30px', background: '#0f172a', minHeight: '100vh', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h2>🐛 Quản lý sự cố</h2>
        <button
          onClick={() => setShowModal(true)}
          style={{ padding: '12px 24px', background: '#ff4757', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
        >
          + Báo cáo sự cố
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {['all', 'Pending', 'In Progress', 'Resolved'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              background: filter === f ? '#4F8CFF' : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            {f === 'all' ? 'Tất cả' : f}
          </button>
        ))}
      </div>

      {/* Issues List */}
      <div style={{ display: 'grid', gap: '15px' }}>
        {filteredIssues.map(issue => (
          <div
            key={issue.id}
            onClick={() => setSelectedIssue(issue)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{issue.title}</h3>
                <div style={{ fontSize: '14px', color: '#999' }}>
                  📅 {issue.date} | 👤 {issue.reporter}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  background: `${getPriorityColor(issue.priority)}20`,
                  color: getPriorityColor(issue.priority)
                }}>
                  {issue.priority}
                </span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  background: `${getStatusColor(issue.status)}20`,
                  color: getStatusColor(issue.status)
                }}>
                  {issue.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'rgba(26,32,44,0.95)', borderRadius: '12px', padding: '30px', width: '600px', maxWidth: '90vw' }}>
            <h3 style={{ marginTop: 0 }}>{selectedIssue.title}</h3>
            <div style={{ marginBottom: '15px' }}><strong>Độ ưu tiên:</strong> {selectedIssue.priority}</div>
            <div style={{ marginBottom: '15px' }}><strong>Trạng thái:</strong> {selectedIssue.status}</div>
            <div style={{ marginBottom: '15px' }}><strong>Người báo cáo:</strong> {selectedIssue.reporter}</div>
            <div style={{ marginBottom: '20px' }}><strong>Ngày:</strong> {selectedIssue.date}</div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setIssues(prev => prev.map(i => 
                    i.id === selectedIssue.id ? {...i, status: 'In Progress'} : i
                  ));
                  setSelectedIssue(null);
                }}
                style={{ flex: 1, padding: '10px', background: '#4F8CFF', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
              >
                Đang xử lý
              </button>
              <button
                onClick={() => {
                  setIssues(prev => prev.map(i => 
                    i.id === selectedIssue.id ? {...i, status: 'Resolved'} : i
                  ));
                  setSelectedIssue(null);
                }}
                style={{ flex: 1, padding: '10px', background: '#19c37d', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
              >
                Đã giải quyết
              </button>
              <button
                onClick={() => setSelectedIssue(null)}
                style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffIssues;

