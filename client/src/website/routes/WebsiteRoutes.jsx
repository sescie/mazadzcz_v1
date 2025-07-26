import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomePage         from '../pages/HomePage';
import AboutPage        from '../pages/AboutPage';
import ContactPage      from '../pages/ContactPage';
import HowToInvest      from '../pages/HowToInvest';
import Investments      from '../pages/Investments';             // public investments page
import LoginPage        from '../pages/LoginPage';
import RegisterPage     from '../pages/RegisterPage';
import InvestorHome     from '../pages/investorDashboard/index'; // dashboard home
import InvestmentsList  from '../pages/investorDashboard/investments';
import NotFound         from '../pages/NotFoundPage';
import RequestsList from '../pages/investorDashboard/RequestsList';
import NewRequest   from '../pages/investorDashboard/requestInvestment';
import Profile from '../pages/investorDashboard/Profile';

// Protects any route so only investors can see it
function ProtectedRoute({ children }) {
  const { auth } = useAuth();
  return auth?.user?.role === 'investor'
    ? children
    : <Navigate to="/login" replace />;
}

export default function WebsiteRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="how-to-invest" element={<HowToInvest />} />
      <Route path="investments" element={<Investments />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />

      {/* Investor pages, all guarded */}
      <Route
        path="investor/dashboard"
        element={
          <ProtectedRoute>
            <InvestorHome />
          </ProtectedRoute>
        }
      />

      <Route
        path="investor/investments"
        element={
          <ProtectedRoute>
            <InvestmentsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="investor/requests"
        element={
          <ProtectedRoute>
            <RequestsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="investor/requests/new"
        element={
          <ProtectedRoute>
            <NewRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="investor/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Fallback 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
