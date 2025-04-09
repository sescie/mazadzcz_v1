// client/src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import theme from './theme';
import AppErrorBoundary from './components/Error/AppErrorBoundary';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminDashboard from './components/Admin/AdminDashboard';
import InvestorDashboard from './components/Investor/InvestorDashboard';
import UserManagement from './components/Admin/UserManagement';
import InvestmentManagement from './components/Investor/InvestmentManagement';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// 💡 Core Concept: Route Protection & Role-Based Access Control (RBAC)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// 💡 Jargon: Higher-Order Component (HOC) for public routes
const AuthRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <AppErrorBoundary>
      <CssBaseline />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />
        <Route path="/register" element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route path="users" element={<UserManagement />} />
          <Route path="investments" element={<InvestmentManagement />} />
        </Route>

        {/* Protected Investor Routes */}
        <Route path="/investor/*" element={
          <ProtectedRoute allowedRoles={['investor']}>
            <InvestorDashboard />
          </ProtectedRoute>
        }>
          <Route path="portfolio" element={<InvestmentManagement />} />
        </Route>

        {/* Root Redirect */}
        <Route path="/" element={
          user?.role === 'admin' ? (
            <Navigate to="/admin/users" replace />
          ) : (
            <Navigate to="/investor/portfolio" replace />
          )
        } />
        
        {/* 404 Handling */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppErrorBoundary>
  );
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}