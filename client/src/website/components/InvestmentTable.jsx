import React from 'react';
import websiteTheme from '../websiteTheme';

const InvestmentTable = ({ data }) => (
  <div style={{ overflowX: 'auto', marginTop: 20 }}>
    <table
      style={{
        width: '100%',
        minWidth: 800,
        borderCollapse: 'collapse',
        fontSize: '0.9rem',
      }}
    >
      <thead>
        <tr style={{ backgroundColor: websiteTheme.colors.accent }}>
          {[
            'Name',
            'Ticker',
            'ISIN',
            'Class',
            'Price',
            'Status',
            'Inception',
            'Last Update',
          ].map(col => (
            <th
              key={col}
              style={{
                padding: '12px 16px',
                color: 'white',
                textAlign: 'left',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((inv, idx) => (
          <tr
            key={inv.id}
            style={{
              backgroundColor:
                idx % 2 === 0 ? websiteTheme.colors.light : 'white',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#eef3f7')}
            onMouseLeave={e =>
              (e.currentTarget.style.backgroundColor =
                idx % 2 === 0 ? websiteTheme.colors.light : 'white')
            }
          >
            <td style={{ padding: '12px 16px' }}>{inv.name}</td>
            <td style={{ padding: '12px 16px' }}>{inv.ticker}</td>
            <td style={{ padding: '12px 16px' }}>{inv.isin}</td>
            <td style={{ padding: '12px 16px' }}>{inv.asset_class}</td>
            <td style={{ padding: '12px 16px' }}>
              {inv.current_price} {inv.currency}
            </td>
            <td style={{ padding: '12px 16px' }}>{inv.status}</td>
            <td style={{ padding: '12px 16px' }}>
              {new Date(inv.inception_date).toLocaleDateString()}
            </td>
            <td style={{ padding: '12px 16px' }}>
              {new Date(inv.last_price_update).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default InvestmentTable;
