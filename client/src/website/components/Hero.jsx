import React from 'react';
import websiteTheme from '../websiteTheme';

const Hero = () => {
  return (
    <section className="hero" style={{ 
      background: `linear-gradient(rgba(26, 42, 74, 0.8), rgba(26, 42, 74, 0.8)), url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh',
      minHeight: '700px',
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      textAlign: 'center',
      position: 'relative',
    }}>
      <div className="container" style={{ 
        maxWidth: websiteTheme.sizes.containerWidth, 
        margin: '0 auto', 
        padding: '0 20px' 
      }}>
        <div className="hero-content" style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          padding: '20px' 
        }}>
          <h2 style={{ 
            fontSize: '3.5rem', 
            marginBottom: '20px', 
            fontWeight: 700, 
            lineHeight: 1.2 
          }}>Strategic Growth Partners for Global Enterprises</h2>
          <p style={{ 
            fontSize: '1.25rem', 
            marginBottom: '30px', 
            maxWidth: '600px', 
            marginLeft: 'auto', 
            marginRight: 'auto' 
          }}>We help ambitious businesses unlock their potential through innovative strategies and transformative solutions.</p>
          <a href="#" style={{ 
            display: 'inline-block', 
            backgroundColor: websiteTheme.colors.accent, 
            color: 'white', 
            padding: '15px 35px', 
            borderRadius: '30px', 
            textDecoration: 'none', 
            fontWeight: 600, 
            fontSize: '1.1rem', 
            transition: 'all 0.3s ease', 
            border: `2px solid ${websiteTheme.colors.accent}` 
          }}>Explore Our Services</a>
        </div>
      </div>
    </section>
  );
};

export default Hero;