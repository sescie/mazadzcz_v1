import React from 'react';
import { FaDownload } from 'react-icons/fa';
import websiteTheme from '../websiteTheme';

const TYPE_STYLES = {
  Equity: { bg: '#E8F5E9', color: '#2E7D32', text: 'Build long‑term growth with stocks' },
  Bonds:  { bg: '#E3F2FD', color: '#1565C0', text: 'Stability and steady income' },
  Stocks: { bg: '#FFF3E0', color: '#EF6C00', text: 'Ride market momentum' },
  Funds:  { bg: '#F3E5F5', color: '#6A1B9A', text: 'Diversify with professional management' },
};

const InvestmentListItem = ({ inv }) => {
  // Fallbacks
  const rating = inv.rating ?? 4.5;
  const ytdPerf = inv.ytd_performance ?? 50;
  const typeInfo = TYPE_STYLES[inv.asset_class] || {
    bg: websiteTheme.colors.light,
    color: websiteTheme.colors.text,
    text: 'Explore this opportunity',
  };

  // Build stars (half star at .5)
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const stars = [
    ...Array(fullStars).fill('★'),
    ...(halfStar ? ['☆'] : []),
    ...Array(5 - fullStars - (halfStar ? 1 : 0)).fill('☆'),
  ];

  return (
    <div
      style={{
        padding: '24px',
        marginBottom: '16px',
        backgroundColor: 'white',
        borderRadius: 12,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Left: Info */}
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, color: websiteTheme.colors.primary, fontSize: '1.25rem' }}>
          {inv.name}
        </h3>

        {/* Type badge + tag */}
        <span
          style={{
            display: 'inline-block',
            marginTop: 8,
            padding: '4px 10px',
            backgroundColor: typeInfo.bg,
            color: typeInfo.color,
            borderRadius: 20,
            fontSize: '0.8rem',
            fontWeight: 600,
          }}
        >
          {inv.asset_class}
        </span>
        <p style={{ margin: '6px 0 12px', color: websiteTheme.colors.text }}>
          {typeInfo.text}
        </p>

        {/* Performance & rating */}
        <div style={{ fontSize: '0.9rem', color: websiteTheme.colors.text }}>
          <span>
            <strong>YTD Performance:</strong>{' '}
            <span style={{ color: ytdPerf >= 0 ? '#2E7D32' : '#C62828' }}>
              {ytdPerf >= 0 ? '+' : ''}{ytdPerf}%
            </span>
          </span>
          <span style={{ margin: '0 12px' }}>|</span>
          <span>
            <strong>Rating:</strong>{' '}
            <span style={{ color: '#FFC107', fontSize: '1rem' }}>
              {stars.join(' ')}
            </span>
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <FaDownload
          style={{
            fontSize: '1.25rem',
            color: websiteTheme.colors.primary,
            cursor: 'pointer',
          }}
          title="Download fund sheet"
        />
        <button
          style={{
            backgroundColor: websiteTheme.colors.accent,
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '10px 18px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#004080')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = websiteTheme.colors.accent)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default InvestmentListItem;
