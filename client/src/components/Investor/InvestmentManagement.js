import React, { useState, useEffect } from 'react';
import { 
  DataGrid, 
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridActionsCellItem
} from '@mui/x-data-grid';
import { 
  Chip, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  Box,
  Alert,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Paper,
  Stack,
  Avatar,
  Tooltip,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as EquityIcon,
  AccountBalance as FixedIncomeIcon,
  Savings as FundIcon,
  CheckCircle as ActiveIcon,
  Pending as PendingIcon,
  Dangerous as SuspendedIcon
} from '@mui/icons-material';
import AddInvestment from './AddInvestment';
import { useAuth } from '../../contexts/AuthContext';
import { fetchInvestments, createInvestment, updateInvestment, deleteInvestment } from '../../services/api';
const InvestmentManagement = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const { auth } = useAuth();

  const investmentTypeIcons = {
    Equity: <EquityIcon color="primary" />,
    'Fixed Income': <FixedIncomeIcon color="secondary" />,
    Fund: <FundIcon color="success" />,
    Other: <MoneyIcon color="action" />
  };

  const statusColors = {
    Active: 'success',
    Pending: 'warning',
    Suspended: 'error'
  };

  const statusIcons = {
    Active: <ActiveIcon />,
    Pending: <PendingIcon />,
    Suspended: <SuspendedIcon />
  };

  const loadInvestments = async () => {
    try {
      setLoading(true);
      const data = await fetchInvestments(auth.token);
      setInvestments(data);
    } catch (err) {
      setError(err.message || 'Failed to load investments');
      console.error('Error loading investments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvestments();
  }, []);

  const handleAddInvestment = async (investmentData) => {
    try {
      await createInvestment(investmentData, auth.token);
      setSuccess('Investment created successfully');
      setOpenAddDialog(false);
      await loadInvestments();
    } catch (err) {
      console.error('Error creating investment:', err);
      setError(err.message || 'Failed to create investment');
    }
  };

  const handleUpdateInvestment = async (investmentData) => {
    try {
      await updateInvestment(selectedInvestment.id, investmentData, auth.token);
      setSuccess('Investment updated successfully');
      await loadInvestments();
    } catch (err) {
      console.error('Error updating investment:', err);
      setError(err.message || 'Failed to update investment');
    }
  };

  const handleDeleteInvestment = async (investmentId) => {
    try {
      await deleteInvestment(investmentId, auth.token);
      setSuccess('Investment deleted successfully');
      await loadInvestments();
    } catch (err) {
      setError(err.message || 'Failed to delete investment');
      console.error('Error deleting investment:', err);
    }
  };

  const handleMenuClick = (event, investment) => {
    setSelectedInvestment(investment);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
  };

  const columns = [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary" noWrap>
          {params.value}
        </Typography>
      )
    },
    { 
      field: 'name', 
      headerName: 'INVESTMENT NAME', 
      width: 250,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ 
            bgcolor: theme.palette.background.paper, 
            width: 32, 
            height: 32,
            border: `1px solid ${theme.palette.divider}`
          }}>
            {investmentTypeIcons[params.row.asset_class] || investmentTypeIcons.Other}
          </Avatar>
          <Typography variant="body2" fontWeight={500} noWrap>
            {params.value}
          </Typography>
        </Stack>
      )
    },
    { 
      field: 'asset_class', 
      headerName: 'TYPE', 
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          variant="outlined"
          size="small"
          icon={investmentTypeIcons[params.value] || investmentTypeIcons.Other}
          sx={{ 
            borderRadius: 1,
            borderWidth: 1,
            minWidth: 100,
            justifyContent: 'flex-start'
          }}
        />
      )
    },
    { 
      field: 'current_price', 
      headerName: 'CURRENT PRICE', 
      width: 180,
      type: 'number',
      valueFormatter: (params) => {
        if (params.value == null) return 'N/A';
        return `$${params.value.toLocaleString('en-US', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })}`;
      },
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          fontWeight={500}
          color={params.value == null ? 'text.secondary' : 'text.primary'}
          sx={{ fontFamily: 'monospace' }}
        >
          {params.value == null ? 'N/A' : `$${params.value.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}`}
        </Typography>
      )
    },
    { 
      field: 'isin', 
      headerName: 'ISIN', 
      width: 180,
      renderCell: (params) => (
        <Tooltip title="International Securities Identification Number">
          <Chip 
            label={params.value} 
            variant="outlined"
            size="small"
            sx={{ 
              borderRadius: 1,
              borderWidth: 1,
              fontFamily: 'monospace',
              fontSize: '0.75rem'
            }}
          />
        </Tooltip>
      )
    },
    { 
      field: 'status', 
      headerName: 'STATUS', 
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={statusColors[params.value] || 'default'}
          icon={statusIcons[params.value]}
          variant="outlined"
          size="small"
          sx={{ 
            borderRadius: 1,
            borderWidth: 1,
            minWidth: 90,
            '& .MuiChip-icon': {
              marginLeft: '4px'
            }
          }}
        />
      )
    },
    {
      field: 'actions',
      type: 'actions',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<MoreVertIcon />}
          label="More"
          onClick={(e) => handleMenuClick(e, params.row)}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        />
      ]
    }
  ];

  const CustomToolbar = () => {
    return (
      <GridToolbarContainer sx={{ 
        px: 2,
        py: 1.5,
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper
      }}>
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Button 
            startIcon={<AddIcon />} 
            onClick={() => setOpenAddDialog(true)}
            variant="contained"
            size="small"
            sx={{ 
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none'
              }
            }}
          >
            New Investment
          </Button>
          <Stack direction="row" spacing={1}>
            <GridToolbarColumnsButton 
              size="small"
              sx={{ 
                minWidth: 0,
                '& .MuiButton-startIcon': {
                  margin: 0
                }
              }}
            />
            <GridToolbarFilterButton 
              size="small"
              sx={{ 
                minWidth: 0,
                '& .MuiButton-startIcon': {
                  margin: 0
                }
              }}
            />
            <GridToolbarExport 
              size="small"
              sx={{ 
                minWidth: 0,
                '& .MuiButton-startIcon': {
                  margin: 0
                }
              }}
            />
          </Stack>
        </Stack>
      </GridToolbarContainer>
    );
  };

  return (
    <Box sx={{ 
      height: 'calc(100vh - 200px)', 
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 3
    }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ 
        p: 3,
        borderRadius: 2,
        background: theme.palette.mode === 'light' 
          ? 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)' 
          : 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
        borderLeft: `4px solid ${theme.palette.success.main}`
      }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <MoneyIcon fontSize="large" color="success" />
          <Box>
            <Typography variant="h5" fontWeight={600} gutterBottom>
              Investment Portfolio
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage all investment products and their details
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Status Alerts */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          onClose={() => setSuccess(null)}
          sx={{ mb: 2 }}
        >
          {success}
        </Alert>
      )}

      {/* DataGrid */}
      <Paper elevation={3} sx={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        <DataGrid
          rows={investments}
          columns={columns}
          loading={loading}
          slots={{
            toolbar: CustomToolbar,
          }}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
              borderBottom: `1px solid ${theme.palette.divider}`,
              py: 1.5
            },
            '& .MuiDataGrid-columnHeader': {
              py: 2,
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: theme.palette.background.default
            }
          }}
        />
      </Paper>

      {/* Add Investment Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <DialogTitle sx={{ py: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <MoneyIcon color="success" />
            <Typography variant="h6">Add New Investment</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ py: 2 }}>
          <AddInvestment 
            onSubmit={handleAddInvestment} 
            onClose={() => setOpenAddDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            borderRadius: 1.5,
            minWidth: 180,
            py: 0.5
          }
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (window.confirm(`Are you sure you want to delete ${selectedInvestment?.name}?`)) {
            handleDeleteInvestment(selectedInvestment.id);
          }
          handleMenuClose();
        }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={() => {
          navigate(`/admin/investments/${selectedInvestment.id}`);
          handleMenuClose();
        }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <InfoIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default InvestmentManagement;