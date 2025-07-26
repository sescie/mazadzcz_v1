import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Box, 
  Paper, 
  Stack, 
  Typography, 
  Alert,
  CircularProgress,
  IconButton,
  Button,
  Chip,
  useTheme,
  Avatar,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  InputAdornment,
  TextField,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Verified as VerifiedIcon,
  Block as BlockedIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridActionsCellItem
} from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchUsers,
  createUser,
  deleteUser,
  approveUser,
  unApproveUser
} from '../../services/api';

// Simple debounce implementation
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const StatusIndicator = ({ active }) => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
    {active ? 
      <VerifiedIcon color="success" fontSize="small" /> : 
      <BlockedIcon color="error" fontSize="small" />}
    <Typography variant="caption" color="text.secondary">
      {active ? 'Active' : 'Inactive'}
    </Typography>
  </Box>
);

const RoleIcon = ({ role }) => (
  <Tooltip title={role === 'admin' ? 'Administrator' : 'Standard User'}>
    {role === 'admin' ? 
      <AdminIcon color="primary" fontSize="small" /> : 
      <UserIcon color="action" fontSize="small" />}
  </Tooltip>
);

const EnhancedToolbar = React.memo(({ onAddUser, onRefresh, onSearch, theme }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = debounce((value) => {
    onSearch(value);
  }, 300);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    handleSearch(e.target.value);
  };

  return (
    <GridToolbarContainer sx={{ 
      px: 2,
      py: 1,
      borderBottom: `1px solid ${theme.palette.divider}`,
      backgroundColor: theme.palette.background.paper,
      gap: 1
    }}>
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search users..."
        value={searchValue}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          sx: {
            backgroundColor: theme.palette.background.paper,
            borderRadius: 1,
            height: 36
          }
        }}
        sx={{
          flex: 1,
          maxWidth: 400,
          ml: 1
        }}
      />

      <Stack direction="row" spacing={0.5} sx={{ ml: 'auto' }}>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={onRefresh}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <GridToolbarFilterButton 
          size="small"
          sx={{ minWidth: 0, '& .MuiButton-startIcon': { margin: 0 } }}
        />
        <GridToolbarExport 
          csvOptions={{ 
            fileName: `users-export-${format(new Date(), 'yyyy-MM-dd')}`,
            delimiter: ',',
            utf8WithBom: true,
            fields: ['id', 'full_name', 'email', 'role', 'is_active', 'last_login']
          }}
          printOptions={{ hideFooter: true, hideToolbar: true }}
          size="small"
        />
        <GridToolbarColumnsButton 
          size="small"
          sx={{ minWidth: 0, '& .MuiButton-startIcon': { margin: 0 } }}
        />
      </Stack>
    </GridToolbarContainer>
  );
});

const CustomNoRows = () => (
  <Stack height="100%" alignItems="center" justifyContent="center">
    <PeopleIcon fontSize="large" color="disabled" />
    <Typography color="text.secondary">No users found</Typography>
  </Stack>
);

export default function UserManagement() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const { auth } = useAuth();
  const isMounted = useRef(true);
  const dataGridRef = useRef(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchUsers(auth.token);
      if (!isMounted.current) return;
      
      const processedUsers = data.map(user => ({
        id: user.id || '',
        full_name: user.full_name || 'Unknown User',
        email: user.email || '',
        role: user.role || 'user',
        is_active: user.is_active !== undefined ? user.is_active : true,
        last_login: user.last_login || null,
        unread_notifications: user.unread_notifications || 0,
        rating: Math.random() * 2 + 3.5,
        is_pending: user.role === 'pending'
      }));
      
      setUsers(processedUsers);
      setFilteredUsers(processedUsers);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [auth.token]);

  useEffect(() => {
    isMounted.current = true;
    loadUsers();
    return () => {
      isMounted.current = false;
    };
  }, [loadUsers]);

  const handleSearch = useCallback((searchTerm) => {
    setFilteredUsers(users.filter(user => {
      const nameMatch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const emailMatch = user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || emailMatch;
    }));
  }, [users]);

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 'all') {
      setFilteredUsers(users);
    } else if (newValue === 'active') {
      setFilteredUsers(users.filter(user => user.is_active));
    } else if (newValue === "pending") {
      setFilteredUsers(users.filter(user => user.role === "pending"));
    } else {
      setFilteredUsers(users.filter(user => !user.is_active));
    }
  }, [users]);

  const handleDeleteUser = useCallback(async (userId) => {
    try {
      await deleteUser(userId, auth.token);
      setSuccess('User deleted successfully');
      await loadUsers();
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  }, [auth.token, loadUsers]);

  const handleToggleStatus = useCallback(async (userId, activate) => {
    try {
      if (activate) {
        await approveUser(userId, auth.token);
        setSuccess('User approved successfully');
      } else {
        await unApproveUser(userId, auth.token);
        setSuccess('User unapproved successfully');
      }
      await loadUsers();
    } catch (err) {
      setError(err.message || 'Failed to toggle user status');
    }
  }, [auth.token, loadUsers]);

  const handleViewProfile = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const userStats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
    admins: users.filter(u => u.role === 'admin').length,
    pending: users.filter(u => u.role === 'pending').length
  }), [users]);

  const columns = useMemo(() => [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 100,
      renderCell: (params) => (
        <Typography variant="caption" color="text.secondary" fontFamily="monospace">
          {params.value ? String(params.value).slice(0, 8) : 'N/A'}
        </Typography>
      )
    },
    { 
      field: 'full_name', 
      headerName: 'USER', 
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Avatar sx={{ 
            width: 32, 
            height: 32,
            bgcolor: theme.palette.primary.light,
            color: theme.palette.primary.dark
          }}>
            {params.value?.charAt(0) || '?'}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {params.value || 'Unknown User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {params.row.email || 'No email'}
            </Typography>
          </Box>
        </Stack>
      )
    },
    { 
      field: 'role', 
      headerName: 'ROLE', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value || 'user'}
          variant="outlined"
          size="small"
          icon={<RoleIcon role={params.value || 'user'} />}
          sx={{ 
            borderRadius: 1,
            borderWidth: 1,
            textTransform: 'capitalize',
            '.MuiChip-icon': { ml: '4px' }
          }}
        />
      )
    },
    { 
      field: 'is_active', 
      headerName: 'STATUS', 
      width: 120,
      renderCell: (params) => <StatusIndicator active={params.value} />
    },
    { 
      field: 'last_login', 
      headerName: 'LAST ACTIVE', 
      width: 160,
      valueFormatter: (params) => {
        if (!params?.value) return 'Never';
        try {
          const date = new Date(params.value);
          return isNaN(date.getTime()) ? 'Invalid date' : format(date, 'MMM dd, yyyy');
        } catch {
          return 'Invalid date';
        }
      }
    },
    {
      field: 'actions',
      type: 'actions',
      width: 180,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ViewIcon color="info" />}
          label="View Profile"
          onClick={() => handleViewProfile(params.row.id)}
          showInMenu
        />,
        <GridActionsCellItem
          icon={<EditIcon color="warning" />}
          label="Edit User"
          onClick={() => handleViewProfile(params.row.id)}
          showInMenu
        />,
        params.row.is_pending ? (
          <GridActionsCellItem
            icon={<VerifiedIcon color="success" />}
            label="Approve User"
            onClick={() => handleToggleStatus(params.row.id, true)}
            showInMenu
          />
        ) : (
          <GridActionsCellItem
            icon={<BlockedIcon color="error" />}
            label="Unapprove User"
            onClick={() => handleToggleStatus(params.row.id, false)}
            showInMenu
          />
        ),
        <Divider />,
        <GridActionsCellItem
          icon={<DeleteIcon color="error" />}
          label="Delete"
          onClick={() => {
            if (window.confirm(`Delete ${params.row.full_name}?`)) {
              handleDeleteUser(params.row.id);
            }
          }}
          showInMenu
        />
      ]
    }
  ], [handleDeleteUser, handleToggleStatus, theme]);

  return (
    <Box sx={{ 
      height: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: theme.palette.background.default,
      overflow: 'hidden'
    }}>
      {/* Header Section */}
      <Paper elevation={0} sx={{ 
        p: 3,
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        flexShrink: 0
      }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar sx={{ 
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            width: 48, 
            height: 48 
          }}>
            <PeopleIcon fontSize="medium" />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight={600}>
              User Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage {userStats.total} system users
            </Typography>
          </Box>
          <Stack direction="row" spacing={2} sx={{ ml: 'auto' }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">Active</Typography>
              <Typography variant="h6" color="success.main">{userStats.active}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">Inactive</Typography>
              <Typography variant="h6" color="error.main">{userStats.inactive}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">Admins</Typography>
              <Typography variant="h6" color="primary.main">{userStats.admins}</Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">Pending</Typography>
              <Typography variant="h6" color="primary.main">{userStats.pending}</Typography>
            </Box>
          </Stack>
        </Stack>
      </Paper>

      {/* Status Alerts */}
      <Box sx={{ px: 3, pt: 2, flexShrink: 0 }}>
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
      </Box>

      {/* Filter Tabs */}
      <Box sx={{ px: 3, flexShrink: 0 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: 3
            }
          }}
        >
          <Tab label={`All Users (${userStats.total})`} value="all" />
          <Tab label={`Active (${userStats.active})`} value="active" />
          <Tab label={`Inactive (${userStats.inactive})`} value="inactive" />
          <Tab label={`Pending (${userStats.pending})`} value="pending" />
        </Tabs>
      </Box>

      {/* DataGrid Container */}
      <Box sx={{ 
        flex: 1,
        minHeight: 0,
        px: 3,
        pb: 3,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Paper elevation={0} sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden'
        }}>
          <DataGrid
            ref={dataGridRef}
            rows={filteredUsers}
            columns={columns}
            loading={loading}
            slots={{
              toolbar: EnhancedToolbar,
              loadingOverlay: LinearProgress,
              noRowsOverlay: CustomNoRows
            }}
            slotProps={{
              toolbar: { 
                onRefresh: loadUsers,
                onSearch: handleSearch,
                theme
              }
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            disableRowSelectionOnClick
            getRowHeight={() => 'auto'}
            sx={{
              '& .MuiDataGrid-root': {
                border: 'none',
                minHeight: 0
              },
              '& .MuiDataGrid-virtualScroller': {
                minHeight: 0
              },
              '& .MuiDataGrid-cell': {
                display: 'flex',
                alignItems: 'center',
                borderBottom: `1px solid ${theme.palette.divider}`,
                py: 2,
                '&:focus': { outline: 'none' }
              },
              '& .MuiDataGrid-row': {
                '&:hover': { 
                  backgroundColor: theme.palette.action.hover
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.action.selected,
                  '&:hover': { backgroundColor: theme.palette.action.selected }
                }
              },
              '& .MuiDataGrid-columnHeader': {
                py: 1,
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                },
                '&:focus': { outline: 'none' }
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
              },
              '& .MuiDataGrid-overlay': {
                backgroundColor: theme.palette.background.default
              }
            }}
          />
        </Paper>
      </Box>
    </Box>
  );
}