import React from 'react';
import Navbar from '../components/NavBar';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';
import websiteTheme from '../websiteTheme';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <Hero
        title="Shape the Future. Invest with Confidence."
        subtitle="At Mazadzicz, we empower visionaries and pioneers to unlock new horizons. Join a community where ambition meets expertise, and your investments fuel tomorrow’s success stories."
        ctaText="Start Your Journey"
        ctaLink="/contact"
      />

      {/* Services Section */}
      <section className="services" style={{
        padding: '100px 0',
        backgroundColor: websiteTheme.colors.light
      }}>
        <div className="container" style={{
          maxWidth: websiteTheme.sizes.containerWidth,
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div className="section-title" style={{
            textAlign: 'center',
            marginBottom: '60px'
          }}>
            <h2 style={{
              fontSize: '2.5rem',
              color: websiteTheme.colors.primary,
              marginBottom: '15px',
              position: 'relative',
              display: 'inline-block'
            }}>
              Unlock Limitless Opportunities
            </h2>
            <p style={{
              color: websiteTheme.colors.gray,
              maxWidth: '700px',
              margin: '20px auto 0',
              fontSize: '1.1rem'
            }}>
              Discover a world where your capital creates impact. Our tailored solutions are designed to help you grow, protect, and transform your investments—so you can leave a legacy that lasts.
            </p>
          </div>

          <div className="services-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px'
          }}>
            <FeatureCard
              icon="chart"
              title="Strategic Advisory"
              description="Partner with experts who see beyond the numbers. We guide you to make bold, informed decisions that shape industries and change lives."
            />
            <FeatureCard
              icon="handshake"
              title="Mergers & Acquisitions"
              description="Seize opportunities with confidence. Our team navigates complex transactions, ensuring your investments drive real, sustainable growth."
            />
            <FeatureCard
              icon="globe"
              title="Global Expansion"
              description="Break boundaries and reach new markets. We help you expand your vision, connecting you with global partners and possibilities."
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" style={{ padding: '100px 0', backgroundColor: 'white' }}>
        <div className="container" style={{
          maxWidth: websiteTheme.sizes.containerWidth,
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div className="about-content" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '50px',
            alignItems: 'center'
          }}>
            <div className="about-text">
              <h2 style={{
                fontSize: '2.5rem',
                color: websiteTheme.colors.primary,
                marginBottom: '25px',
                position: 'relative',
                paddingBottom: '15px'
              }}>
                Why Invest with Mazadzicz?
              </h2>
              <p style={{
                marginBottom: '20px',
                color: websiteTheme.colors.gray,
                fontWeight: 500
              }}>
                Since 2010, Mazadzicz has been the trusted partner for visionaries who dare to dream bigger. Our legacy is built on empowering investors to achieve extraordinary results—across industries, across borders.
              </p>
              <p style={{
                marginBottom: '20px',
                color: websiteTheme.colors.gray
              }}>
                We believe in more than just numbers. We believe in your ambition, your drive, and your potential to shape the future. With our expertise and your vision, there are no limits to what we can achieve together.
              </p>

              <div className="stats" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
                marginTop: '30px'
              }}>
                <div className="stat-item" style={{
                  textAlign: 'center',
                  padding: '20px',
                  backgroundColor: websiteTheme.colors.light,
                  borderRadius: '10px'
                }}>
                  <h3 style={{
                    fontSize: '2.5rem',
                    color: websiteTheme.colors.accent,
                    marginBottom: '5px'
                  }}>250+</h3>
                  <p style={{ fontWeight: 600, color: websiteTheme.colors.primary }}>Projects Transformed</p>
                </div>
                <div className="stat-item" style={{
                  textAlign: 'center',
                  padding: '20px',
                  backgroundColor: websiteTheme.colors.light,
                  borderRadius: '10px'
                }}>
                  <h3 style={{
                    fontSize: '2.5rem',
                    color: websiteTheme.colors.accent,
                    marginBottom: '5px'
                  }}>15+</h3>
                  <p style={{ fontWeight: 600, color: websiteTheme.colors.primary }}>Years of Impact</p>
                </div>
                <div className="stat-item" style={{
                  textAlign: 'center',
                  padding: '20px',
                  backgroundColor: websiteTheme.colors.light,
                  borderRadius: '10px'
                }}>
                  <h3 style={{
                    fontSize: '2.5rem',
                    color: websiteTheme.colors.accent,
                    marginBottom: '5px'
                  }}>50+</h3>
                  <p style={{ fontWeight: 600, color: websiteTheme.colors.primary }}>Global Partnerships</p>
                </div>
              </div>
            </div>

            <div className="about-image" style={{
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)',
              position: 'relative'
            }}>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                alt="Mazadzicz Team"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta" style={{
        background: websiteTheme.colors.primary,
        color: 'white',
        padding: '80px 0',
        textAlign: 'center'
      }}>
        <div className="container" style={{
          maxWidth: websiteTheme.sizes.containerWidth,
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <h2 style={{
            fontSize: '2.2rem',
            marginBottom: '20px',
            fontWeight: 700
          }}>
            Ready to Invest in Your Future?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            marginBottom: '35px',
            maxWidth: '600px',
            margin: '0 auto 35px'
          }}>
            Take the first step towards a brighter tomorrow. Connect with our team and discover how Mazadzicz can help you turn your vision into reality. The future belongs to those who invest in it—make your move today.
          </p>
          <a
            href="/contact"
            style={{
              background: websiteTheme.colors.accent,
              color: 'white',
              padding: '16px 40px',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1.1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
            }}
          >
            Get Started
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;