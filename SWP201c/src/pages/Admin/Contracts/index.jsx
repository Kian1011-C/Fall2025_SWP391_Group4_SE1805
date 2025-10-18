import React, { useState } from 'react';
import { useContractsData } from './hooks/useContractsData';
import ContractDetailModal from './components/ContractDetailModal';

const getStatusStyle = (status) => {
    const s = status ? status.toLowerCase() : '';
    const style = { padding: '5px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block' };
    if (s === 'active') return { ...style, background: '#166534', color: '#86efac' };
    if (s === 'pending') return { ...style, background: '#9a3412', color: '#fdba74' };
    if (s === 'expired' || s === 'terminated') return { ...style, background: '#991b1b', color: '#fca5a5' };
    return { ...style, background: '#4b5563', color: '#e5e7eb' };
};

const ContractRow = ({ contract, onViewDetails }) => (
  <tr style={{ borderTop: '1px solid #374151' }}>
    <td style={{ padding: '15px 20px', fontWeight: 'bold', color: 'white' }}>{contract.contractNumber}</td>
    <td style={{ padding: '15px 20px' }}>{contract.userId}</td>
    <td style={{ padding: '15px 20px' }}>{contract.vehicleId}</td>
    <td style={{ padding: '15px 20px' }}><span style={getStatusStyle(contract.status)}>{contract.status}</span></td>
    <td style={{ padding: '15px 20px' }}>{new Date(contract.startDate).toLocaleDateString('vi-VN')}</td>
    <td style={{ padding: '15px 20px' }}>
      <button onClick={() => onViewDetails(contract)} style={{ background: '#374151', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}>
        Chi tiết
      </button>
    </td>
  </tr>
);

const AdminContracts = () => {
  const { contracts, isLoading, error, refetch, filterStatus, setFilterStatus, searchQuery, setSearchQuery } = useContractsData();
  const [selectedContract, setSelectedContract] = useState(null);

  const renderContent = () => {
    if (isLoading) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Đang tải danh sách hợp đồng...</p>;
    if (error) return ( <div style={{ color: '#ef4444', textAlign: 'center' }}><p>Lỗi: {error}</p><button onClick={refetch}>Thử lại</button></div> );
    if (contracts.length === 0) return <p style={{ color: '#9ca3af', textAlign: 'center' }}>Không tìm thấy hợp đồng nào.</p>;

    return (
      <div style={{ background: '#1f2937', borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: '#374151' }}>
              <th style={{ padding: '15px 20px' }}>Số Hợp đồng</th>
              <th style={{ padding: '15px 20px' }}>Tài xế ID</th>
              <th style={{ padding: '15px 20px' }}>Xe ID</th>
              <th style={{ padding: '15px 20px' }}>Trạng thái</th>
              <th style={{ padding: '15px 20px' }}>Ngày bắt đầu</th>
              <th style={{ padding: '15px 20px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map(contract => <ContractRow key={contract.contractId} contract={contract} onViewDetails={setSelectedContract} />)}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px' }}>Quản lý Hợp đồng</h1>
            <p style={{ margin: '5px 0 0 0', color: '#9ca3af' }}>Xem và lọc toàn bộ hợp đồng trong hệ thống.</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <input 
              type="text"
              placeholder="Tìm theo SĐT hoặc Tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: '#374151', color: 'white', border: '1px solid #4b5563', padding: '10px 15px', borderRadius: '8px' }}
            />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.gexprot.value)} style={{ background: '#374151', color: 'white', border: '1px solid #4b5563', padding: '10px', borderRadius: '8px' }}>
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="PENDING">Đang chờ</option>
              <option value="EXPIRED">Hết hạn</option>
            </select>
          </div>
        </div>
        {renderContent()}
      </div>
      <ContractDetailModal contract={selectedContract} onClose={() => setSelectedContract(null)} />
    </>
  );
};

export default AdminContracts;