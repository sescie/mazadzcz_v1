import api from './api';

export const fetchInvestments = async (token) => {
  try {
    const response = await api.get('/investments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch investments:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch investments');
  }
};

export const createInvestment = async (investmentData, token) => {
  try {
    const response = await api.post('/investments', investmentData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to create investment:', error);
    throw new Error(error.response?.data?.error || 'Failed to create investment');
  }
};

export const updateInvestment = async (id, investmentData, token) => {
  try {
    const response = await api.put(`/investments/${id}`, investmentData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update investment:', error);
    throw new Error(error.response?.data?.error || 'Failed to update investment');
  }
};

export const deleteInvestment = async (id, token) => {
  try {
    const response = await api.delete(`/investments/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to delete investment:', error);
    throw new Error(error.response?.data?.error || 'Failed to delete investment');
  }
};

// Additional premium methods
export const fetchInvestmentDetails = async (id, token) => {
  try {
    const response = await api.get(`/investments/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch investment details:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch investment details');
  }
};

export const fetchInvestmentPerformance = async (id, token) => {
  try {
    const response = await api.get(`/investments/${id}/performance`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch investment performance:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch performance data');
  }
};