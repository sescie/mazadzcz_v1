// client/src/components/Admin/AdminDashboard.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import TopNav from './AdminTopNav';
import AdminSidebar from './AdminSidebar';

export default function AdminDashboard() {
  return (
    <Box sx={{ display: 'flex' }}>
      <TopNav />
      <AdminSidebar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          marginTop: '64px', // Offset for TopNav
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: 'background.default'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}