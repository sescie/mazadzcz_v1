// src/pages/investments/Investments.jsx
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchInvestments } from '../../../services/api';
import Layout from '../layouts/InvestorLayout';
import '../../styles/InvestmentDashboard.css';
import { Link } from 'react-router-dom';

const TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'REJECTED', label: 'Rejected' },
];

export default function InvestmentsList() {
  const { auth } = useAuth();
  const token = auth?.token;
  
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]       = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [search, setSearch]       = useState('');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchInvestments(token)
      .then(data => {
        setInvestments(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load investments.');
        setLoading(false);
      });
  }, [token]);

  const filtered = useMemo(() => {
    return investments
      .filter(inv => 
        (activeTab === 'ALL' || inv.status === activeTab) &&
        (inv.name.toLowerCase().includes(search.toLowerCase()) ||
         inv.type.toLowerCase().includes(search.toLowerCase()))
      );
  }, [investments, activeTab, search]);

  return (
    <Layout>
      <div className="header-search">
          <h1 className="page-title">Available Investments</h1>
          {/* Search */}
          <div className="invest-search">
            <input
              type="text"
              placeholder="Search by name or type…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
      </div>

      {/* Tabs */}
      <div className="invest-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`invest-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading investments…</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <div className="invest-table-wrapper">
          <table className="invest-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    No investments found.
                  </td>
                </tr>
              ) : (
                filtered.map(inv => (
                  <tr key={inv.id}>
                    <td>{inv.name}</td>
                    <td>{inv.type}</td>
                    <td>${inv.price.toLocaleString()}</td>
                    <td className={`status ${inv.status.toLowerCase()}`}>
                      {inv.status}
                    </td>
                    <td>
                      <Link to={`/investor/investments/${inv.id}`} className="btn-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
