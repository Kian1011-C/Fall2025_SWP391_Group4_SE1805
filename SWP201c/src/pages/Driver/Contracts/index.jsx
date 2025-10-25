// Driver/Contracts/index.jsx
// Container component for Contracts page - orchestrates data and UI

import DashboardLayout from '../../../layouts/DashboardLayout';
import { useContractsData, useContractModal } from './hooks';
import {
  ContractsHeader,
  ContractsList,
  EmptyContracts,
  ContractDetailModal
} from './components';

const Contracts = () => {
  // Data fetching
  const { contracts, loading, error } = useContractsData();

  // Modal state
  const { selectedContract, isOpen, openModal, closeModal } = useContractModal();

  // Loading state
  if (loading) {
    return (
      <DashboardLayout role="driver">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px'
        }}>
          <div style={{
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              animation: 'spin 1s linear infinite'
            }}>
              ⚡
            </div>
            <p style={{
              fontSize: '1.125rem',
              color: '#666'
            }}>
              Đang tải hợp đồng...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout role="driver">
        <div style={{
          padding: '2rem',
          backgroundColor: '#fff3cd',
          borderRadius: '12px',
          border: '1px solid #ffc107',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '3rem',
            marginBottom: '1rem'
          }}>
            ⚠️
          </div>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#856404',
            marginBottom: '0.5rem'
          }}>
            Không thể tải danh sách hợp đồng
          </h3>
          <p style={{
            fontSize: '1rem',
            color: '#856404',
            marginBottom: '1.5rem'
          }}>
            {error}
          </p>
          <p style={{
            fontSize: '0.875rem',
            color: '#666'
          }}>
            Vui lòng thử lại sau hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="driver">
      <div style={{ padding: '2rem' }}>
        {/* Header */}
        <ContractsHeader />

        {/* Content */}
        {contracts.length === 0 ? (
          <EmptyContracts />
        ) : (
          <ContractsList
            contracts={contracts}
            onContractClick={openModal}
          />
        )}

        {/* Detail Modal */}
        <ContractDetailModal
          contract={selectedContract}
          isOpen={isOpen}
          onClose={closeModal}
        />
      </div>

      {/* Inline styles for spin animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </DashboardLayout>
  );
};

export default Contracts;
