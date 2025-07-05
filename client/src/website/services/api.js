// src/website/services/api.js
const API_BASE_URL = 'http://localhost:5050/api';

async function fetchInvestments() {
  const res = await fetch(`${API_BASE_URL}/investments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add any authentication headers if needed
    },
  });
  if (!res.ok) throw new Error("Failed to fetch investments");
  return res.json();
}

export function getAllInvestments() {
  return fetchInvestments();
}

// src/website/services/api.js
export async function getInvestmentByIsin(isin) {
  const res = await fetch(`/website/investments/${encodeURIComponent(isin)}`);
  if (!res.ok) throw new Error('Failed to fetch details');
  return res.json();
}
