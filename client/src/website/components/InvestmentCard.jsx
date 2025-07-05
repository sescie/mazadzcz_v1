import React from 'react';
import websiteTheme from '../websiteTheme';

const DEFAULT_BG = '#f0f2f5';
const DEFAULT_ICON_COLOR = '#ccc';

const InvestmentCard = ({ inv }) => {
  // Accent colors per asset class (fallback to theme accent)
  const accentMap = {
    Equity: '#2E7D32',
    Bonds: '#1565C0',
    Stocks: '#EF6C00',
    Funds: '#6A1B9A',
  };
  const accent = accentMap[inv.asset_class] || websiteTheme.colors.accent;

  return (
    <div
      style={{
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'white',
        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 360,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 6, backgroundColor: accent }} />

      {/* Image or placeholder */}
      {inv.imageUrl ? (
        <div style={{ height: 140, overflow: 'hidden' }}>
          <img
            src={inv.imageUrl}
            alt={inv.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div
          style={{
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: DEFAULT_BG,
            color: DEFAULT_ICON_COLOR,
            fontSize: '3rem',
          }}
        >
          📈
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <h4
          style={{
            margin: 0,
            fontSize: '1.15rem',
            color: websiteTheme.colors.primary,
            marginBottom: 4,
            lineHeight: 1.3,
          }}
        >
          {inv.name}
        </h4>

        <span
          style={{
            alignSelf: 'flex-start',
            backgroundColor: accent + '22', // 13% alpha
            color: accent,
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '4px 8px',
            borderRadius: 4,
            marginBottom: 10,
            textTransform: 'uppercase',
          }}
        >
          {inv.asset_class}
        </span>

        <p
          style={{
            margin: 0,
            fontSize: '0.9rem',
            color: websiteTheme.colors.text,
            lineHeight: 1.5,
            flex: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {inv.description || 'No description available for this investment.'}
        </p>

        <div
          style={{
            marginTop: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: websiteTheme.colors.gray }}>
              Current Price
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: websiteTheme.colors.primary }}>
              {inv.current_price} {inv.currency}
            </div>
          </div>
          <button
            style={{
              border: 'none',
              backgroundColor: accent,
              color: 'white',
              padding: '8px 14px',
              fontSize: '0.85rem',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = accent + 'CC')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = accent)}
          >
            Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;
