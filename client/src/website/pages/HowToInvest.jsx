import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import websiteTheme from '../websiteTheme';

const HowToInvest = () => {
  return (
    <div>
      <Navbar />

    {/* Hero Section */}
    <section
        className="howto-hero"
        style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1650&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '120px 20px',
            color: 'white',
            textAlign: 'center',
        }}
    >
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
            How to Invest with MazadziCZ
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
            Follow these simple steps to start your investment journey. We’ll review your request and guide you every step of the way.
        </p>
    </section>

    {/* Steps Section */}
    <section
        className="howto-steps"
        style={{
            padding: '80px 20px',
            backgroundColor: websiteTheme.colors.light,
        }}
    >
        <div
            className="container"
            style={{
                maxWidth: websiteTheme.sizes.containerWidth,
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))',
                gap: '40px',
            }}
        >
            {/* Step 1 */}
            <div
                className="step-card"
                style={{
                    textAlign: 'center',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    padding: '36px 24px',
                    transition: 'box-shadow 0.2s',
                }}
            >
                <div
                    style={{
                        width: 56,
                        height: 56,
                        margin: '0 auto 20px',
                        borderRadius: '50%',
                        background: websiteTheme.colors.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 28,
                        fontWeight: 700,
                    }}
                >
                    1
                </div>
                <h3 style={{ color: websiteTheme.colors.primary }}>Sign Up or Log In</h3>
                <p style={{ color: websiteTheme.colors.gray }}>
                    Go to <a href="/register">Register</a> if you’re new, or <a href="/login">Login</a> to your account to get started.
                </p>
            </div>

            {/* Step 2 */}
            <div
                className="step-card"
                style={{
                    textAlign: 'center',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    padding: '36px 24px',
                    transition: 'box-shadow 0.2s',
                }}
            >
                <div
                    style={{
                        width: 56,
                        height: 56,
                        margin: '0 auto 20px',
                        borderRadius: '50%',
                        background: websiteTheme.colors.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 28,
                        fontWeight: 700,
                    }}
                >
                    2
                </div>
                <h3 style={{ color: websiteTheme.colors.primary }}>Request to Invest</h3>
                <p style={{ color: websiteTheme.colors.gray }}>
                    In your dashboard, click “Make a Request” and fill out your investment details.
                </p>
            </div>

            {/* Step 3 */}
            <div
                className="step-card"
                style={{
                    textAlign: 'center',
                    background: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    padding: '36px 24px',
                    transition: 'box-shadow 0.2s',
                }}
            >
                <div
                    style={{
                        width: 56,
                        height: 56,
                        margin: '0 auto 20px',
                        borderRadius: '50%',
                        background: websiteTheme.colors.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 28,
                        fontWeight: 700,
                    }}
                >
                    3
                </div>
                <h3 style={{ color: websiteTheme.colors.primary }}>Admin Review</h3>
                <p style={{ color: websiteTheme.colors.gray }}>
                    Our team will contact you, review your request, and approve your investment.
                </p>
            </div>
        </div>
    </section>
      <section
        className="howto-cta"
        style={{
          padding: '60px 20px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ color: websiteTheme.colors.primary, marginBottom: '20px' }}>
          Ready to Grow Your Wealth?
        </h2>
        <a
          href="/register"
          style={{
            display: 'inline-block',
            padding: '12px 30px',
            backgroundColor: websiteTheme.colors.accent,
            color: 'white',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          Get Started
        </a>
      </section>

      <Footer />
    </div>
  );
};

export default HowToInvest;
