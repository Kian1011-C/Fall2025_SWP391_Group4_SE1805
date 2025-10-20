import { useEffect, useMemo, useState } from 'react';
import batteryService from '../../../assets/js/services/batteryService';

export const useBatteryStock = () => {
  const [batteries, setBatteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { fetchBatteryStock(); }, []);

  const fetchBatteryStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await batteryService.getAllBatteries();
      if (result.success) setBatteries(result.data || []);
      else setError(result.message || 'Không thể tải dữ liệu kho pin');
    } catch (err) {
      console.error('Error fetching battery stock:', err);
      setError('Lỗi khi tải dữ liệu kho pin');
    } finally {
      setLoading(false);
    }
  };

  const filteredBatteries = useMemo(() => {
    if (filterStatus === 'all') return batteries;
    return batteries.filter(b => b.status === filterStatus);
  }, [batteries, filterStatus]);

  const stats = useMemo(() => ({
    total: batteries.length,
    available: batteries.filter(b => b.status === 'Available').length,
    inUse: batteries.filter(b => b.status === 'In Use').length,
    charging: batteries.filter(b => b.status === 'Charging').length,
    maintenance: batteries.filter(b => b.status === 'Maintenance').length,
  }), [batteries]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return '#19c37d';
      case 'In Use': return '#6ab7ff';
      case 'Charging': return '#ffa500';
      case 'Maintenance': return '#ff4757';
      default: return '#6c757d';
    }
  };

  const getStatusLabel = (status) => ({
    'Available': 'Sẵn sàng',
    'In Use': 'Đang dùng',
    'Charging': 'Đang sạc',
    'Maintenance': 'Bảo trì'
  })[status] || status;

  return {
    // data
    batteries,
    filteredBatteries,
    stats,
    // loading/error
    loading,
    error,
    fetchBatteryStock,
    // filter
    filterStatus,
    setFilterStatus,
    // utils
    getStatusColor,
    getStatusLabel,
  };
};


