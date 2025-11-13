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
  // Map dữ liệu từ backend
  const id = issue.issueId || issue.id;
  const description = issue.description || 'Không có mô tả';
  const status = issue.status || 'N/A';
  const userId = issue.userId || issue.user_id || 'N/A';
  const stationId = issue.stationId || issue.station_id || 'N/A';
  const time = issue.createdAt || issue.created_at || new Date().toISOString();

  // Format status text
  const getStatusText = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s === 'open') return 'Mới';
    if (s === 'in_progress') return 'Đang xử lý';
    if (s === 'resolved') return 'Đã giải quyết';
    return status;
  };

  return (
    <tr style={{ borderTop: '1px solid #334155' }}>
      <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'white' }}>#{id}</td>
      <td style={{ padding: '15px 20px', maxWidth: '300px', color: '#e2e8f0' }}>{description}</td>
      <td style={{ padding: '15px 20px' }}>
        <span style={getStatusStyle(status)}>{getStatusText(status)}</span>
      </td>
      <td style={{ padding: '15px 20px', color: '#cbd5e1' }}>
        <div>User: {userId}</div>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>Trạm: #{stationId}</div>
      </td>
      <td style={{ padding: '15px 20px', color: '#cbd5e1' }}>
        {new Date(time).toLocaleString('vi-VN')}
      </td>
    </tr>
  );
};

export default IssueRow;