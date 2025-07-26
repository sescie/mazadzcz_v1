// src/pages/admin/AssignmentManagement.jsx

import React, { useState, useEffect } from 'react';
import {
  Box, Paper, Stack, Typography, Autocomplete, TextField,
  Snackbar, Alert, CircularProgress, IconButton, Button,
  Toolbar, Chip, useTheme, Fade, Avatar, Skeleton,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import {
  AddCircleOutline as AddIcon,
  RemoveCircleOutline as RemoveIcon,
  Refresh as RefreshIcon,
  AssignmentInd as AssignmentsIcon,
  PersonSearch as UserSearchIcon,
  AutoAwesomeMosaic as InvestmentsIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchUsers,
  fetchInvestments,
  fetchUserInvestments,
  assignInvestmentToUser,
  unassignInvestmentFromUser,
} from '../../services/api';

export default function AssignmentManagement() {
  const theme = useTheme();
  const { auth } = useAuth();

  // Data
  const [users, setUsers] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Selection
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedAssigned, setSelectedAssigned] = useState([]);

  // Loading & feedback
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingInv, setLoadingInv] = useState(true);
  const [loadingAssigned, setLoadingAssigned] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Dialog state
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [assignDetails, setAssignDetails] = useState([]);

  // --- Data loaders ---
  const loadInitialData = async () => {
    try {
      setLoadingUsers(true);
      const u = await fetchUsers(auth.token);
      setUsers(u);
      setLoadingUsers(false);

      setLoadingInv(true);
      const inv = await fetchInvestments(auth.token);
      setInvestments(inv);
      setLoadingInv(false);
    } catch {
      setError('Failed to load users or investments.');
      setLoadingUsers(false);
      setLoadingInv(false);
    }
  };

  const loadAssigned = async (userId) => {
    try {
      setLoadingAssigned(true);
      const a = await fetchUserInvestments(userId, auth.token);
      setAssigned(a);
      setLoadingAssigned(false);
    } catch {
      setError('Failed to load assigned investments.');
      setLoadingAssigned(false);
    }
  };

  // 🔑 Wrap async calls in arrow functions
  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadAssigned(selectedUser.id);
    } else {
      setAssigned([]);
    }
    setSelectedAvailable([]);
    setSelectedAssigned([]);
  }, [selectedUser]);

  // --- Available investments list ---
  const available = investments
    .filter(inv => !assigned.some(a => a.investment_id === inv.id))
    .map(inv => ({ id: inv.id, name: inv.name, asset_class: inv.asset_class, price: inv.price }));

  // --- Assign dialog handlers ---
  const handleOpenAssign = () => {
    const details = selectedAvailable.map(id => {
      const inv = investments.find(i => i.id === id);
      return {
        investmentId: id,
        name: inv.name,
        units: '',
        purchase_price: inv.price,
        notes: ''
      };
    });
    setAssignDetails(details);
    setOpenAssignDialog(true);
  };

  const updateDetail = (idx, field, value) => {
    setAssignDetails(dd => {
      const copy = [...dd];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const handleConfirmAssign = async () => {
    try {
      for (const detail of assignDetails) {
        const { investmentId, units, purchase_price, notes } = detail;
        if (!units || !purchase_price) {
          throw new Error('Units and purchase price are required for all selections.');
        }
        await assignInvestmentToUser(
          selectedUser.id,
          investmentId,
          { units, purchase_price, notes },
          auth.token
        );
      }
      setSuccessMessage('Investments assigned successfully.');
      setOpenAssignDialog(false);
      setSelectedAvailable([]);
      loadAssigned(selectedUser.id);
    } catch (err) {
      setError(err.message || 'Assignment failed.');
    }
  };

  // --- Unassign handler ---
  const handleUnassign = async () => {
    try {
      for (const id of selectedAssigned) {
        await unassignInvestmentFromUser(selectedUser.id, id, auth.token);
      }
      setSuccessMessage('Unassigned successfully.');
      loadAssigned(selectedUser.id);
      setSelectedAssigned([]);
    } catch {
      setError('Failed to unassign investments.');
    }
  };

  // --- UI Components ---
  const PremiumHeader = () => (
    <Box sx={{ p: 2, mb: 3, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <AssignmentsIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
        <Box>
          <Typography variant="h5" fontWeight={600}>Investment Assignment Manager</Typography>
          <Typography variant="body2" color="text.secondary">Manage investor-investment relationships</Typography>
        </Box>
      </Stack>
    </Box>
  );

  const StatsPanel = () => (
    <Fade in={!!selectedUser}>
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
          <Typography variant="overline" color="text.secondary">Total Assigned</Typography>
          <Typography variant="h4" color="primary">{assigned.length}</Typography>
        </Paper>
        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
          <Typography variant="overline" color="text.secondary">Available</Typography>
          <Typography variant="h4">{available.length}</Typography>
        </Paper>
        <Paper sx={{ p: 2, borderRadius: 2, bgcolor: 'background.paper' }}>
          <Typography variant="overline" color="text.secondary">Investment Types</Typography>
          <Stack direction="row" spacing={1} mt={1}>
            {[...new Set(investments.map(i => i.asset_class))].map(t => (
              <Chip key={t} label={t} size="small" />
            ))}
          </Stack>
        </Paper>
      </Stack>
    </Fade>
  );

  const UserSelector = () => (
    <Autocomplete
      options={users}
      getOptionLabel={u => u.full_name || u.email}
      value={selectedUser}
      onChange={(_, u) => setSelectedUser(u)}
      loading={loadingUsers}
      renderInput={params => (
        <TextField
          {...params}
          label="Select Investor"
          InputProps={{
            ...params.InputProps,
            startAdornment: <UserSearchIcon sx={{ mr: 1 }} />,
            endAdornment: loadingUsers ? <CircularProgress size={20} /> : params.InputProps.endAdornment
          }}
        />
      )}
      sx={{ width: 300 }}
    />
  );

  const DataPane = ({ title, rows, loading, selected, onSelect, onAction, actionIcon, actionLabel }) => (
    <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <InvestmentsIcon />
          <Typography variant="subtitle1">{title}</Typography>
          {loading && <CircularProgress size={18} />}
        </Stack>
      </Box>

      <Box sx={{ flex: 1, minHeight: 300 }}>
        {loading ? (
          <Box p={2}>
            {[...Array(5)].map((_, i) => <Skeleton key={i} height={56} sx={{ my: 1 }} />)}
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={[
              { field: 'name', headerName: 'Name', flex: 1 },
              { field: 'asset_class', headerName: 'Class', flex: 1 }
            ]}
            checkboxSelection
            rowSelectionModel={selected}
            onRowSelectionModelChange={onSelect}
            components={{ Toolbar: GridToolbar }}
          />
        )}
      </Box>

      <Box sx={{ p: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onAction}
          disabled={!selectedUser || selected.length === 0}
          startIcon={actionIcon}
        >
          {actionLabel}
        </Button>
      </Box>
    </Paper>
  );

  return (
    <Box p={3}>
      <PremiumHeader />

      <Toolbar disableGutters sx={{ mb: 2 }}>
        <IconButton onClick={loadInitialData}>
          <RefreshIcon />
        </IconButton>
        <UserSelector />
      </Toolbar>

      {selectedUser && <StatsPanel />}

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
        <DataPane
          title="Available Investments"
          rows={available}
          loading={loadingInv}
          selected={selectedAvailable}
          onSelect={setSelectedAvailable}
          onAction={handleOpenAssign}
          actionIcon={<AddIcon />}
          actionLabel="Assign Selected"
        />
        <DataPane
          title="Assigned Investments"
          rows={assigned.map(a => ({
            id: a.id,
            name: a.name,
            asset_class: a.asset_class
          }))}
          loading={loadingAssigned}
          selected={selectedAssigned}
          onSelect={setSelectedAssigned}
          onAction={handleUnassign}
          actionIcon={<RemoveIcon />}
          actionLabel="Unassign Selected"
        />
      </Stack>

      {/* Assign Dialog */}
      <Dialog open={openAssignDialog} onClose={() => setOpenAssignDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Assign Investments</DialogTitle>
        <DialogContent dividers>
          {assignDetails.map((d, i) => (
            <Paper key={d.investmentId} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2">{d.name}</Typography>
              <Stack direction="row" spacing={2} mt={1}>
                <TextField
                  label="Units"
                  type="number"
                  value={d.units}
                  onChange={e => updateDetail(i, 'units', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Price"
                  type="number"
                  value={d.purchase_price}
                  onChange={e => updateDetail(i, 'purchase_price', e.target.value)}
                  fullWidth
                />
              </Stack>
              <TextField
                label="Notes"
                value={d.notes}
                onChange={e => updateDetail(i, 'notes', e.target.value)}
                fullWidth
                multiline
                rows={2}
                sx={{ mt: 2 }}
              />
            </Paper>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmAssign}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={!!error} autoHideDuration={5000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>

      <Snackbar open={!!successMessage} autoHideDuration={4000} onClose={() => setSuccessMessage(null)}>
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>{successMessage}</Alert>
      </Snackbar>
    </Box>
  );
}
