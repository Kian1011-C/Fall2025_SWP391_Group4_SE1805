// Admin/Stations/hooks/useStationsActions.js
// Custom hook for station CRUD actions

import useStationStore from '../../../../assets/js/store/stationSlice';

export const useStationsActions = () => {
  const { 
    createStation, 
    updateStation, 
    deleteStation 
  } = useStationStore();

  const handleCreate = async (formData) => {
    try {
      await createStation(formData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Không thể tạo trạm mới' 
      };
    }
  };

  const handleUpdate = async (stationId, formData) => {
    try {
      await updateStation(stationId, formData);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Không thể cập nhật trạm' 
      };
    }
  };

  const handleDelete = async (stationId) => {
    try {
      await deleteStation(stationId);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Không thể xóa trạm' 
      };
    }
  };

  return {
    createStation: handleCreate,
    updateStation: handleUpdate,
    deleteStation: handleDelete
  };
};
