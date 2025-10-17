import React from 'react';

const getStatusStyle = (status) => {
  const s = status ? status.toLowerCase() : '';
  const style = { padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' };
  if (s === 'open' || s === 'mới') return { ...style, background: '#991b1b', color: '#fecaca' };
  if (s === 'in_progress' || s === 'đang xử lý') return { ...style, background: '#9a3412', color: '#fdba74' };
  if (s === 'resolved' || s === 'đã giải quyết') return { ...style, background: '#166534', color: '#86efac' };
  return { ...style, background: '#475569', color: '#cbd5e1' };
};

const IssueRow = ({ issue }) => {
  // Đọc dữ liệu linh hoạt từ API
  const id = issue.id || issue.issueId;
  const description = issue.description || 'Không có mô tả';
  const status = issue.status || 'N/A';
  const user = issue.user_id || issue.reportedBy || 'N/A';
  const time = issue.created_at || issue.time || new Date().toISOString();

  return (
    <tr style={{ borderTop: '1px solid #334155' }}>
      <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'white' }}>{id}</td>
      <td style={{ padding: '15px 20px', maxWidth: '300px' }}>{description}</td>
      <td style={{ padding: '15px 20px' }}>
        <span style={getStatusStyle(status)}>{status}</span>
      </td>
      <td style={{ padding: '15px 20px' }}>{user}</td>
      <td style={{ padding: '15px 20px' }}>{new Date(time).toLocaleString('vi-VN')}</td>
      <td style={{ padding: '15px 20px' }}>
        <button style={{ background: '#334155', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
          Xem chi tiết
        </button>
      </td>
    </tr>
  );
};

export default IssueRow;