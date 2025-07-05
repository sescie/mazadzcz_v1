import api from './api'; // Your existing API service

export const fetchDashboardSummary = async () => {
  try {
    const response = await api.get('/dashboard/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw error;
  }
};

export const fetchPerformanceData = async () => {
  try {
    const response = await api.get('/dashboard/performance');
    return response.data;
  } catch (error) {
    console.error('Error fetching performance data:', error);
    throw error;
  }
};

export const fetchAllocationData = async () => {
  try {
    const response = await api.get('/dashboard/allocation');
    return response.data;
  } catch (error) {
    console.error('Error fetching allocation data:', error);
    throw error;
  }
};

export const fetchRecentActivity = async () => {
  try {
    const response = await api.get('/dashboard/activity');
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};