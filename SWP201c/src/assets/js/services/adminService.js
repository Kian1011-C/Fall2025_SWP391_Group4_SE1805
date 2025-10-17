import axios from 'axios';

const API_BASE_URL = '/api/admin';

const adminService = {
  getDrivers: async (params) => {
    const response = await axios.get(`${API_BASE_URL}/drivers`, { params });
    return response.data;
  },

  getDriverById: async (userId) => {
    const response = await axios.get(`${API_BASE_URL}/drivers/${userId}`);
    return response.data;
  },

  createDriver: async (driverData) => {
    const response = await axios.post(`${API_BASE_URL}/drivers`, driverData);
    return response.data;
  },

  updateDriver: async (userId, driverData) => {
    const response = await axios.put(`${API_BASE_URL}/drivers/${userId}`, driverData);
    return response.data;
  },

  deleteDriver: async (userId) => {
    const response = await axios.delete(`${API_BASE_URL}/drivers/${userId}`);
    return response.data;
  },

  getStaff: async (params) => {
    const response = await axios.get(`${API_BASE_URL}/staff`, { params });
    return response.data;
  },

  getAdminStatistics: async () => {
    const response = await axios.get(`${API_BASE_URL}/statistics`);
    return response.data;
  }
};

export default adminService;