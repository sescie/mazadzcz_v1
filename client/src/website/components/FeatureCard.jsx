import React from 'react';
import { FaChartLine, FaHandshake, FaGlobe } from 'react-icons/fa';
import websiteTheme from '../websiteTheme';

const FeatureCard = ({ icon, title, description }) => {
  const getIcon = () => {
    switch (icon) {
      case 'chart':
        return <FaChartLine />;
      case 'handshake':
        return <FaHandshake />;
      case 'globe':
        return <FaGlobe />;
      default:
        return <FaChartLine />;
    }
  };

  return (
    <div className="service-card" style={{ 
      background: 'white', 
      borderRadius: '10px', 
      overflow: 'hidden', 
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)', 
      transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
      textAlign: 'center', 
      padding: '40px 30px',
      '&:hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)'
      }
    }}>
      <div className="service-icon" style={{ 
        fontSize: '50px', 
        color: websiteTheme.colors.accent, 
        marginBottom: '25px' 
      }}>
        {getIcon()}
      </div>
      <h3 style={{ 
        fontSize: '1.5rem', 
        color: websiteTheme.colors.primary, 
        marginBottom: '15px' 
      }}>{title}</h3>
      <p style={{ 
        color: websiteTheme.colors.gray, 
        marginBottom: '20px' 
      }}>{description}</p>
      <a href="#" style={{ 
        color: websiteTheme.colors.accent, 
        textDecoration: 'none', 
        fontWeight: 600, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: '5px'
      }}>Learn More <span>→</span></a>
    </div>
  );
};

export default FeatureCard;