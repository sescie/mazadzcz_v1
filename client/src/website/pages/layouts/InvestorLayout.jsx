// src/layouts/InvestorLayout.jsx
import React from 'react';
import Sidebar from '../../components/InvestorSidebar';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { useAuth } from '../../../contexts/AuthContext';
import '../../styles/InvestmentDashboard.css';

export default function InvestorLayout({ children }) {
  const { auth } = useAuth();
  const user = auth?.user;


  console.log("InvestorLayout user:", user);

  return (
    <div className="investor-dashboard">
      <NavBar />
      <div className="dashboard-body">
        <Sidebar />
        <main className="dashboard-content">{children}</main>
      </div>

      <Footer />
    </div>
  );
}
