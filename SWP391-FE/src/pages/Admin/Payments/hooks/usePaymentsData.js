// hooks/usePaymentsData.js
import { useState, useEffect, useCallback } from 'react';
import paymentService from '/src/assets/js/services/paymentService.js';
import contractService from '/src/assets/js/services/contractService.js';
import { apiUtils, API_CONFIG } from '/src/assets/js/config/api.js';

export const usePaymentsData = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Fetch danh sách drivers với thông tin contract và payment
  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ Bước 1: Lấy tất cả contracts
      const contractsResult = await contractService.getAllContracts();
      
      if (!contractsResult.success) {
        throw new Error(contractsResult.message || 'Không thể tải danh sách hợp đồng');
      }

      const contracts = contractsResult.data || [];
      
      console.log('Loaded contracts:', contracts);

      // ✅ Bước 2: Lấy tất cả payments
      const paymentsResult = await paymentService.adminGetAllPayments();
      
      if (!paymentsResult.success) {
        throw new Error(paymentsResult.message || 'Không thể tải danh sách thanh toán');
      }

      const payments = paymentsResult.data || [];
      
      console.log('Loaded payments:', payments);

      // ✅ Bước 3: Group payments by contractId (KHÔNG phải userId!)
      // Vì 1 user có thể có nhiều contracts
      const paymentsByContract = {};
      payments.forEach(payment => {
        const contractId = payment.contractId;
        if (contractId) { // Chỉ group nếu có contractId
          if (!paymentsByContract[contractId]) {
            paymentsByContract[contractId] = [];
          }
          paymentsByContract[contractId].push(payment);
        }
      });

      console.log('📊 [Admin Payments] Payments grouped by contract:', paymentsByContract);

      // ✅ Bước 4: Tạo danh sách drivers từ contracts (đã có đủ thông tin user)
      const driversData = contracts
        .filter(contract => contract.status === 'active') // Chỉ lấy contract active
        .map(contract => {
          // ✅ Contract đã có firstName, lastName, email, phone, userId
          const fullName = `${contract.firstName || ''} ${contract.lastName || ''}`.trim() || 
                          contract.contractNumber || 
                          `Khách hàng #${contract.contractId}`;
          
          // ✅ Lấy payments của CONTRACT này (không phải tất cả payments của user)
          const userId = contract.userId || contract.email || `contract_${contract.contractId}`;
          const contractPayments = paymentsByContract[contract.contractId] || [];

          // Debug log
          console.log('Processing contract:', {
            contractId: contract.contractId,
            fullName,
            email: contract.email,
            phone: contract.phone,
            userId, // ← userId thực từ backend
            paymentsCount: contractPayments.length // ← Số payment của contract này
          });

          // Tính tổng đã thanh toán (CHỈ của contract này)
          const totalPaid = contractPayments
            .filter(p => p.status?.toLowerCase() === 'success')
            .reduce((sum, p) => sum + (p.amount || 0), 0);

          // Đếm hóa đơn chưa thanh toán (CHỈ của contract này)
          const unpaidBills = contractPayments
            .filter(p => p.status?.toLowerCase() === 'in_progress')
            .length;

          // ✅ Kiểm tra xem có hóa đơn đã xuất (trạng thái in_progress) không
          const hasGeneratedInvoice = unpaidBills > 0;

          // Lấy ngày thanh toán gần nhất (CHỈ của contract này)
          const paidPayments = contractPayments
            .filter(p => p.status?.toLowerCase() === 'success' && (p.vnpPayDate || p.createdAt))
            .sort((a, b) => {
              const dateA = new Date(a.vnpPayDate || a.createdAt);
              const dateB = new Date(b.vnpPayDate || b.createdAt);
              return dateB - dateA;
            });
          const lastPaymentDate = paidPayments.length > 0 
            ? (paidPayments[0].vnpPayDate || paidPayments[0].createdAt) 
            : null;

          return {
            id: `${userId}_${contract.contractId}`, // ✅ Unique key: userId + contractId
            userId: userId, // ✅ userId để gọi API
            name: fullName,
            email: contract.email || 'N/A',
            phone: contract.phone || 'N/A',
            contractId: contract.contractId,
            contractStatus: contract.status,
            subscriptionType: contract.planName || 'Standard',
            totalPaid: totalPaid,
            lastPaymentDate: lastPaymentDate,
            unpaidBills: unpaidBills,
            hasGeneratedInvoice: hasGeneratedInvoice, // ✅ Đã xuất hóa đơn = có payment in_progress
            startDate: contract.startDate,
            endDate: contract.endDate,
            // ✅ Thêm các thông tin cần thiết cho việc xuất hóa đơn
            plateNumber: contract.plateNumber,
            vehicleModel: contract.vehicleModel,
            monthlyDistance: contract.monthlyDistance,
            monthlyBaseFee: contract.monthlyBaseFee
          };
        });
      
      console.log('Final drivers data:', driversData);
      setDrivers(driversData);
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
    driver.phone.includes(searchTerm) ||
    driver.id.toLowerCase().includes(searchTerm.toLowerCase())
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
