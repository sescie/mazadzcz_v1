// src/pages/investorDashboard/RequestsList.jsx
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchInvestmentRequests } from '../../../services/api';
import '../../styles/InvestmentDashboard.css';
import Layout from '../layouts/InvestorLayout';

import { Link } from 'react-router-dom';

const STATUS_TABS = [
  { key: 'ALL',      label: 'All' },
  { key: 'PENDING',  label: 'Pending' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'REJECTED', label: 'Rejected' },
];

export default function RequestsList() {
  const { auth } = useAuth();
  const userId = auth.user.id;
  const token  = auth.token;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    fetchInvestmentRequests(userId, token)
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load requests');
        setLoading(false);
      });
  }, [userId, token]);

  const filtered = useMemo(() => {
    return requests.filter(req =>
      activeTab === 'ALL' || req.status === activeTab
    );
  }, [requests, activeTab]);

  return (
    
    <Layout>
      <h1 className="page-title">My Investment Requests</h1>

      <div className="invest-tabs">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            className={`invest-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading requests…</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="invest-table-wrapper">
          <table className="invest-table">
            <thead>
              <tr>
                <th>Investment</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    No requests found.
                  </td>
                </tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id}>
                    <td>{r.investmentName}</td>
                    <td>${r.amount.toLocaleString()}</td>
                    <td>{r.requestType}</td>
                    <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className={`status ${r.status.toLowerCase()}`}>
                      {r.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '1rem' }}>
        <Link to="/investor/requests/new" className="btn-sm">
          + New Request
        </Link>
      </div>
    </Layout>
  );
}
