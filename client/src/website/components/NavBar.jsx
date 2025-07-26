// NavBar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { 
  FaBars, FaTwitter, FaSearch, FaExternalLinkAlt, 
  FaTimes, FaUserAlt, FaUserPlus, FaSignOutAlt, FaTachometerAlt
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import websiteTheme from '../websiteTheme';
import '../styles/NavBar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen]       = useState(false);
  const [isScrolled, setIsScrolled]       = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const navRef = useRef(null);

  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

  /* --- Scroll & Outside-click handlers --- */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const handleClickOutside = e => {
      if (navRef.current && !navRef.current.contains(e.target)) {
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

  /* --- Menu toggle & dropdown logic --- */
  const toggleMenu = () => {
    setIsMenuOpen(o => !o);
    if (isMenuOpen) setHoveredDropdown(null);
  };

  const handleDropdownHover = name => {
    if (window.innerWidth > 768) setHoveredDropdown(name);
  };
  const handleDropdownLeave = () => {
    if (window.innerWidth > 768) setHoveredDropdown(null);
  };
  const handleMobileDropdownClick = name => {
    if (window.innerWidth <= 768) {
      setHoveredDropdown(h => (h === name ? null : name));
    }
  };

  return (
    <header ref={navRef}>
      {/* Shortcuts Bar */}
      <div className="shortcuts-bar">
        <div className="container">
          <div className="logo">
            <a href="/">
              <span>Mazadzi</span>
              <span className="accent">CZ</span>
            </a>
          </div>
          <div className="top-links">
            <a href="https://twitter.com/mazadzicz" target="_blank" rel="noreferrer">
              <FaTwitter /> Twitter
            </a>
            <a href="#">
              <FaSearch /> Search
            </a>
            <a href="#">
              <FaExternalLinkAlt /> Partners
            </a>

            {auth ? (
              <>
                <button onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
                <a 
                href={
                  auth.user?.role === 'admin'
                    ? '/admin/dashboard'
                    : '/investor/dashboard'
                }
                >
                  <FaTachometerAlt /> Dashboard
                </a>
              </>
            ) : (
              <>
                <a href="/login">
                  <FaUserAlt /> Login
                </a>
                <a href="/register">
                  <FaUserPlus /> Register
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`main-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="mobile-toggle">
            <button onClick={toggleMenu}>
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
          <div className={`flat-menu ${isMenuOpen ? 'expanded' : 'collapsed'}`}>
            <ul className="level0">
              {/* Home */}
              <li>
                <a href="/">Home</a>
              </li>

              {/* Repeat for each dropdown: Investments, About, Performance, Corporate, ESG, Media, How to Invest, Contact */}
              {Object.entries(dropdownItems).map(([key, items]) => (
                <li
                  key={key}
                  onMouseEnter={() => handleDropdownHover(key)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    onClick={() => handleMobileDropdownClick(key)}
                    aria-haspopup="true"
                    aria-expanded={hoveredDropdown === key}
                  >
                    {key}
                  </button>
                  <div className={`dropdown ${hoveredDropdown === key ? 'open' : ''}`}>
                    {items.map((item, i) => (
                      <a key={i} href={item.url}>{item.title}</a>
                    ))}
                  </div>
                </li>
              ))}

              {/* How to Invest */}
              <li>
                <a href="/how-to-invest">How to Invest</a>
              </li>
              {/* Contact */}
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
