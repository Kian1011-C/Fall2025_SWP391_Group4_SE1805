// Admin/Users/hooks/useUsersFilters.js
// Custom hook for filtering and searching users

import { useState, useMemo } from 'react';

export const useUsersFilters = (users) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'staff', 'admin'
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all', 'active', 'inactive'

  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Filter by active tab (role)
    switch (activeTab) {
      case 'users':
        filtered = filtered.filter(user => user.role === 'driver');
        break;
      case 'staff':
        filtered = filtered.filter(user => user.role === 'staff');
        break;
      case 'admin':
        filtered = filtered.filter(user => user.role === 'admin');
        break;
      default:
        break;
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    return filtered;
  }, [users, searchTerm, activeTab, selectedStatus]);

  return {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    activeTab,
    setActiveTab,
    selectedStatus,
    setSelectedStatus
  };
};
