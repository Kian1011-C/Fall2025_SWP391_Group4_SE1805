// Staff/BatteryInventory/hooks/useBatteryUpdate.js
import { useState } from 'react';
import batteryService from '../../../../assets/js/services/batteryService';

/**
 * Custom hook for managing battery update modal and operations
 */
export const useBatteryUpdate = (batteries, setBatteries) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: '',
    health: 0,
    temperature: 0,
    voltage: 0
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const openUpdateModal = (battery) => {
    setSelectedBattery(battery);
    setUpdateData({
      status: battery.status,
      health: battery.health || battery.stateOfHealth || 0,
      temperature: battery.temperature || 25,
      voltage: battery.voltage || 72
    });
    setShowUpdateModal(true);
  };

  const closeUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedBattery(null);
    setUpdateData({
      status: '',
      health: 0,
      temperature: 0,
      voltage: 0
    });
  };

  const updateField = (field, value) => {
    setUpdateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdateBattery = async () => {
    if (!selectedBattery) return false;

    try {
      setIsUpdating(true);
      console.log('🔋 Updating battery:', selectedBattery.id, updateData);
      
      // Call API to update battery
      const result = await batteryService.updateBattery(selectedBattery.id, updateData);
      
      if (result.success) {
        console.log('✅ Battery updated successfully:', result.data);
        
        // Update local state with new data
        setBatteries(batteries.map(battery => 
          battery.id === selectedBattery.id 
            ? { 
                ...battery, 
                ...updateData,
                // Handle both field name conventions
                stateOfHealth: parseFloat(updateData.health),
                health: parseFloat(updateData.health)
              }
            : battery
        ));

        alert('✅ Cập nhật pin thành công!');
        closeUpdateModal();
        return true;
      } else {
        console.error('❌ Failed to update battery:', result.message);
        alert('❌ Cập nhật thất bại: ' + result.message);
        return false;
      }
    } catch (err) {
      console.error('❌ Error updating battery:', err);
      alert('❌ Có lỗi xảy ra: ' + err.message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    showUpdateModal,
    selectedBattery,
    updateData,
    isUpdating,
    openUpdateModal,
    closeUpdateModal,
    updateField,
    handleUpdateBattery
  };
};
