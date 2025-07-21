// src/website/services/api.js
const ENV_MODE = process.env.REACT_APP_ENV_MODE;
const PROD_BASE_URL = process.env.REACT_APP_PROD_BASE_URL;
const LOCAL_BASE_URL = process.env.REACT_APP_LOCAL_BASE_URL;
const API_BASE_URL = ENV_MODE === 'production' ? PROD_BASE_URL : LOCAL_BASE_URL;

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
