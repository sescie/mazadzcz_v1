// src/pages/admin/AdminRequestsPage.jsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Paper
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchAllRequests,
  fetchInvestment,
  approveInvestmentRequest,
  rejectInvestmentRequest
} from '../../services/api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export default function AdminRequestsPage() {
  const { auth } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Approval Dialog state
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(null);
  const [livePrice, setLivePrice] = useState(0);
  const [units, setUnits] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [returnRate, setReturnRate] = useState(0);

  // Load all requests
  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllRequests(auth.token);
      setRows(data.map(r => ({ id: r.id, ...r })));
    } catch (e) {
      setError(e.message || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Open the modal when Approve clicked
  const handleOpen = async row => {
    setSel(row);
    try {
      const inv = await fetchInvestment(row.investment_id, auth.token);
      const price = inv.price;
      setLivePrice(price);
      const initUnits = row.amount / price;
      setPurchasePrice(price);
      setUnits(+initUnits.toFixed(6));
      setCurrentValue(+((initUnits * price).toFixed(2)));
      setReturnRate(0);
      setOpen(true);
    } catch {
      setError('Could not fetch investment data.');
    }
  };

  // Recalculate CV & RR as units/price change
  useEffect(() => {
    if (!livePrice) return;
    const cv = units * livePrice;
    setCurrentValue(+cv.toFixed(2));
    const rr = purchasePrice
      ? ((livePrice - purchasePrice) / purchasePrice) * 100
      : 0;
    setReturnRate(+rr.toFixed(2));
  }, [units, purchasePrice, livePrice]);

  // Confirm approval
  const handleConfirm = async () => {
    try {
      await approveInvestmentRequest(
        sel.id,
        { units, purchase_price: purchasePrice },
        auth.token
      );
      setOpen(false);
      loadRequests();
    } catch {
      setError('Approval failed.');
    }
  };

  // Reject
  const handleReject = async row => {
    try {
      await rejectInvestmentRequest(row.id, auth.token);
      loadRequests();
    } catch {
      setError('Reject failed.');
    }
  };

  // Columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'Req ID', width: 80 },
    { field: 'full_name', headerName: 'User', flex: 1, minWidth: 150 },
    { field: 'user_email', headerName: 'Email', flex: 1.5, minWidth: 180 },
    { field: 'investment_name', headerName: 'Investment', flex: 1, minWidth: 150 },
    {
      field: 'amount',
      headerName: 'Amt ($)',
      width: 100,
      valueFormatter: ({ value }) => `$${(value || 0).toLocaleString()}`
    },
    { field: 'status', headerName: 'Status', width: 100 },
    { field: 'created_at', headerName: 'Requested At', flex: 1, minWidth: 140 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <IconButton color="success" onClick={() => handleOpen(row)}>
            <CheckCircleIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleReject(row)}>
            <CancelIcon />
          </IconButton>
        </Stack>
      )
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Investment Requests
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ bgcolor: 'background.paper', p: 2 }}>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          pageSize={10}
          components={{ Toolbar: GridToolbar }}
        />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Approve & Assign</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, width: 360, mt: 1 }}>
          <TextField label="Live Price" value={livePrice} disabled />
          <TextField
            label="Purchase Price"
            type="number"
            value={purchasePrice}
            onChange={e => setPurchasePrice(parseFloat(e.target.value))}
          />
          <TextField
            label="Units"
            type="number"
            value={units}
            onChange={e => setUnits(parseFloat(e.target.value))}
          />
          <TextField label="Current Value" value={currentValue} disabled />
          <TextField label="Return Rate (%)" value={returnRate} disabled />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirm}>
            Confirm & Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
