// Admin/Users/index.jsx
// Main container for Admin Users page (Refactored with SoC)

import React, { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';

// Custom hooks - Business logic
import { 
  useUsersData, 
  useUsersActions, 
  useUsersFilters 
} from './hooks';

// Utils
import { calculateStats } from './utils';

// UI Components
import {
  UsersHeader,
  UsersSubTabs,
  UsersStatsCards,
  CurrentTabHeader,
  UsersSearchBar,
  UsersTable,
  AddUserModal
} from './components';

const AdminUsers = () => {
  // Data fetching hook
  const { users, loading, error, refetch } = useUsersData();

  // CRUD actions hook
  const { createUser, deleteUser, toggleStatus } = useUsersActions(refetch);

  // Filtering hook
  const {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    selectedStatus,
    setSelectedStatus
  } = useUsersFilters(users);

  // UI state (presentation only)
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate statistics
  const stats = calculateStats(users);

  // Event handlers (thin wrappers)
  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleSaveUser = async (userData) => {
    await createUser(userData);
    setShowAddModal(false);
  };

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId);
  };

  const handleToggleStatus = async (userId) => {
    await toggleStatus(userId);
  };

  const handleRetry = () => {
    refetch();
  };

  // Early returns for loading/error states
  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div style={{ padding: '20px', textAlign: 'center', color: '#FFFFFF' }}>
          <h2>Đang tải dữ liệu người dùng...</h2>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role="admin">
        <div style={{ padding: '20px', textAlign: 'center', color: '#ff6b6b' }}>
          <h2>Lỗi: {error}</h2>
          <button 
            onClick={handleRetry} 
            style={{ 
              marginTop: '20px', 
              padding: '10px 20px',
              background: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Thử lại
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Main render
  return (
    <DashboardLayout role="admin">
      <div style={{ padding: '20px' }}>
        {/* Page Header */}
        <UsersHeader />

        {/* Sub-tabs Navigation */}
        <UsersSubTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={stats}
        />

        {/* Statistics Cards */}
        <UsersStatsCards stats={stats} />

        {/* Current Tab Header with Add Button */}
        <CurrentTabHeader
          activeTab={activeTab}
          filteredCount={filteredUsers.length}
          onAddClick={handleAddUser}
        />

        {/* Search and Filter Bar */}
        <UsersSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          activeTab={activeTab}
        />

        {/* Users Table */}
        <UsersTable
          users={filteredUsers}
          loading={false}
          error={null}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteUser}
        />

        {/* Add User Modal */}
        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onSave={handleSaveUser}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminUsers;
