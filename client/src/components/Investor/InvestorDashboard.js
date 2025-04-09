import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import InvestorSidebar from './InvestorSidebar';

export default function InvestorDashboard() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex' }}>
        <InvestorSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Container>
  );
}