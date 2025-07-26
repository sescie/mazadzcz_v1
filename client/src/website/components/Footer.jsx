import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaLinkedinIn, FaTwitter, FaFacebookF, FaInstagram, FaHeart } from 'react-icons/fa';
import websiteTheme from '../websiteTheme';

const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: '#0a1429', 
      color: 'white', 
      paddingTop: '80px' 
    }}>
      <div className="container" style={{ 
        maxWidth: websiteTheme.sizes.containerWidth, 
        margin: '0 auto', 
        padding: '0 20px' 
      }}>
        <div className="footer-content" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '40px', 
          marginBottom: '60px' 
        }}>
          <div className="footer-column">
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '25px', 
              position: 'relative', 
              paddingBottom: '10px',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '40px',
                height: '3px',
                backgroundColor: websiteTheme.colors.accent,
                bottom: '0',
                left: '0'
              }
            }}>Mazadzicz</h3>
            <p>Strategic growth partners helping ambitious businesses unlock their potential through innovative strategies and transformative solutions.</p>
            <div className="social-links" style={{ 
              display: 'flex', 
              gap: '15px', 
              marginTop: '20px' 
            }}>
              <a href="#" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                color: 'white', 
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: websiteTheme.colors.accent,
                  transform: 'translateY(-5px)'
                }
              }}><FaLinkedinIn /></a>
              <a href="#" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                color: 'white', 
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: websiteTheme.colors.accent,
                  transform: 'translateY(-5px)'
                }
              }}><FaTwitter /></a>
              <a href="#" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                color: 'white', 
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: websiteTheme.colors.accent,
                  transform: 'translateY(-5px)'
                }
              }}><FaFacebookF /></a>
              <a href="#" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                color: 'white', 
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: websiteTheme.colors.accent,
                  transform: 'translateY(-5px)'
                }
              }}><FaInstagram /></a>
            </div>
          </div>
          
          <div className="footer-column">
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '25px', 
              position: 'relative', 
              paddingBottom: '10px',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '40px',
                height: '3px',
                backgroundColor: websiteTheme.colors.accent,
                bottom: '0',
                left: '0'
              }
            }}>Services</h3>
            <ul className="footer-links" style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '12px' }}><a href="#" style={{ 
                color: '#a0aec0', 
                textDecoration: 'none', 
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: websiteTheme.colors.accent,
                  paddingLeft: '5px'
                }
              }}>Strategic Advisory</a></li>
              <li style={{ marginBottom: '12px' }}><a href="#" style={{ 
                color: '#a0aec0', 
                textDecoration: 'none', 
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: websiteTheme.colors.accent,
                  paddingLeft: '5px'
                }
              }}>Mergers & Acquisitions</a></li>
              <li style={{ marginBottom: '12px' }}><a href="#" style={{ 
                color: '#a0aec0', 
                textDecoration: 'none', 
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: websiteTheme.colors.accent,
                  paddingLeft: '5px'
                }
              }}>Global Expansion</a></li>
              <li style={{ marginBottom: '12px' }}><a href="#" style={{ 
                color: '#a0aec0', 
                textDecoration: 'none', 
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: websiteTheme.colors.accent,
                  paddingLeft: '5px'
                }
              }}>Digital Transformation</a></li>
              <li style={{ marginBottom: '12px' }}><a href="#" style={{ 
                color: '#a0aec0', 
                textDecoration: 'none', 
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: websiteTheme.colors.accent,
                  paddingLeft: '5px'
                }
              }}>Operational Excellence</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '25px', 
              position: 'relative', 
              paddingBottom: '10px',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '40px',
                height: '3px',
                backgroundColor: websiteTheme.colors.accent,
                bottom: '0',
                left: '0'
              }
            }}>Company</h3>
            <ul className="footer-links" style={{ listStyle: 'none' }}>
              <li style={{ marginBottom: '12px' }}><a href="#" style={{ 
                color: '#a0aec0', 
                textDecoration: 'none', 
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: websiteTheme.colors.accent,
                  paddingLeft: '5px'
                }
              }}>About Us</a></li>
              <li style={{ marginBottom: '12px' }}><a href="#" style={{ 
                color: '#a0aec0', 
                textDecoration: 'none', 
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: websiteTheme.colors.accent,
                  paddingLeft: '5px'
                }
              }}>Leadership</a></li>
              <li style={{ marginBottom: '12px' }}><a href="#" style={{ 
                color: '#a0aec0', 
                textDecoration: 'none', 
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: websiteTheme.colors.accent,
                  paddingLeft: '5px'
                }
              }}>Careers</a></li>
              <li style={{ marginBottom: '12px' }}><a href="#" style={{ 
                color: '#a0aec0', 
                textDecoration: 'none', 
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: websiteTheme.colors.accent,
                  paddingLeft: '5px'
                }
              }}>Insights</a></li>
              <li style={{ marginBottom: '12px' }}><a href="#" style={{ 
                color: '#a0aec0', 
                textDecoration: 'none', 
                transition: 'color 0.3s ease',
                '&:hover': {
                  color: websiteTheme.colors.accent,
                  paddingLeft: '5px'
                }
              }}>Contact</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h3 style={{ 
              fontSize: '1.3rem', 
              marginBottom: '25px', 
              position: 'relative', 
              paddingBottom: '10px',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '40px',
                height: '3px',
                backgroundColor: websiteTheme.colors.accent,
                bottom: '0',
                left: '0'
              }
            }}>Contact Us</h3>
            <ul className="contact-info" style={{ listStyle: 'none' }}>
              <li style={{ 
                display: 'flex', 
                gap: '15px', 
                marginBottom: '20px', 
                alignItems: 'flex-start' 
              }}>
                <FaMapMarkerAlt style={{ color: websiteTheme.colors.accent, marginTop: '5px' }} />
                <span>123 Business Avenue, Financial District, New York, NY 10001</span>
              </li>
              <li style={{ 
                display: 'flex', 
                gap: '15px', 
                marginBottom: '20px', 
                alignItems: 'flex-start' 
              }}>
                <FaPhone style={{ color: websiteTheme.colors.accent, marginTop: '5px' }} />
                <span>+1 (212) 555-7890</span>
              </li>
              <li style={{ 
                display: 'flex', 
                gap: '15px', 
                marginBottom: '20px', 
                alignItems: 'flex-start' 
              }}>
                <FaEnvelope style={{ color: websiteTheme.colors.accent, marginTop: '5px' }} />
                <span>info@mazadzicz.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="copyright" style={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
        padding: '25px 0', 
        textAlign: 'center', 
        color: '#a0aec0', 
        fontSize: '0.9rem' 
      }}>
        <div className="container" style={{ 
          maxWidth: websiteTheme.sizes.containerWidth, 
          margin: '0 auto', 
          padding: '0 20px' 
        }}>
          <p>&copy; 2023 Mazadzicz. All Rights Reserved. | Designed with <FaHeart style={{ color: websiteTheme.colors.accent }} /></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;