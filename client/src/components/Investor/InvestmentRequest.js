import React, { useEffect, useState } from 'react';
import {
  Box, Tabs, Tab, Typography, Alert, CircularProgress,
  Stack, Dialog, DialogActions, DialogContent, DialogTitle,
  Button, TextField, Chip, Snackbar, Card, CardContent, CardActions,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Tooltip, InputAdornment, Divider, useTheme
} from '@mui/material';
import {
  RequestQuote as RequestIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as EquityIcon,
  AccountBalance as FixedIncomeIcon,
  Savings as FundIcon,
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllInvestments,
  fetchUserRequests,
  createInvestmentRequest,
  updateInvestmentRequest,
  cancelInvestmentRequest
} from '../../services/api';

const investmentTypeIcons = {
  EQUITY: <EquityIcon color="primary" />,
  FIXED_INCOME: <FixedIncomeIcon color="secondary" />,
  FUND: <FundIcon color="success" />,
  Other: <MoneyIcon color="action" />
};

const statusIcons = {
  Approved: <CheckIcon color="success" />,
  Rejected: <CloseIcon color="error" />,
  Pending: <PendingIcon color="warning" />
};

function TabPanel({ value, index, children }) {
  return (
    <Box sx={{ mt: 3 }} role="tabpanel" hidden={value !== index}>
      {value === index && children}
    </Box>
  );
}

export default function InvestmentRequest() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [tab, setTab] = useState(0);
  const [allInv, setAllInv] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedInv, setSelectedInv] = useState(null);
  const [form, setForm] = useState({ amount: '', notes: '' });
  const [editingReq, setEditingReq] = useState(null);
  const [feedback, setFeedback] = useState({ open: false, type: '', message: '' });

  const loadData = async () => {
    if (!auth.user) return;
    setLoading(true);
    try {
      const [invList, reqList] = await Promise.all([
        fetchAllInvestments(auth.token),
        fetchUserRequests(auth.user.id, auth.token)
      ]);
      setAllInv(invList);
      setRequests(reqList);
    } catch (e) {
      setFeedback({ open: true, type: 'error', message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [auth.user]);

  const openDialog = (inv, reqType) => {
    setSelectedInv(inv);
    const existing = requests.find(r =>
      r.investment_id === inv.id && r.status === 'Pending'
    );
    if (existing) {
      setForm({ amount: existing.amount.toString(), notes: existing.notes || '' });
      setEditingReq(existing.id);
    } else {
      setForm({ amount: inv.minimum_investment || '', notes: '' });
      setEditingReq(null);
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedInv(null);
    setForm({ amount: '', notes: '' });
    setEditingReq(null);
  };

  const handleViewInvestment = (investmentId) => {
    navigate(`/investor/investments/${investmentId}`);
  };

  const submitRequest = async () => {
    if (!selectedInv) return;
    try {
      if (editingReq) {
        await updateInvestmentRequest(
          auth.user.id,
          editingReq,
          { requestType: 'assign', amount: parseFloat(form.amount), notes: form.notes },
          auth.token
        );
        setFeedback({ open: true, type: 'success', message: 'Request updated successfully' });
      } else {
        await createInvestmentRequest(
          auth.user.id,
          selectedInv.id,
          parseFloat(form.amount),
          { type: 'assign', notes: form.notes },
          auth.token
        );
        setFeedback({ open: true, type: 'success', message: 'Request submitted successfully' });
      }
      closeDialog();
      loadData();
    } catch (e) {
      setFeedback({ open: true, type: 'error', message: e.message });
    }
  };

  const cancelReq = async (reqId) => {
    try {
      await cancelInvestmentRequest(auth.user.id, reqId, auth.token);
      setFeedback({ open: true, type: 'success', message: 'Request canceled successfully' });
      loadData();
    } catch (e) {
      setFeedback({ open: true, type: 'error', message: e.message });
    }
  };

  const pendingMap = new Set(
    requests.filter(r => r.status === 'Pending').map(r => r.investment_id)
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Investment Management
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Request new investments or manage your existing requests
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          '& .MuiTabs-indicator': {
            height: 4,
            borderRadius: 2
          }
        }}
      >
        <Tab label="My Requests" sx={{ fontWeight: 600 }} />
        <Tab label="Available Investments" sx={{ fontWeight: 600 }} />
      </Tabs>

      <Divider sx={{ my: 2 }} />

      {/* My Requests Table */}
      <TabPanel value={tab} index={0}>
        {requests.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No investment requests found
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            <Table sx={{ minWidth: 650 }} aria-label="investment requests table">
              <TableHead sx={{ bgcolor: theme.palette.background.default }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Investment</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Notes</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((request) => (
                  <TableRow
                    key={request.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Stack direction="row" alignItems="center" spacing={2}>
                        {investmentTypeIcons[request.investment_asset_class] || investmentTypeIcons.Other}
                        <Typography fontWeight={500}>{request.investment_name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight={500}>
                        ${Number(request.amount).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={statusIcons[request.status]}
                        label={request.status}
                        sx={{
                          fontWeight: 500,
                          backgroundColor:
                            request.status === 'Approved' ? theme.palette.success.light :
                            request.status === 'Rejected' ? theme.palette.error.light :
                            theme.palette.warning.light
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {request.notes || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Investment">
                          <IconButton
                            onClick={() => handleViewInvestment(request.investment_id)}
                            color="primary"
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        {request.status === 'Pending' && (
                          <>
                            <Tooltip title="Edit Request">
                              <IconButton
                                onClick={() => openDialog({
                                  id: request.investment_id,
                                  name: request.investment_name,
                                  minimum_investment: request.amount
                                })}
                                color="warning"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Cancel Request">
                              <IconButton
                                onClick={() => cancelReq(request.id)}
                                color="error"
                              >
                                <CancelIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* Available Investments Table */}
      <TabPanel value={tab} index={1}>
        <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
          <Table sx={{ minWidth: 650 }} aria-label="available investments table">
            <TableHead sx={{ bgcolor: theme.palette.background.default }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Investment</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Asset Class</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Min. Investment</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allInv.map((investment) => (
                <TableRow
                  key={investment.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Stack direction="row" alignItems="center" spacing={2}>
                      {investmentTypeIcons[investment.asset_class] || investmentTypeIcons.Other}
                      <Typography fontWeight={500}>{investment.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={investment.asset_class}
                      variant="outlined"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography fontWeight={500}>
                      ${Number(investment.minimum_investment).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {pendingMap.has(investment.id) ? (
                      <Chip
                        icon={<PendingIcon />}
                        label="Request Pending"
                        sx={{ backgroundColor: theme.palette.warning.light }}
                      />
                    ) : (
                      <Chip
                        label="Available"
                        sx={{ backgroundColor: theme.palette.success.light }}
                      />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View Details">
                        <IconButton
                          onClick={() => handleViewInvestment(investment.id)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<RequestIcon />}
                        onClick={() => openDialog(investment)}
                        disabled={pendingMap.has(investment.id)}
                        sx={{ textTransform: 'none' }}
                      >
                        {pendingMap.has(investment.id) ? 'Requested' : 'Request'}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Request Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editingReq ? 'Edit Investment Request' : 'New Investment Request'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Investment</Typography>
              <Typography variant="h6" fontWeight={600}>
                {selectedInv?.name}
              </Typography>
            </Box>
            
            <TextField
              label="Amount (USD)"
              type="number"
              fullWidth
              margin="normal"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon color="action" />
                  </InputAdornment>
                ),
              }}
              helperText={`Minimum investment: $${Number(selectedInv?.minimum_investment || 0).toLocaleString()}`}
            />
            
            <TextField
              label="Notes (optional)"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={closeDialog}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={submitRequest}
            sx={{ borderRadius: 2 }}
            startIcon={<RequestIcon />}
          >
            {editingReq ? 'Update Request' : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={feedback.type}
          variant="filled"
          onClose={() => setFeedback({ ...feedback, open: false })}
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}