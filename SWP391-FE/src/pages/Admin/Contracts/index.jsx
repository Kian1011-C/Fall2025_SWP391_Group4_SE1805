import React, { useState } from 'react';
import { FiFileText, FiCheckCircle, FiClock, FiXCircle, FiPlus, FiSearch, FiFilter, FiEye } from 'react-icons/fi';
import { useContractsData } from './hooks/useContractsData';
import ContractDetailModal from './components/ContractDetailModal';
import CreateContractModal from './components/CreateContractModal';
import '../../../assets/css/AdminContractManagement.css';

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
    <td style={{ padding: '15px 20px' }}>
      {contract.firstName} {contract.lastName}
      <div style={{ fontSize: '12px', color: '#9ca3af' }}>{contract.email}</div>
    </td>
    <td style={{ padding: '15px 20px' }}>
      {contract.plateNumber}
      <div style={{ fontSize: '12px', color: '#9ca3af' }}>{contract.vehicleModel}</div>
    </td>
    <td style={{ padding: '15px 20px' }}>
      {contract.planName}
      <div style={{ fontSize: '12px', color: '#9ca3af' }}>{contract.monthlyBaseFee?.toLocaleString('vi-VN')}đ/tháng</div>
    </td>
    <td style={{ padding: '15px 20px' }}><span style={getStatusStyle(contract.status)}>{contract.status}</span></td>
    <td style={{ padding: '15px 20px' }}>
      {new Date(contract.startDate).toLocaleDateString('vi-VN')}
      <div style={{ fontSize: '12px', color: '#9ca3af' }}>đến {new Date(contract.endDate).toLocaleDateString('vi-VN')}</div>
    </td>
    <td style={{ padding: '15px 20px' }}>
      <button onClick={() => onViewDetails(contract)} style={{ background: '#374151', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <FiEye size={16} /> Chi tiết
      </button>
    </td>
  </tr>
);

const AdminContracts = () => {
  const { 
    contracts, 
    isLoading, 
    error, 
    refetch, 
    filterStatus, 
    setFilterStatus, 
    searchQuery, 
    setSearchQuery,
    stats 
  } = useContractsData();
  
  const [selectedContract, setSelectedContract] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const renderStats = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
      <div style={{ background: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid #374151', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <FiFileText size={32} color="#3b82f6" />
        <div>
          <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Tổng hợp đồng</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>{stats.total}</div>
        </div>
      </div>
      <div style={{ background: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid #374151', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <FiCheckCircle size={32} color="#86efac" />
        <div>
          <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Đang hoạt động</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#86efac' }}>{stats.active}</div>
        </div>
      </div>
      <div style={{ background: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid #374151', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <FiClock size={32} color="#fdba74" />
        <div>
          <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Đang chờ</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fdba74' }}>{stats.pending}</div>
        </div>
      </div>
      <div style={{ background: '#1f2937', padding: '20px', borderRadius: '12px', border: '1px solid #374151', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <FiXCircle size={32} color="#fca5a5" />
        <div>
          <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '8px' }}>Hết hạn</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#fca5a5' }}>{stats.expired}</div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) return <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>Đang tải danh sách hợp đồng...</p>;
    if (error) return ( 
      <div style={{ color: '#ef4444', textAlign: 'center', padding: '40px' }}>
        <p>Lỗi: {error}</p>
        <button onClick={refetch} style={{ background: '#374151', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>
          Thử lại
        </button>
      </div> 
    );
    if (contracts.length === 0) return <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>Không tìm thấy hợp đồng nào.</p>;

    return (
      <div style={{ background: '#1f2937', borderRadius: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
          <thead>
            <tr style={{ background: '#374151' }}>
              <th style={{ padding: '15px 20px' }}>Số Hợp đồng</th>
              <th style={{ padding: '15px 20px' }}>Khách hàng</th>
              <th style={{ padding: '15px 20px' }}>Xe</th>
              <th style={{ padding: '15px 20px' }}>Gói dịch vụ</th>
              <th style={{ padding: '15px 20px' }}>Trạng thái</th>
              <th style={{ padding: '15px 20px' }}>Thời hạn</th>
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
            <p style={{ margin: '5px 0 0 0', color: '#9ca3af' }}>Xem và quản lý toàn bộ hợp đồng trong hệ thống.</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={{ 
              background: '#10b981', 
              color: 'white', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FiPlus size={20} />
            Tạo hợp đồng mới
          </button>
        </div>

        {renderStats()}

        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <FiSearch style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              pointerEvents: 'none'
            }} size={18} />
            <input 
              type="text"
              placeholder="Tìm theo số hợp đồng, tên, email, SĐT, biển số..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%',
                background: '#374151', 
                color: 'white', 
                border: '1px solid #4b5563', 
                padding: '10px 15px 10px 45px', 
                borderRadius: '8px' 
              }}
            />
          </div>
          <div style={{ position: 'relative', minWidth: '200px' }}>
            <FiFilter style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              pointerEvents: 'none',
              zIndex: 1
            }} size={18} />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)} 
              style={{ 
                width: '100%',
                background: '#374151', 
                color: 'white', 
                border: '1px solid #4b5563', 
                padding: '10px 15px 10px 45px', 
                borderRadius: '8px'
              }}
            >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="pending">Đang chờ</option>
            <option value="expired">Hết hạn</option>
            <option value="terminated">Đã hủy</option>
            </select>
          </div>
        </div>

        {renderContent()}
      </div>

      <ContractDetailModal 
        contract={selectedContract} 
        onClose={() => setSelectedContract(null)}
        onRefresh={refetch}
      />
      
      <CreateContractModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          setShowCreateModal(false);
          refetch();
        }}
      />
    </>
  );
};

export default AdminContracts;