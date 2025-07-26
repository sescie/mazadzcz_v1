import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  IconButton,
  Stack,
  Alert,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../../contexts/AuthContext';
import {
  getPendingUsers,
  approveUser,
  unApproveUser
} from '../../services/api';

export default function AdminUserApprovalsPage() {
  const { auth } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selected, setSelected] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const loadPendingUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const users = await getPendingUsers(auth.token);
      setRows(users.map(user => ({ id: user.id, ...user })));
    } catch (e) {
      setError(e.message || 'Failed to load pending users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const handleApprove = async user => {
    try {
      await approveUser(user.id, auth.token);
      loadPendingUsers();
      setSuccess(`Approved ${user.full_name}`);
    } catch {
      setError('Approval failed.');
    }
  };

  const handleReject = async user => {
    try {
      await unApproveUser(user.id, auth.token);
      loadPendingUsers();
      setSuccess(`Rejected ${user.full_name}`);
    } catch {
      setError('Unapproval failed.');
    }
  };

  const handleBulkApprove = async () => {
    setConfirmOpen(false);
    try {
      await Promise.all(
        selected.map(id => approveUser(id, auth.token))
      );
      setSuccess(`Approved ${selected.length} user(s).`);
      setSelected([]);
      loadPendingUsers();
    } catch {
      setError('Bulk approval failed.');
    }
  };

  const columns = [
    { field: 'id', headerName: 'User ID', width: 80 },
    { field: 'full_name', headerName: 'Full Name', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 180 },
    { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 150 },
    { field: 'created_at', headerName: 'Registered At', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 160,
      sortable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <IconButton color="success" onClick={() => setConfirmOpen(true)}>
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
        Approve New Users
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {selected.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setConfirmOpen(true)}
          >
            Approve Selected ({selected.length})
          </Button>
        </Box>
      )}

      <Paper sx={{ bgcolor: 'background.paper', p: 2 }}>
        <DataGrid
          autoHeight
          rows={rows}
          columns={columns}
          pageSize={10}
          checkboxSelection
          onRowSelectionModelChange={setSelected}
          rowSelectionModel={selected}
          components={{ Toolbar: GridToolbar }}
        />
      </Paper>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Bulk Approval</DialogTitle>
        <DialogContent>
          Are you sure you want to approve {selected.length} selected user(s)?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleBulkApprove} color="primary" variant="contained">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
