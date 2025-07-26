import React, { useState, useEffect, useCallback } from 'react';
import { 
    Box, 
    Typography, 
    Paper, 
    Button, 
    Divider, 
    Grid, 
    TextField,
    Alert,
    Chip,
    Stack,
    Avatar,
    IconButton,
    Tabs,
    Tab,
    Card,
    CardContent,
    CardHeader,
    InputAdornment,
    Tooltip,
    CircularProgress,
    LinearProgress,
    Rating,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
    FormControlLabel,
    Switch
} from '@mui/material';
import { 
    Edit as EditIcon,
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
    AttachMoney as MoneyIcon,
    TrendingUp as EquityIcon,
    AccountBalance as FixedIncomeIcon,
    Savings as FundIcon,
    CheckCircle as ActiveIcon,
    Pending as PendingIcon,
    Dangerous as SuspendedIcon,
    Info as InfoIcon,
    CorporateFare as SectorIcon,
    Business as IndustryIcon,
    ShowChart as MarketCapIcon,
    ShowChart,
    Paid as DividendIcon,
    Star as RatingIcon,
    Schedule as MaturityIcon,
    Percent as FeeIcon,
    AccountTree as FundTypeIcon,
    EventNote as ActivityIcon,
    LockReset as ResetPasswordIcon,
    AdminPanelSettings as AdminIcon,
    Person as UserIcon,
    BarChart,
    Email as EmailIcon,
    Category,
    Security,
    PieChart,
    Timeline
} from '@mui/icons-material';
import { 
    PieChart as RechartsPie,
    LineChart as RechartsLine,
    Pie,
    Cell,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { 
    fetchUserById, 
    updateUser, 
    fetchUserInvestments, 
    fetchUserActivity,
    approveUser,
    unApproveUser
} from '../../services/api';


const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
const RISK_PROFILES = {
  conservative: { color: '#4CAF50', label: 'Conservative' },
  moderate: { color: '#FFC107', label: 'Moderate' },
  aggressive: { color: '#F44336', label: 'Aggressive' }
};

const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const StatusIndicator = ({ active }) => (
  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
    {active ? 
      <ActiveIcon color="success" fontSize="small" /> : 
      <SuspendedIcon color="error" fontSize="small" />}
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

const ActivityItem = ({ activity }) => (
  <ListItem sx={{ py: 1.5 }}>
    <ListItemIcon>
      <ActivityIcon color="action" />
    </ListItemIcon>
    <ListItemText
      primary={activity.description}
      secondary={format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
    />
    <Chip label={activity.type} size="small" color="info" />
  </ListItem>
);

const StatCard = ({ icon, title, value, trend, color = 'primary' }) => (
  <Paper sx={{ p: 2, borderRadius: 2, height: '100%' }}>
    <Stack direction="row" alignItems="center" spacing={2}>
      <Avatar sx={{ 
        bgcolor: `${color}.light`, 
        color: `${color}.contrastText`,
        width: 40,
        height: 40
      }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
        <Typography variant="h5" fontWeight={600}>{value}</Typography>
      </Box>
      {trend !== undefined && (
        <Box sx={{ ml: 'auto', textAlign: 'right' }}>
          <Typography
            variant="body2"
            color={trend > 0 ? 'success.main' : trend < 0 ? 'error.main' : 'text.secondary'}
            fontWeight={500}
          >
            {trend > 0 ? '+' : ''}{trend}%
          </Typography>
          <Typography variant="caption">vs last month</Typography>
        </Box>
      )}
    </Stack>
  </Paper>
);

const RiskIndicator = ({ level }) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Box sx={{
      width: 12,
      height: 12,
      borderRadius: '50%',
      bgcolor: RISK_PROFILES[level]?.color || '#9E9E9E',
      mr: 1
    }} />
    <Typography variant="body2" fontWeight={500}>
      {RISK_PROFILES[level]?.label || 'Unknown'}
    </Typography>
  </Box>
);

const UserDetailPage = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [userData, investments, activity] = await Promise.all([
        fetchUserById(id, auth.token),
        fetchUserInvestments(id, auth.token),
        fetchUserActivity(id, auth.token)
      ]);
      
      setUser(userData);
      setFormData(userData);
      
      if (investments && activity) {
        const stats = {
          totalInvested: investments.reduce((sum, inv) => sum + (inv.value || 0), 0),
          averageReturn: investments.length 
            ? investments.reduce((sum, inv) => sum + (inv.return || 0), 0) / investments.length
            : 0,
          performanceData: generatePerformanceData(investments),
          riskProfile: calculateRiskProfile(investments)
        };
        
        setProfileData({ investments, activity, stats });
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError('Failed to load user data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id, auth.token]);

  const calculateRiskProfile = (investments) => {
    if (!investments?.length) return { level: 'conservative', diversificationScore: 0 };
    
    const types = investments.reduce((acc, inv) => {
      acc[inv.type] = (acc[inv.type] || 0) + 1;
      return acc;
    }, {});
    
    const diversificationScore = Math.min(
      Math.floor(Object.keys(types).length / investments.length * 10),
      10
    );
    
    const volatility = investments.reduce((sum, inv) => sum + (inv.volatility || 0), 0) / investments.length;
    
    let level;
    if (volatility < 2) level = 'conservative';
    else if (volatility < 5) level = 'moderate';
    else level = 'aggressive';
    
    return { level, diversificationScore };
  };

  const generatePerformanceData = (investments) => {
    return Array(12).fill().map((_, i) => {
      const month = new Date().getMonth() - 11 + i;
      const year = new Date().getFullYear() + (month < 0 ? -1 : 0);
      const adjMonth = (month + 12) % 12;
      
      return {
        date: format(new Date(year, adjMonth, 1), 'MMM yy'),
        value: investments.reduce((sum, inv) => sum + (inv.historical?.[adjMonth]?.value || 0), 0),
        benchmark: investments.reduce((sum, inv) => sum + (inv.historical?.[adjMonth]?.benchmark || 0), 0)
      };
    });
  };

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateUser(id, formData, auth.token);
      setSuccess('User updated successfully');
      setEditMode(false);
      await loadUserData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setLoading(true);
      if (user.is_pending) {
        await approveUser(id, auth.token);
        setSuccess('User approved successfully');
      } else {
        await unApproveUser(id, auth.token);
        setSuccess('User unapproved successfully');
      }
      await loadUserData();
    } catch (err) {
      setError(err.message || 'Failed to update user status');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading && !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={4}>
        <Typography variant="h5" color="error">User not found</Typography>
        <Button onClick={handleBack} sx={{ mt: 2 }}>Back to Users</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          variant="outlined"
          sx={{ mr: 2 }}
        >
          Back to Users
        </Button>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color={user.is_pending ? "success" : "warning"}
            startIcon={user.is_pending ? <ActiveIcon /> : <SuspendedIcon />}
            onClick={handleToggleStatus}
            disabled={loading}
          >
            {user.is_pending ? "Approve User" : "Unapprove User"}
          </Button>
          
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditMode(!editMode)}
            disabled={loading}
          >
            {editMode ? "Cancel Edit" : "Edit User"}
          </Button>
          
          {editMode && (
            <Button
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={loading}
            >
              Save Changes
            </Button>
          )}
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* User Header */}
      <Paper elevation={0} sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
        color: theme.palette.primary.contrastText
      }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            bgcolor: 'background.paper',
            color: theme.palette.primary.main,
            fontSize: 32
          }}>
            {user.full_name?.charAt(0) || 'U'}
          </Avatar>
          <Box>
            <Typography variant="h3" fontWeight={700}>
              {user.full_name}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" mt={1}>
              <Chip 
                label={user.role} 
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
              <Stack direction="row" alignItems="center">
                <Rating 
                  value={user.rating || 4.5} 
                  precision={0.5} 
                  readOnly 
                  size="large" 
                  sx={{ color: 'white' }}
                />
                <Typography variant="body1" ml={1} fontWeight={500}>
                  {user.rating?.toFixed(1) || '4.5'}
                </Typography>
              </Stack>
              <StatusIndicator active={user.is_active} />
            </Stack>
          </Box>
          <Box sx={{ ml: 'auto', textAlign: 'right' }}>
            <Typography variant="body1" fontWeight={500}>
              {user.email}
            </Typography>
            <Typography variant="body2" mt={1}>
              Last active: {user.last_login ? formatDateTime(user.last_login) : 'Never'}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Main Content */}
      <Box>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          sx={{ mb: 3 }}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" value="overview" />
          <Tab label="Portfolio" value="portfolio" />
          <Tab label="Activity" value="activity" />
          <Tab label="Settings" value="settings" />
        </Tabs>

        {activeTab === 'overview' && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader 
                  title="User Information" 
                  avatar={<InfoIcon color="primary" />}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Full Name"
                        name="full_name"
                        value={editMode ? formData.full_name : user.full_name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Email"
                        name="email"
                        value={editMode ? formData.email : user.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        disabled={!editMode}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Role"
                        name="role"
                        value={editMode ? formData.role : user.role}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        select
                        SelectProps={{ native: true }}
                        disabled={!editMode}
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="pending">Pending</option>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Status"
                        name="is_active"
                        value={editMode ? formData.is_active : user.is_active}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        select
                        SelectProps={{ native: true }}
                        disabled={!editMode}
                      >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </TextField>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardHeader 
                  title="Account Stats" 
                  avatar={<BarChart color="primary" />}
                />
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <StatCard 
                        icon={<ActivityIcon />}
                        title="Member Since"
                        value={formatDate(user.created_at)}
                        color="info"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StatCard 
                        icon={<AdminIcon />}
                        title="Account Type"
                        value={user.role === 'admin' ? 'Administrator' : 'Standard User'}
                        color="warning"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StatCard 
                        icon={<ResetPasswordIcon />}
                        title="Last Password Change"
                        value={user.last_password_change ? formatDate(user.last_password_change) : 'Never'}
                        color="success"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <StatCard 
                        icon={<EmailIcon />}
                        title="Unread Notifications"
                        value={user.unread_notifications || 0}
                        color="error"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {activeTab === 'portfolio' && profileData && (
          <Box>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  icon={<MoneyIcon />}
                  title="Total Investments"
                  value={formatCurrency(profileData.stats.totalInvested)}
                  trend={12.5}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  icon={<ShowChart />}
                  title="Avg. Return"
                  value={`${profileData.stats.averageReturn.toFixed(2)}%`}
                  trend={profileData.stats.averageReturn}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  icon={<Category />}
                  title="Diversification"
                  value={`${profileData.stats.riskProfile.diversificationScore}/10`}
                  color="info"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard 
                  icon={<Security />}
                  title="Risk Profile"
                  value={<RiskIndicator level={profileData.stats.riskProfile.level} />}
                  color="warning"
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader 
                    title="Portfolio Composition" 
                    avatar={<PieChart color="primary" />}
                  />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={profileData.investments}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {profileData.investments.map((entry, index) => (
                            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip formatter={(value) => [formatCurrency(value), 'Value']} />
                        <Legend />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader 
                    title="Performance vs Benchmark" 
                    avatar={<Timeline color="primary" />}
                  />
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsLine data={profileData.stats.performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip formatter={(value) => [formatCurrency(value), 'Value']} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#8884d8" 
                          strokeWidth={2} 
                          dot={false}
                          name="Portfolio"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="benchmark" 
                          stroke="#82ca9d" 
                          strokeWidth={2} 
                          dot={false}
                          name="Benchmark"
                        />
                      </RechartsLine>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {activeTab === 'activity' && profileData && (
          <Card variant="outlined">
            <CardHeader 
              title="User Activity" 
              avatar={<ActivityIcon color="primary" />}
            />
            <CardContent>
              <List sx={{ maxHeight: 500, overflow: 'auto' }}>
                {profileData.activity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ActivityItem activity={activity} />
                    {index < profileData.activity.length - 1 && <Divider />}
                  </motion.div>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card variant="outlined">
            <CardHeader 
              title="Security Settings" 
              avatar={<Security color="primary" />}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch checked={user.two_factor_enabled} />}
                    label="Two-Factor Authentication"
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch checked={user.email_notifications} />}
                    label="Email Notifications"
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default UserDetailPage;