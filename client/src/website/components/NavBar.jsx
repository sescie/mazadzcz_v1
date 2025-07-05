import React, { useState, useEffect, useRef } from 'react';
import { 
  FaBars, FaTwitter, FaSearch, FaExternalLinkAlt, 
  FaTimes, FaUserAlt, FaUserPlus
} from 'react-icons/fa';
import websiteTheme from '../websiteTheme';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const navRef = useRef(null);
  
  const dropdownItems = {
    about: [
      { title: "Investment Policy", url: "#" },
      { title: "Portfolio Manager", url: "#" },
      { title: "Trust Characteristics", url: "#" },
      { title: "Board & Policies", url: "#" },
      { title: "AIFM & Advisers", url: "#" }
    ],
    Investments: [
      { title: "All", url: "/Investments" },
      { title: "Equity", url: "/Investments" },
      { title: "Funds", url: "/Investments" },
      { title: "Bonds", url: "#" },
      { title: "CoinBidex", url: "#" }
    ],
    performance: [
      { title: "Share Price Information", url: "#" },
      { title: "Monthly Factsheets", url: "#" },
      { title: "Research & Analysis", url: "#" },
      { title: "Performance History", url: "#" }
    ],
    corporate: [
      { title: "Annual Reports", url: "#" },
      { title: "Investor Updates", url: "#" },
      { title: "Announcements (RNS)", url: "#" },
      { title: "Calendars", url: "#" },
      { title: "Dividends", url: "#" },
      { title: "Terms of Reference", url: "#" }
    ],
    media: [
      { title: "Awards", url: "#" },
      { title: "Email Alerts", url: "#" },
      { title: "Press Coverage", url: "#" },
      { title: "Video", url: "#" }
    ]
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMenuOpen(false);
        setHoveredDropdown(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) setHoveredDropdown(null);
  };

  const handleDropdownHover = (dropdown) => {
    if (window.innerWidth > 768) {
      setHoveredDropdown(dropdown);
    }
  };

  const handleDropdownLeave = () => {
    if (window.innerWidth > 768) {
      setHoveredDropdown(null);
    }
  };

  const handleMobileDropdownClick = (dropdown) => {
    if (window.innerWidth <= 768) {
      if (hoveredDropdown === dropdown) {
        setHoveredDropdown(null);
      } else {
        setHoveredDropdown(dropdown);
      }
    }
  };

  return (
    <header ref={navRef}>
      {/* Shortcuts Bar */}
      <div style={{ 
        backgroundColor: websiteTheme.colors.primary, 
        padding: '10px 0',
        position: 'sticky',
        top: 0,
        zIndex: 1100
      }}>
        <div style={{ 
          maxWidth: websiteTheme.sizes.containerWidth, 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div className="logo">
            <a href="/" style={{ 
              color: 'white', 
              fontSize: '26px', 
              fontWeight: '700', 
              textDecoration: 'none',
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span>Mazadzi</span>
              <span style={{ color: websiteTheme.colors.accent }}>CZ</span>
            </a>
          </div>
          <div className="top-links" style={{ 
            display: 'flex', 
            gap: '25px', 
            alignItems: 'center' 
          }}>
            <a href="https://twitter.com/mazadzicz" target="_blank" rel="noreferrer" style={{ 
              color: 'rgba(255, 255, 255, 0.85)', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.2s ease',
              fontSize: '14px',
              ':hover': {
                color: 'white'
              }
            }}>
              <FaTwitter style={{ fontSize: '16px' }} /> Twitter
            </a>
            <a href="#" style={{ 
              color: 'rgba(255, 255, 255, 0.85)', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.2s ease',
              fontSize: '14px',
              ':hover': {
                color: 'white'
              }
            }}>
              <FaSearch style={{ fontSize: '16px' }} /> Search
            </a>
            <a href="#" style={{ 
              color: 'rgba(255, 255, 255, 0.85)', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.2s ease',
              fontSize: '14px',
              ':hover': {
                color: 'white'
              }
            }}>
              <FaExternalLinkAlt style={{ fontSize: '16px' }} /> Partners
            </a>
            <a href="/login" style={{ 
              color: 'rgba(255, 255, 255, 0.85)', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.2s ease',
              fontSize: '14px',
              ':hover': {
                color: 'white'
              }
            }}>
              <FaUserAlt style={{ fontSize: '16px' }} /> Login
            </a>
            <a href="/register" style={{ 
              color: 'rgba(255, 255, 255, 0.85)', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'color 0.2s ease',
              fontSize: '14px',
              ':hover': {
                color: 'white'
              }
            }}>
              <FaUserPlus style={{ fontSize: '16px' }} /> Register
            </a>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <nav style={{ 
        backgroundColor: 'white', 
        boxShadow: isScrolled ? '0 5px 20px rgba(0, 0, 0, 0.1)' : '0 2px 10px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: '46px',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        height: '70px'
      }}>
        <div style={{ 
          maxWidth: websiteTheme.sizes.containerWidth, 
          margin: '0 auto', 
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%'
        }}>
          <div className="mobile-toggle" style={{ 
            display: 'none', 
            alignItems: 'center',
            '@media (max-width: 768px)': {
              display: 'flex'
            }
          }}>
            <button onClick={toggleMenu} style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '10px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {isMenuOpen ? (
                <FaTimes style={{ fontSize: '24px', color: websiteTheme.colors.primary }} />
              ) : (
                <FaBars style={{ fontSize: '24px', color: websiteTheme.colors.primary }} />
              )}
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <div className="flat-menu" style={{ 
            display: 'flex',
            height: '100%',
            '@media (max-width: 768px)': {
              display: isMenuOpen ? 'flex' : 'none',
              position: 'fixed',
              top: '116px',
              left: 0,
              width: '100%',
              height: 'calc(100vh - 116px)',
              backgroundColor: 'white',
              padding: '20px 0',
              transition: 'all 0.4s ease',
              overflowY: 'auto',
              zIndex: 1000,
              flexDirection: 'column'
            }
          }}>
            <ul className="level0" style={{ 
              listStyle: 'none', 
              display: 'flex',
              height: '100%',
              margin: 0,
              padding: 0,
              '@media (max-width: 768px)': {
                flexDirection: 'column',
                width: '100%'
              }
            }}>
              {/* Home */}
              <li style={{ 
                position: 'relative', 
                height: '100%',
                '@media (max-width: 768px)': {
                  width: '100%',
                  height: 'auto',
                  borderBottom: `1px solid ${websiteTheme.colors.lightGray}`
                }
              }}>
                <a href="/" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  padding: '0 22px',
                  textDecoration: 'none', 
                  color: websiteTheme.colors.primary, 
                  fontWeight: 600, 
                  position: 'relative',
                  fontSize: '15px',
                  letterSpacing: '0.3px',
                  transition: 'color 0.2s ease',
                  '@media (max-width: 768px)': {
                    padding: '18px 25px',
                    height: 'auto'
                  }
                }}>Home</a>
              </li>

              {/* Investments Dropdown */}
              <li 
                style={{ 
                  position: 'relative', 
                  height: '100%',
                  '@media (max-width: 768px)': {
                    width: '100%',
                    height: 'auto',
                    borderBottom: `1px solid ${websiteTheme.colors.lightGray}`
                  }
                }}
                onMouseEnter={() => handleDropdownHover('investments')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() => handleMobileDropdownClick('investments')}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    padding: '0 22px',
                    textDecoration: 'none',
                    color: websiteTheme.colors.primary,
                    fontWeight: 600,
                    position: 'relative',
                    fontSize: '15px',
                    letterSpacing: '0.3px',
                    transition: 'color 0.2s ease',
                    '@media (maxWidth: 768px)': {
                      padding: '18px 25px',
                      height: 'auto',
                      width: '100%',
                      textAlign: 'left',
                      justifyContent: 'space-between'
                    }
                  }}
                  aria-haspopup="true"
                  aria-expanded={hoveredDropdown === 'investments'}
                  onMouseEnter={() => handleDropdownHover('investments')}
                  onMouseLeave={handleDropdownLeave}
                >
                  Investments
                </button>
                
                {/* Dropdown */}
                <div 
                  style={{ 
                    display: hoveredDropdown === 'investments' ? 'block' : 'none',
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    minWidth: '240px',
                    backgroundColor: 'white',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                    zIndex: 100,
                    borderTop: `3px solid ${websiteTheme.colors.accent}`,
                    borderRadius: '0 0 6px 6px',
                    overflow: 'hidden',
                    '@media (max-width: 768px)': {
                      position: 'static',
                      boxShadow: 'none',
                      borderTop: 'none',
                      display: hoveredDropdown === 'investments' ? 'block' : 'none',
                      width: '100%'
                    }
                  }}
                  onMouseEnter={() => handleDropdownHover('investments')}
                  onMouseLeave={handleDropdownLeave}
                >
                  {dropdownItems.Investments.map((item, index) => (
                    <a 
                      key={index}
                      href={item.url}
                      style={{ 
                        display: 'block',
                        padding: '14px 22px',
                        textDecoration: 'none', 
                        color: websiteTheme.colors.text, 
                        fontWeight: 500,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        borderBottom: index < dropdownItems.Investments.length - 1 
                          ? '1px solid rgba(0, 0, 0, 0.05)' 
                          : 'none',
                        backgroundColor: 'white',
                        ':hover': {
                          backgroundColor: websiteTheme.colors.light,
                          color: websiteTheme.colors.accent,
                          paddingLeft: '28px'
                        },
                        '@media (max-width: 768px)': {
                          padding: '12px 25px 12px 35px',
                          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                        }
                      }}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </li>
              
              {/* About Us Dropdown */}
              <li 
                style={{ 
                  position: 'relative', 
                  height: '100%',
                  '@media (max-width: 768px)': {
                    width: '100%',
                    height: 'auto',
                    borderBottom: `1px solid ${websiteTheme.colors.lightGray}`
                  }
                }}
                onMouseEnter={() => handleDropdownHover('about')}
                onMouseLeave={handleDropdownLeave}
              >
                <a 
                  href="#"
                  onClick={() => handleMobileDropdownClick('about')}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    padding: '0 22px',
                    textDecoration: 'none', 
                    color: websiteTheme.colors.primary, 
                    fontWeight: 600, 
                    position: 'relative',
                    fontSize: '15px',
                    letterSpacing: '0.3px',
                    transition: 'color 0.2s ease',
                    '@media (max-width: 768px)': {
                      padding: '18px 25px',
                      height: 'auto',
                      width: '100%',
                      textAlign: 'left',
                      justifyContent: 'space-between'
                    }
                  }}
                >
                  About Us
                </a>
                
                {/* Dropdown */}
                <div 
                  style={{ 
                    display: hoveredDropdown === 'about' ? 'block' : 'none',
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    minWidth: '240px',
                    backgroundColor: 'white',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                    zIndex: 100,
                    borderTop: `3px solid ${websiteTheme.colors.accent}`,
                    borderRadius: '0 0 6px 6px',
                    overflow: 'hidden',
                    '@media (max-width: 768px)': {
                      position: 'static',
                      boxShadow: 'none',
                      borderTop: 'none',
                      display: hoveredDropdown === 'about' ? 'block' : 'none',
                      width: '100%'
                    }
                  }}
                  onMouseEnter={() => handleDropdownHover('about')}
                  onMouseLeave={handleDropdownLeave}
                >
                  {dropdownItems.about.map((item, index) => (
                    <a 
                      key={index}
                      href={item.url}
                      style={{ 
                        display: 'block',
                        padding: '14px 22px',
                        textDecoration: 'none', 
                        color: websiteTheme.colors.text, 
                        fontWeight: 500,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        borderBottom: index < dropdownItems.about.length - 1 
                          ? '1px solid rgba(0, 0, 0, 0.05)' 
                          : 'none',
                        backgroundColor: 'white',
                        ':hover': {
                          backgroundColor: websiteTheme.colors.light,
                          color: websiteTheme.colors.accent,
                          paddingLeft: '28px'
                        },
                        '@media (max-width: 768px)': {
                          padding: '12px 25px 12px 35px',
                          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                        }
                      }}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </li>
              
              {/* Performance Dropdown */}
              <li 
                style={{ 
                  position: 'relative', 
                  height: '100%',
                  '@media (max-width: 768px)': {
                    width: '100%',
                    height: 'auto',
                    borderBottom: `1px solid ${websiteTheme.colors.lightGray}`
                  }
                }}
                onMouseEnter={() => handleDropdownHover('performance')}
                onMouseLeave={handleDropdownLeave}
              >
                <a 
                  href="#"
                  onClick={() => handleMobileDropdownClick('performance')}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    padding: '0 22px',
                    textDecoration: 'none', 
                    color: websiteTheme.colors.primary, 
                    fontWeight: 600, 
                    position: 'relative',
                    fontSize: '15px',
                    letterSpacing: '0.3px',
                    transition: 'color 0.2s ease',
                    '@media (max-width: 768px)': {
                      padding: '18px 25px',
                      height: 'auto',
                      width: '100%',
                      textAlign: 'left',
                      justifyContent: 'space-between'
                    }
                  }}
                >
                  Performance
                </a>
                
                {/* Dropdown */}
                <div 
                  style={{ 
                    display: hoveredDropdown === 'performance' ? 'block' : 'none',
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    minWidth: '240px',
                    backgroundColor: 'white',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                    zIndex: 100,
                    borderTop: `3px solid ${websiteTheme.colors.accent}`,
                    borderRadius: '0 0 6px 6px',
                    overflow: 'hidden',
                    '@media (max-width: 768px)': {
                      position: 'static',
                      boxShadow: 'none',
                      borderTop: 'none',
                      display: hoveredDropdown === 'performance' ? 'block' : 'none',
                      width: '100%'
                    }
                  }}
                  onMouseEnter={() => handleDropdownHover('performance')}
                  onMouseLeave={handleDropdownLeave}
                >
                  {dropdownItems.performance.map((item, index) => (
                    <a 
                      key={index}
                      href={item.url}
                      style={{ 
                        display: 'block',
                        padding: '14px 22px',
                        textDecoration: 'none', 
                        color: websiteTheme.colors.text, 
                        fontWeight: 500,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        borderBottom: index < dropdownItems.performance.length - 1 
                          ? '1px solid rgba(0, 0, 0, 0.05)' 
                          : 'none',
                        backgroundColor: 'white',
                        ':hover': {
                          backgroundColor: websiteTheme.colors.light,
                          color: websiteTheme.colors.accent,
                          paddingLeft: '28px'
                        },
                        '@media (max-width: 768px)': {
                          padding: '12px 25px 12px 35px',
                          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                        }
                      }}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </li>
              
              {/* Corporate Info */}
              <li style={{ 
                position: 'relative', 
                height: '100%',
                '@media (max-width: 768px)': {
                  width: '100%',
                  height: 'auto',
                  borderBottom: `1px solid ${websiteTheme.colors.lightGray}`
                }
              }}>
                <a href="#" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  padding: '0 22px',
                  textDecoration: 'none', 
                  color: websiteTheme.colors.primary, 
                  fontWeight: 600, 
                  position: 'relative',
                  fontSize: '15px',
                  letterSpacing: '0.3px',
                    transition: 'color 0.2s ease',
                  '@media (max-width: 768px)': {
                    padding: '18px 25px',
                    height: 'auto'
                  }
                }}>Corporate Info</a>
              </li>
              
              {/* ESG */}
              <li style={{ 
                position: 'relative', 
                height: '100%',
                '@media (max-width: 768px)': {
                  width: '100%',
                  height: 'auto',
                  borderBottom: `1px solid ${websiteTheme.colors.lightGray}`
                }
              }}>
                <a href="#" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  padding: '0 22px',
                  textDecoration: 'none', 
                  color: websiteTheme.colors.primary, 
                  fontWeight: 600, 
                  position: 'relative',
                  fontSize: '15px',
                  letterSpacing: '0.3px',
                    transition: 'color 0.2s ease',
                  '@media (max-width: 768px)': {
                    padding: '18px 25px',
                    height: 'auto'
                  }
                }}>ESG</a>
              </li>
              
              {/* Media Dropdown */}
              <li 
                style={{ 
                  position: 'relative', 
                  height: '100%',
                  '@media (max-width: 768px)': {
                    width: '100%',
                    height: 'auto',
                    borderBottom: `1px solid ${websiteTheme.colors.lightGray}`
                  }
                }}
                onMouseEnter={() => handleDropdownHover('media')}
                onMouseLeave={handleDropdownLeave}
              >
                <a 
                  href="#"
                  onClick={() => handleMobileDropdownClick('media')}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    padding: '0 22px',
                    textDecoration: 'none', 
                    color: websiteTheme.colors.primary, 
                    fontWeight: 600, 
                    position: 'relative',
                    fontSize: '15px',
                    letterSpacing: '0.3px',
                    transition: 'color 0.2s ease',
                    '@media (max-width: 768px)': {
                      padding: '18px 25px',
                      height: 'auto',
                      width: '100%',
                      textAlign: 'left',
                      justifyContent: 'space-between'
                    }
                  }}
                >
                  Media
                </a>
                
                {/* Dropdown */}
                <div 
                  style={{ 
                    display: hoveredDropdown === 'media' ? 'block' : 'none',
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    minWidth: '240px',
                    backgroundColor: 'white',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                    zIndex: 100,
                    borderTop: `3px solid ${websiteTheme.colors.accent}`,
                    borderRadius: '0 0 6px 6px',
                    overflow: 'hidden',
                    '@media (max-width: 768px)': {
                      position: 'static',
                      boxShadow: 'none',
                      borderTop: 'none',
                      display: hoveredDropdown === 'media' ? 'block' : 'none',
                      width: '100%'
                    }
                  }}
                  onMouseEnter={() => handleDropdownHover('media')}
                  onMouseLeave={handleDropdownLeave}
                >
                  {dropdownItems.media.map((item, index) => (
                    <a 
                      key={index}
                      href={item.url}
                      style={{ 
                        display: 'block',
                        padding: '14px 22px',
                        textDecoration: 'none', 
                        color: websiteTheme.colors.text, 
                        fontWeight: 500,
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        borderBottom: index < dropdownItems.media.length - 1 
                          ? '1px solid rgba(0, 0, 0, 0.05)' 
                          : 'none',
                        backgroundColor: 'white',
                        ':hover': {
                          backgroundColor: websiteTheme.colors.light,
                          color: websiteTheme.colors.accent,
                          paddingLeft: '28px'
                        },
                        '@media (max-width: 768px)': {
                          padding: '12px 25px 12px 35px',
                          borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
                        }
                      }}
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              </li>
              
              {/* How to Invest */}
              <li style={{ 
                position: 'relative', 
                height: '100%',
                '@media (max-width: 768px)': {
                  width: '100%',
                  height: 'auto',
                  borderBottom: `1px solid ${websiteTheme.colors.lightGray}`
                }
              }}>
                <a href="/how-to-invest" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  padding: '0 22px',
                  textDecoration: 'none', 
                  color: websiteTheme.colors.primary, 
                  fontWeight: 600, 
                  position: 'relative',
                  fontSize: '15px',
                  letterSpacing: '0.3px',
                    transition: 'color 0.2s ease',
                  '@media (max-width: 768px)': {
                    padding: '18px 25px',
                    height: 'auto'
                  }
                }}>How to Invest</a>
              </li>
              
              {/* Contact */}
              <li style={{ 
                position: 'relative', 
                height: '100%',
                '@media (max-width: 768px)': {
                  width: '100%',
                  height: 'auto',
                  borderBottom: `1px solid ${websiteTheme.colors.lightGray}`
                }
              }}>
                <a href="#" style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  padding: '0 22px',
                  textDecoration: 'none', 
                  color: websiteTheme.colors.primary, 
                  fontWeight: 600, 
                  position: 'relative',
                  fontSize: '15px',
                  letterSpacing: '0.3px',
                    transition: 'color 0.2s ease',
                  '@media (max-width: 768px)': {
                    padding: '18px 25px',
                    height: 'auto'
                  }
                }}>Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;