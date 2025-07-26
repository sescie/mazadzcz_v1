// components/InvestorSidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import '../styles/InvestmentDashboard.css';

const menu = [
  { label: 'Dashboard', path: '/investor/dashboard', icon: '📊' },
  { label: 'Investments', path: '/investor/investments', icon: '💰' },
  { label: 'My Requests',     path: '/investor/requests',      icon: '📄' }, 
  { label: 'Request New',     path: '/investor/requests/new',  icon: '➕' },
  { label: 'Profile',         path: '/investor/profile',       icon: '👤' },
];

export default function InvestorSidebar() {
  const location = useLocation();

  return (
    <aside className="investor-sidebar">
      <div className="sidebar-avatar">
        <span className="avatar-icon">👤</span>
      </div>

      <ul className="sidebar-menu">
        {menu.map(({ label, path, icon }) => {
          const isActive = location.pathname === path;
          return (
            <li key={path} className={`sidebar-item ${isActive ? 'active' : ''}`}>
              <Link to={path} className="sidebar-link">
                <span className="sidebar-icon">{icon}</span>
                <span className="sidebar-label">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
