// hooks/usePaymentsData.js
import { useState, useEffect, useCallback } from 'react';
import paymentService from '/src/assets/js/services/paymentService.js';

export const usePaymentsData = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch danh sách drivers (customers)
  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with actual API call
      // const result = await paymentService.getDriversList();
      
      // Mock data for now
      const mockDrivers = [
        {
          id: 'driver001',
          name: 'Trần Văn Minh',
          email: 'minh.driver@gmail.com',
          phone: '0902345678',
          contractId: 1,
          contractStatus: 'active',
          subscriptionType: 'Premium',
          totalPaid: 5400000,
          lastPaymentDate: '2025-10-15',
          unpaidBills: 1
        },
        {
          id: 'driver002',
          name: 'Lê Thị Hoa',
          email: 'hoa.driver@gmail.com',
          phone: '0903456789',
          contractId: 2,
          contractStatus: 'active',
          subscriptionType: 'Standard',
          totalPaid: 3200000,
          lastPaymentDate: '2025-10-20',
          unpaidBills: 0
        },
        {
          id: 'driver003',
          name: 'Nguyễn Văn An',
          email: 'an.driver@gmail.com',
          phone: '0904567890',
          contractId: 3,
          contractStatus: 'active',
          subscriptionType: 'Premium',
          totalPaid: 7800000,
          lastPaymentDate: '2025-10-25',
          unpaidBills: 2
        }
      ];
      
      setDrivers(mockDrivers);
    } catch (err) {
      console.error('Error fetching drivers:', err);
      setError(err.message || 'Không thể tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  // Filter drivers by search term
  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm)
  );

  return {
    drivers: filteredDrivers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    refreshData: fetchDrivers
  };
};
