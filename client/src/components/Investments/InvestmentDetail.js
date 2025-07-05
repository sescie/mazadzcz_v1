import React, { useState, useEffect } from 'react';
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
  useTheme
} from '@mui/material';
import { 
  Edit as EditIcon,
  Close as CloseIcon,
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
  Paid as DividendIcon,
  Star as RatingIcon,
  Schedule as MaturityIcon,
  Percent as FeeIcon,
  AccountTree as FundTypeIcon,
    TrendingUp as TrendingUp,
    AccountBalance as AccountBalance,



} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchInvestment, updateInvestment } from '../../services/api';

const investmentTypeIcons = {
  EQUITY: <EquityIcon fontSize="large" color="primary" />,
  FIXED_INCOME: <FixedIncomeIcon fontSize="large" color="secondary" />,
  FUND: <FundIcon fontSize="large" color="success" />,
  Other: <MoneyIcon fontSize="large" color="action" />
};

const statusColors = {
  ACTIVE: 'success',
  PENDING: 'warning',
  SUSPENDED: 'error',
  CLOSED: 'default'
};

const statusIcons = {
  ACTIVE: <ActiveIcon />,
  PENDING: <PendingIcon />,
  SUSPENDED: <SuspendedIcon />,
  CLOSED: <CloseIcon />
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

const InvestmentDetail = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadInvestment = async () => {
      try {
        setLoading(true);
        const data = await fetchInvestment(id, auth.token);
        setInvestment(data);
        setFormData(data);
      } catch (err) {
        setError(err.message || 'Failed to load investment');
      } finally {
        setLoading(false);
      }
    };

    loadInvestment();
  }, [id, auth.token]);

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
      await updateInvestment(id, formData, auth.token);
      const updatedData = await fetchInvestment(id, auth.token);
      setInvestment(updatedData);
      setEditMode(false);
      setSuccess('Investment updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update investment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(investment);
    setEditMode(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading && !investment) {
    return (
      <Box p={4}>
        <Typography>Loading investment details...</Typography>
      </Box>
    );
  }

  if (!investment) {
    return (
      <Box p={4}>
        <Typography color="error">Investment not found</Typography>
      </Box>
    );
  }

  const renderBasicInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ height: '100%' }}>
          <CardHeader 
            title="Identification" 
            avatar={<InfoIcon color="primary" />}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  name="name"
                  value={editMode ? formData.name : investment.name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="ISIN"
                  name="isin"
                  value={editMode ? formData.isin : investment.isin}
                  fullWidth
                  margin="normal"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Ticker"
                  name="ticker"
                  value={editMode ? formData.ticker : investment.ticker || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Asset Class"
                  name="asset_class"
                  value={editMode ? formData.asset_class : investment.asset_class}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  select
                  SelectProps={{ native: true }}
                  disabled={!editMode}
                >
                  <option value="EQUITY">Equity</option>
                  <option value="FIXED_INCOME">Fixed Income</option>
                  <option value="FUND">Fund</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Status"
                  name="status"
                  value={editMode ? formData.status : investment.status}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  select
                  SelectProps={{ native: true }}
                  disabled={!editMode}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="CLOSED">Closed</option>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={editMode ? formData.description : investment.description || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={3}
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card variant="outlined" sx={{ height: '100%' }}>
          <CardHeader 
            title="Pricing & Dates" 
            avatar={<MoneyIcon color="primary" />}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  name="price"
                  type="number"
                  value={editMode ? formData.price : investment.price}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {investment.currency || 'USD'}
                      </InputAdornment>
                    ),
                  }}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Currency"
                  name="currency"
                  value={editMode ? formData.currency : investment.currency || 'USD'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Price Update"
                  value={formatDateTime(investment.last_price_update)}
                  fullWidth
                  margin="normal"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Inception Date"
                  name="inception_date"
                  type="date"
                  value={editMode ? formData.inception_date?.split('T')[0] : investment.inception_date?.split('T')[0] || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Created At"
                  value={formatDateTime(investment.created_at)}
                  fullWidth
                  margin="normal"
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Updated At"
                  value={formatDateTime(investment.updated_at)}
                  fullWidth
                  margin="normal"
                  disabled
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderAssetClassSpecificInfo = () => {
    if (investment.asset_class === 'EQUITY') {
      return (
        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardHeader 
            title="Equity Details" 
            avatar={<TrendingUp color="primary" />}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Exchange"
                  name="exchange"
                  value={editMode ? formData.exchange : investment.exchange || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Market Cap"
                  name="market_cap"
                  value={editMode ? formData.market_cap : investment.market_cap || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {investment.currency || 'USD'}
                      </InputAdornment>
                    ),
                  }}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Sector"
                  name="sector"
                  value={editMode ? formData.sector : investment.sector || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Industry"
                  name="industry"
                  value={editMode ? formData.industry : investment.industry || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Dividend Yield"
                  name="dividend_yield"
                  value={editMode ? formData.dividend_yield : investment.dividend_yield || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        %
                      </InputAdornment>
                    ),
                  }}
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
    } else if (investment.asset_class === 'FIXED_INCOME') {
      return (
        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardHeader 
            title="Fixed Income Details" 
            avatar={<AccountBalance color="primary" />}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Coupon Rate"
                  name="coupon_rate"
                  value={editMode ? formData.coupon_rate : investment.coupon_rate || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        %
                      </InputAdornment>
                    ),
                  }}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Issue Date"
                  name="issue_date"
                  type="date"
                  value={editMode ? formData.issue_date?.split('T')[0] : investment.issue_date?.split('T')[0] || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Maturity Date"
                  name="maturity_date"
                  type="date"
                  value={editMode ? formData.maturity_date?.split('T')[0] : investment.maturity_date?.split('T')[0] || ''}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Credit Rating"
                  name="credit_rating"
                  value={editMode ? formData.credit_rating : investment.credit_rating || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Duration"
                  name="duration"
                  value={editMode ? formData.duration : investment.duration || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Yield to Maturity"
                  name="yield_to_maturity"
                  value={editMode ? formData.yield_to_maturity : investment.yield_to_maturity || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        %
                      </InputAdornment>
                    ),
                  }}
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
    } else if (investment.asset_class === 'FUND') {
      return (
        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardHeader 
            title="Fund Details" 
            avatar={<FundIcon color="primary" />}
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Fund Type"
                  name="fund_type"
                  value={editMode ? formData.fund_type : investment.fund_type || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="NAV"
                  name="nav"
                  value={editMode ? formData.nav : investment.nav || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {investment.currency || 'USD'}
                      </InputAdornment>
                    ),
                  }}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="AUM"
                  name="aum"
                  value={editMode ? formData.aum : investment.aum || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {investment.currency || 'USD'}
                      </InputAdornment>
                    ),
                  }}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Expense Ratio"
                  name="expense_ratio"
                  value={editMode ? formData.expense_ratio : investment.expense_ratio || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        %
                      </InputAdornment>
                    ),
                  }}
                  disabled={!editMode}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Dividend Frequency"
                  name="dividend_frequency"
                  value={editMode ? formData.dividend_frequency : investment.dividend_frequency || 'N/A'}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  disabled={!editMode}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      );
    }
    return null;
  };

  const renderFeesAndMinimums = () => (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardHeader 
        title="Fees & Minimums" 
        avatar={<FeeIcon color="primary" />}
      />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Management Fee"
              name="management_fee"
              value={editMode ? formData.management_fee : investment.management_fee || 'N/A'}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    %
                  </InputAdornment>
                ),
              }}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Performance Fee"
              name="performance_fee"
              value={editMode ? formData.performance_fee : investment.performance_fee || 'N/A'}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    %
                  </InputAdornment>
                ),
              }}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Minimum Investment"
              name="minimum_investment"
              value={editMode ? formData.minimum_investment : investment.minimum_investment || 'N/A'}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {investment.currency || 'USD'}
                  </InputAdornment>
                ),
              }}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Redemption Period"
              name="redemption_period"
              value={editMode ? formData.redemption_period : investment.redemption_period || 'N/A'}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    days
                  </InputAdornment>
                ),
              }}
              disabled={!editMode}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

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
          Back to Investments
        </Button>

        {!editMode && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditMode(true)}
            sx={{ ml: 'auto' }}
          >
            Edit Investment
          </Button>
        )}
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

      {/* Investment Header */}
      <Paper elevation={0} sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 2,
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900]
      }}>
        <Stack direction="row" alignItems="center" spacing={3}>
          <Avatar sx={{ 
            width: 64, 
            height: 64, 
            bgcolor: 'background.paper',
            border: `2px solid ${theme.palette.divider}`
          }}>
            {investmentTypeIcons[investment.asset_class] || investmentTypeIcons.Other}
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight={600}>
              {investment.name}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" mt={1}>
              <Chip 
                label={investment.asset_class} 
                variant="outlined"
                icon={investmentTypeIcons[investment.asset_class] || investmentTypeIcons.Other}
                sx={{ 
                  borderRadius: 1,
                  borderWidth: 1.5,
                  px: 1
                }}
              />
              <Chip 
                label={investment.status} 
                color={statusColors[investment.status] || 'default'}
                icon={statusIcons[investment.status]}
                variant="outlined"
                sx={{ 
                  borderRadius: 1,
                  borderWidth: 1.5,
                  px: 1
                }}
              />
              <Typography variant="body1" color="text.secondary">
                ISIN: {investment.isin}
              </Typography>
            </Stack>
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
        >
          <Tab label="Overview" />
          <Tab label="Details" />
          <Tab label="Performance" />
        </Tabs>

        {activeTab === 0 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Current Price
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1 }}>
                      {formatCurrency(investment.price, investment.currency)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Last updated: {formatDateTime(investment.last_price_update)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Asset Class
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1 }}>
                      {investment.asset_class}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {investment.fund_type && `Fund type: ${investment.fund_type}`}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {statusIcons[investment.status]}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {investment.status}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Since: {formatDate(investment.created_at)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card variant="outlined" sx={{ mt: 3 }}>
              <CardHeader 
                title="Description" 
                avatar={<InfoIcon color="primary" />}
              />
              <CardContent>
                <Typography>
                  {investment.description || 'No description available for this investment.'}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            {renderBasicInfo()}
            {renderAssetClassSpecificInfo()}
            {renderFeesAndMinimums()}

            {editMode && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: 2, 
                mt: 3,
                pt: 2,
                borderTop: `1px solid ${theme.palette.divider}`
              }}>
                <Button
                  variant="outlined"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  startIcon={<CloseIcon />}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading}
                  startIcon={<SaveIcon />}
                >
                  Save Changes
                </Button>
              </Box>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Card variant="outlined">
            <CardHeader 
              title="Performance Metrics" 
              avatar={<TrendingUp color="primary" />}
            />
            <CardContent>
              <Typography color="text.secondary">
                Performance data will be displayed here once available.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default InvestmentDetail;