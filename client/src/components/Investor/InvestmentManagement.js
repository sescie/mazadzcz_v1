import React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', width: 200 },
  { field: 'name', headerName: 'Investment Name', width: 200 },
  { field: 'type', headerName: 'Type', width: 130 },
  { field: 'value', headerName: 'Current Value', width: 150 },
  { field: 'status', headerName: 'Status', width: 130 },
];

export default function InvestmentManagement() {
  // Temporary data
  const investments = [
    { id: 1, name: 'Global Tech Fund', type: 'Equity', value: '$15,000', status: 'Active' },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={investments}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
}