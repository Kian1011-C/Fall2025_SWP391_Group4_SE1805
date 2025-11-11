// Custom hook for SwapConfirm logic
import { useState } from 'react';

export const useSwapConfirm = () => {
  // Mock data - Danh sách yêu cầu đổi pin
  const [swapRequests, setSwapRequests] = useState([
    {
      id: 'SWP001',
      driverName: 'Nguyễn Văn A',
      driverPhone: '0901234567',
      vehicleNumber: '59A-12345',
      oldBatteryId: 'BAT-001',
      oldBatterySOC: 15,
      requestTime: '2024-10-05 09:30',
      status: 'Pending',
      subscriptionType: 'Premium',
      kmThisMonth: 850,
      kmLimit: null
    },
    {
      id: 'SWP002',
      driverName: 'Trần Thị B',
      driverPhone: '0912345678',
      vehicleNumber: '59B-67890',
      oldBatteryId: 'BAT-045',
      oldBatterySOC: 8,
      requestTime: '2024-10-05 09:45',
      status: 'Pending',
      subscriptionType: 'Basic',
      kmThisMonth: 380,
      kmLimit: 400
    },
    {
      id: 'SWP003',
      driverName: 'Lê Văn C',
      driverPhone: '0923456789',
      vehicleNumber: '59C-11111',
      oldBatteryId: 'BAT-089',
      oldBatterySOC: 5,
      requestTime: '2024-10-05 10:00',
      status: 'Pending',
      subscriptionType: 'Basic',
      kmThisMonth: 450,
      kmLimit: 400
    }
  ]);

  // Mock data - Danh sách pin có sẵn
  const [availableBatteries, setAvailableBatteries] = useState([
    { id: 'BAT-101', soc: 100, soh: 98, status: 'Available', lastCharged: '2024-10-05 08:00' },
    { id: 'BAT-102', soc: 100, soh: 95, status: 'Available', lastCharged: '2024-10-05 08:15' },
    { id: 'BAT-103', soc: 98, soh: 97, status: 'Available', lastCharged: '2024-10-05 08:30' },
    { id: 'BAT-104', soc: 100, soh: 92, status: 'Available', lastCharged: '2024-10-05 08:45' },
    { id: 'BAT-105', soc: 95, soh: 96, status: 'Available', lastCharged: '2024-10-05 09:00' }
  ]);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedNewBattery, setSelectedNewBattery] = useState(null);
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  
  const [showBatteryCheckModal, setShowBatteryCheckModal] = useState(false);
  const [batteryCheckData, setBatteryCheckData] = useState({
    soh: 0,
    physicalCondition: 'Good',
    notes: '',
    needsMaintenance: false
  });
  
  const [showCompletedDetailModal, setShowCompletedDetailModal] = useState(false);
  const [completedSwapDetail, setCompletedSwapDetail] = useState(null);
  
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Helper functions
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleConfirmSwap = (request) => {
    setSelectedRequest(request);
    setSelectedNewBattery(null);
    setShowConfirmModal(true);
  };

  const handleSelectBattery = () => {
    if (!selectedNewBattery) {
      showNotification('Vui lòng chọn pin mới!', 'error');
      return;
    }

    setShowConfirmModal(false);

    // Check if driver exceeded subscription limit
    if (selectedRequest.kmLimit && selectedRequest.kmThisMonth > selectedRequest.kmLimit) {
      const excessKm = selectedRequest.kmThisMonth - selectedRequest.kmLimit;
      const pricePerKm = 500; // 500 VNĐ/km vượt
      setPaymentAmount(excessKm * pricePerKm);
      setShowPaymentModal(true);
    } else {
      setShowBatteryCheckModal(true);
    }
  };

  const handleConfirmPayment = () => {
    showNotification(`Đã ghi nhận thanh toán ${paymentAmount.toLocaleString('vi-VN')} VNĐ`, 'success');
    setShowPaymentModal(false);
    setShowBatteryCheckModal(true);
  };

  const handleCompleteBatteryCheck = () => {
    if (batteryCheckData.soh === 0) {
      showNotification('Vui lòng nhập SOH của pin cũ!', 'error');
      return;
    }

    // Complete the swap
    const completedSwap = {
      ...selectedRequest,
      newBatteryId: selectedNewBattery.id,
      newBatterySOC: selectedNewBattery.soc,
      completedTime: new Date().toLocaleString('vi-VN'),
      batteryCheckData,
      paymentAmount: paymentAmount || 0,
      paymentMethod
    };

    // Update states
    setSwapRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
    setAvailableBatteries(prev => prev.filter(bat => bat.id !== selectedNewBattery.id));
    
    setShowBatteryCheckModal(false);
    setCompletedSwapDetail(completedSwap);
    setShowCompletedDetailModal(true);

    // Reset states
    setBatteryCheckData({ soh: 0, physicalCondition: 'Good', notes: '', needsMaintenance: false });
    setPaymentAmount(0);
    setPaymentMethod('Cash');
  };

  const closeAllModals = () => {
    setShowConfirmModal(false);
    setShowPaymentModal(false);
    setShowBatteryCheckModal(false);
    setShowCompletedDetailModal(false);
    setSelectedRequest(null);
    setSelectedNewBattery(null);
    setCompletedSwapDetail(null);
  };

  return {
    // Data
    swapRequests,
    availableBatteries,
    
    // Modal states
    showConfirmModal,
    selectedRequest,
    selectedNewBattery,
    showPaymentModal,
    paymentAmount,
    paymentMethod,
    showBatteryCheckModal,
    batteryCheckData,
    showCompletedDetailModal,
    completedSwapDetail,
    notification,
    
    // Setters
    setSelectedNewBattery,
    setPaymentMethod,
    setBatteryCheckData,
    
    // Actions
    handleConfirmSwap,
    handleSelectBattery,
    handleConfirmPayment,
    handleCompleteBatteryCheck,
    closeAllModals,
    showNotification
  };
};

