import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import AdminSidebar from './AdminSidebar';

export default function AdminDashboard() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex' }}>
        <AdminSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
}