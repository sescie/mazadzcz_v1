import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip } from '@mui/material';

const statusColors = {
  pending: 'default',
  verified: 'success',
  rejected: 'error'
};

const columns = [
  { field: 'full_name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1.5 },
  { field: 'role', headerName: 'Role', flex: 0.5 },
  { 
    field: 'kyc_status', 
    headerName: 'KYC Status', 
    flex: 0.8,
    renderCell: (params) => (
      <Chip 
        label={params.value} 
        color={statusColors[params.value] || 'default'} 
      />
    )
  }
];

export default function UserManagement({ users }) {
  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={users}
        columns={columns}
        pageSize={10}
        checkboxSelection
      />
    </div>
  );
}