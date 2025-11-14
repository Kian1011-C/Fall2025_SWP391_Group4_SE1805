// Admin/Dashboard/components/ActivityTimeline.jsx
// Recent activity timeline

import React from 'react';

const ActivityTimeline = ({ stats }) => {
  const activities = [
    {
      icon: '',
      type: 'user',
      title: 'Người dùng mới đăng ký',
      description: 'Nguyễn Văn A đã đăng ký tài khoản',
      time: '5 phút trước',
      color: '#3b82f6'
    },
    {
      icon: '',
      type: 'swap',
      title: 'Đổi pin thành công',
      description: 'Xe 29A-12345 đã đổi pin tại Trạm Cầu Giấy',
      time: '12 phút trước',
      color: '#10b981'
    },
    {
      icon: '',
      type: 'payment',
      title: 'Thanh toán thành công',
      description: 'Giao dịch 2,500,000₫ từ Trần Thị B',
      time: '25 phút trước',
      color: '#f59e0b'
    },
    {
      icon: '',
      type: 'alert',
      title: 'Cảnh báo bảo trì',
      description: 'Pin #125 cần kiểm tra định kỳ',
      time: '1 giờ trước',
      color: '#ef4444'
    },
    {
      icon: '',
      type: 'station',
      title: 'Trạm mới kích hoạt',
      description: 'Trạm Thanh Xuân đã bắt đầu hoạt động',
      time: '2 giờ trước',
      color: '#8b5cf6'
    },
    {
      icon: '',
      type: 'report',
      title: 'Báo cáo đã tạo',
      description: 'Báo cáo doanh thu tháng 11/2025',
      time: '3 giờ trước',
      color: '#06b6d4'
    },
    {
      icon: '',
      type: 'user',
      title: 'Hợp đồng mới',
      description: 'Lê Văn C đã ký hợp đồng gói Premium',
      time: '4 giờ trước',
      color: '#ec4899'
    },
    {
      icon: '',
      type: 'system',
      title: 'Cập nhật hệ thống',
      description: 'Phiên bản 2.1.5 đã được cài đặt',
      time: '5 giờ trước',
      color: '#14b8a6'
    }
  ];

  return (
    <div className="activity-timeline">
      <h2>Hoạt động Gần đây</h2>
      <div className="timeline">
        {activities.map((activity, index) => (
          <div key={index} className="timeline-item">
            <div className="timeline-dot" style={{ backgroundColor: activity.color }}>
              <span>{activity.icon}</span>
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-title">{activity.title}</span>
                <span className="timeline-time">{activity.time}</span>
              </div>
              <div className="timeline-description">{activity.description}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="view-all-button">
        Xem tất cả hoạt động →
      </button>
    </div>
  );
};

export default ActivityTimeline;
