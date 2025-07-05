import React, { useState, useEffect } from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import InvestmentListItem from '../components/InvestmentListItem';
import { getAllInvestments } from '../services/api';
import websiteTheme from '../websiteTheme';

const TABS = ['All', 'Equity', 'Bonds', 'Stocks', 'Funds'];

const Investments = () => {
  const [allInv, setAllInv] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    getAllInvestments()
      .then(data => setAllInv(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const displayed =
    activeTab === 'All'
      ? allInv
      : allInv.filter(inv => inv.asset_class.toLowerCase() === activeTab.toLowerCase());

  return (
    <>
      <Navbar />

    {/* Hero + Inspo Text */}
    <section
        style={{
            padding: '110px 20px 90px',
            textAlign: 'center',
            background: `linear-gradient(120deg, ${websiteTheme.colors.primary}22 0%, ${websiteTheme.colors.accent}33 100%)`,
            boxShadow: '0 6px 32px 0 rgba(60, 80, 180, 0.07)',
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            marginBottom: 12,
        }}
    >
        <h1
            style={{
                color: websiteTheme.colors.primary,
                fontSize: '3.1rem',
                fontWeight: 800,
                marginBottom: 18,
                letterSpacing: '-1.5px',
                textShadow: `0 2px 16px ${websiteTheme.colors.accent}22`,
            }}
        >
            Invest with Confidence
        </h1>
        <p
            style={{
                color: websiteTheme.colors.text,
                maxWidth: 720,
                margin: '0 auto',
                fontSize: '1.22rem',
                fontWeight: 500,
                lineHeight: 1.7,
                letterSpacing: '0.01em',
                textShadow: `0 1px 8px ${websiteTheme.colors.primary}11`,
            }}
        >
            Unlock your financial potential with <span style={{ color: websiteTheme.colors.accent, fontWeight: 700 }}>Mazadzicz</span>. 
            Our expertly curated investment opportunities empower you to grow, diversify, and secure your future. 
            Whether you’re just starting or a seasoned investor, discover a path tailored to your ambitions—<b>let’s build your legacy together.</b>
        </p>
    </section>

    {/* Tabs */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          margin: '32px 0',
        }}
      >
        {TABS.map(tab => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 18px',
                border: '2px solid',
                borderColor: isActive
                  ? websiteTheme.colors.accent
                  : websiteTheme.colors.lightGray,
                borderRadius: 30,
                backgroundColor: isActive ? websiteTheme.colors.accent : 'white',
                color: isActive ? 'white' : websiteTheme.colors.text,
                fontSize: '0.95rem',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab}
            </button>
          );
        })}
      </nav>

      {/* List Container */}
      <section style={{ padding: '0 20px 60px' }}>
        <div
          style={{
            maxWidth: websiteTheme.sizes.containerWidth,
            margin: '0 auto',
          }}
        >
          {loading ? (
            <p style={{ textAlign: 'center', marginTop: 40 }}>Loading investment opportunities…</p>
          ) : displayed.length > 0 ? (
            displayed.map(inv => (
              <InvestmentListItem key={inv.id} inv={inv} />
            ))
          ) : (
            <p
              style={{
                textAlign: 'center',
                color: websiteTheme.colors.gray,
                marginTop: 40,
              }}
            >
              No {activeTab.toLowerCase()} investments found.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Investments;
