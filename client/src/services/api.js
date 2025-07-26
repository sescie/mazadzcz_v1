import axios from 'axios';
const ENV_MODE = process.env.REACT_APP_ENV_MODE;
const PROD_BASE_URL = process.env.REACT_APP_PROD_BASE_URL;
const LOCAL_BASE_URL = process.env.REACT_APP_LOCAL_BASE_URL;
const API_BASE_URL = ENV_MODE === 'production' ? PROD_BASE_URL : LOCAL_BASE_URL;

export const API_URL = API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
// helper
async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.error || 'Request failed');
  }
  return res.json();
}

// Auth
export const login = (email, password) =>
  fetch(`${API_BASE_URL}/users/login`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email, password })
  }).then(handleResponse);
// register
export const register = async (userData) => {

  console.log(userData);
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const responseData = await response.json();

    if (!response.ok) {
      // Create enhanced error object
      const error = new Error(responseData.error || 'Registration failed');
      error.details = responseData.details;
      error.resolution = responseData.resolution;
      error.status = response.status;
      throw error;
    }

    return responseData;
  } catch (error) {
    console.error('Registration error:', {
      message: error.message,
      details: error.details,
      status: error.status
    });
    throw error;
  }
};
// Admin User Management
export const fetchUsers = (token) =>
  fetch(`${API_BASE_URL}/users/admin/users`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);

export const fetchUserById = (userId, token) =>
  fetch(`${API_BASE_URL}/users/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);
export const createUser = (userData, token) =>
  fetch(`${API_BASE_URL}/users/admin/users`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type':'application/json'
    },
    body: JSON.stringify(userData)
  }).then(handleResponse);

export const updateUser = (userId, userData, token) =>
  fetch(`${API_BASE_URL}/users/admin/users/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type':'application/json'
    },
    body: JSON.stringify(userData)
  }).then(handleResponse);

export const deleteUser = (userId, token) =>
  fetch(`${API_BASE_URL}/users/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);

export const getPendingUsers = (token) =>
fetch(`${API_BASE_URL}/admin/pending-users`, {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}).then(handleResponse);

export const activateUser = (userId, token) =>
  fetch(`${API_BASE_URL}/users/admin/users/${userId}/activate`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);

export const deactivateUser = (userId, token) =>
  fetch(`${API_BASE_URL}/users/admin/users/${userId}/deactivate`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);

// Approve user (Admin)
export const approveUser = (userId, token) =>
  fetch(`${API_BASE_URL}/admin/approve-user/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(handleResponse);
export const unApproveUser = (userId, token) =>
  fetch(`${API_BASE_URL}/admin/un-approve-user/${userId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(handleResponse);

// New: Reset Password (Admin)
export const resetPassword = (userId, token) =>
  fetch(`${API_BASE_URL}/users/admin/users/${userId}/reset-password`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);

// New: “Who am I?” profile
export const fetchCurrentUser = (token) =>
  fetch(`${API_BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);


// Investment Endpoints
export const fetchInvestments = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/investments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await handleResponse(response);
    
    // Ensure all required fields have values
    return data.map(investment => ({
      ...investment,
      price: investment.price || 0,
      status: investment.status || 'PENDING',
      type: investment.type || 'OTHER'
    }));
  } catch (error) {
    console.error('Error in fetchInvestments:', error);
    throw error;
  }
};

export const createInvestment = async (investmentData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/investments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...investmentData,
        status: investmentData.isActive ? 'ACTIVE' : 'PENDING'
      })
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error in createInvestment:', error);
    throw error;
  }
};

export const updateInvestment = async (id, investmentData, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/investments/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(investmentData)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error in updateInvestment:', error);
    throw error;
  }
};

export const deleteInvestment = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/investments/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error in deleteInvestment:', error);
    throw error;
  }
};

export const fetchInvestment = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/investments/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error in fetchInvestmentDetails:', error);
    throw error;
  }
};

export const updateInvestmentStatus = async (id, status, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/investments/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error in updateInvestmentStatus:', error);
    throw error;
  }
};

export const fetchInvestmentPerformance = async (id, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/investments/${id}/performance`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error in fetchInvestmentPerformance:', error);
    throw error;
  }
};

// User Investment Endpoints
export const fetchUserInvestments = (userId, token) =>
  fetch(`${API_BASE_URL}/admin/users/${userId}/investments`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);
export const fetchAllInvestments = (token) =>
  fetch(`${API_BASE_URL}/investments`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(handleResponse);

export const assignInvestmentToUser = (userId, investmentId, payload, token) => {
  // merge investmentId into the body
  const body = {
    investmentId,
    units: payload.units,
    purchase_price: payload.purchase_price,
    notes: payload.notes || null
  };

  return fetch(`${API_BASE_URL}/admin/users/${userId}/investments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(handleResponse);
};





export const unassignInvestmentFromUser = (userId, investmentId, token) =>
  fetch(`${API_BASE_URL}/admin/users/${userId}/investments/${investmentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);
export const fetchUserActivity = (userId, token) =>
  fetch(`${API_BASE_URL}/admin/users/${userId}/activity`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);

  // Investor Endpoints
// 3.1 Fetch all requests for a user
export const fetchInvestmentRequests = (userId, token) =>
  fetch(`${API_BASE_URL}/users/${userId}/requests`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);

// 3.2 Create any new request
export const createInvestmentRequest = (userId, investmentId, amount, notesOrType, token) => {
  // notesOrType can be string (notes) or object { type, notes? }
  let body = { investmentId };
  if (typeof notesOrType === 'object') {
    body.requestType = notesOrType.type;
    if (notesOrType.notes) body.notes = notesOrType.notes;
    if ('amount' in notesOrType) body.amount = notesOrType.amount;
  } else {
    // legacy: notes only
    body.requestType = 'assign';
    body.notes = notesOrType;
  }
  if (typeof amount === 'number') body.amount = amount;
  return fetch(`${API_BASE_URL}/users/${userId}/requests`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(handleResponse);
};

// 3.3 Cancel a pending request
export const cancelInvestmentRequest = (userId, reqId, token) =>
  fetch(`${API_BASE_URL}/users/${userId}/requests/${reqId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);
// 3.1 Fetch all requests for a given user
export const fetchUserRequests = (userId, token) =>
  fetch(`${API_BASE_URL}/users/${userId}/requests`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(handleResponse);
export const updateInvestmentRequest = (userId, reqId, { type, amount, notes }, token) => {
  return fetch(`${API_BASE_URL}/users/${userId}/requests/${reqId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      requestType: type,
      amount,
      notes
    })
  }).then(handleResponse);
};
// 3.4 (Admin) Update status:

export const fetchAllRequests = (token) =>
  fetch(`${API_BASE_URL}/requests?status=Pending`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);
  
export const updateRequestStatus = (reqId, status, token) =>
  fetch(`${API_BASE_URL}/requests/${reqId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status })
  }).then(handleResponse);
export const fetchInvestorPortfolio = (userId, token) =>
  fetch(`${API_BASE_URL}/investors/${userId}/portfolio`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);

export const fetchInvestorStatements = (userId, token) =>
  fetch(`${API_BASE_URL}/investors/${userId}/statements`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);

  // Approve and assign an investment request (admin only)
export function approveInvestmentRequest(reqId, { units, purchase_price }, token) {
  return fetch(`${API_URL}/admin/requests/${reqId}/approve`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ units, purchase_price })
  }).then(handleResponse);
}

// Simply reject a pending request (admin only)
export function rejectInvestmentRequest(reqId, token) {
  return fetch(`${API_URL}/admin/requests/${reqId}/reject`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }).then(handleResponse);
}



// profile
export const fetchProfile = (token) =>
  fetch(`${API_BASE_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  }).then(handleResponse);

export const updateEmail = (email, token) =>
  fetch(`${API_BASE_URL}/users/profile/email`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email })
  }).then(handleResponse);

export const updatePassword = (currentPassword, newPassword, token) =>
  fetch(`${API_BASE_URL}/users/profile/password`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ currentPassword, newPassword })
  }).then(handleResponse);

export const updateBank = (bankDetails, token) =>
  fetch(`${API_BASE_URL}/users/profile/bank`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bankDetails)
  }).then(handleResponse);




//Investment Request Endpoints

