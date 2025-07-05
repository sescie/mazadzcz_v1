import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Box,
  Typography, Divider, Alert, InputAdornment, Avatar, Stepper, Step, StepLabel,
  DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox,
  IconButton, CircularProgress, Tooltip, Paper, useTheme, Tabs, Tab
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as EquityIcon,
  AccountBalance as FixedIncomeIcon,
  Savings as FundIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  ArrowBack as BackIcon,
  DateRange as DateIcon,
  Percent as PercentIcon,
  BarChart as ChartIcon,
  Category as CategoryIcon,
  CorporateFare as CorporateIcon,
  CreditCard as CreditIcon,
  ShowChart as ChartLineIcon,
  PieChart as BarChartIcon,
  Public as GlobalIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

const assetClasses = [
  { value: 'EQUITY', label: 'Equity', icon: <EquityIcon color="primary" /> },
  { value: 'FIXED_INCOME', label: 'Fixed Income', icon: <FixedIncomeIcon color="secondary" /> },
  { value: 'FUND', label: 'Fund', icon: <FundIcon color="success" /> }
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'PENDING', label: 'Pending Approval' }
];

const currencyOptions = [
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
  { value: 'JPY', label: 'Japanese Yen (JPY)' },
  { value: 'CHF', label: 'Swiss Franc (CHF)' }
];

const fundTypes = [
  { value: 'MUTUAL', label: 'Mutual Fund' },
  { value: 'ETF', label: 'Exchange Traded Fund' },
  { value: 'HEDGE', label: 'Hedge Fund' },
  { value: 'PRIVATE_EQUITY', label: 'Private Equity' }
];

const creditRatings = [
  { value: 'AAA', label: 'AAA (Highest Quality)' },
  { value: 'AA', label: 'AA (High Quality)' },
  { value: 'A', label: 'A (Upper Medium Grade)' },
  { value: 'BBB', label: 'BBB (Medium Grade)' },
  { value: 'BB', label: 'BB (Lower Medium Grade)' },
  { value: 'B', label: 'B (Speculative)' },
  { value: 'CCC', label: 'CCC (Poor Quality)' },
  { value: 'D', label: 'D (In Default)' }
];

const frequencyOptions = [
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'QUARTERLY', label: 'Quarterly' },
  { value: 'SEMI_ANNUAL', label: 'Semi-Annual' },
  { value: 'ANNUAL', label: 'Annual' },
  { value: 'NONE', label: 'None' }
];

const steps = ['Basic Information', 'Financial Details', 'Asset-Specific Details', 'Review & Create'];

export default function AddInvestment({ onSubmit, onClose }) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    // Common fields
    name: '',
    isin: '',
    asset_class: 'EQUITY',
    currency: 'USD',
    price: '',
    description: '',
    status: 'ACTIVE',
    inception_date: '',
    cusip: '',
    ticker: '',
    
    // Equity specific
    exchange: '',
    sector: '',
    industry: '',
    market_cap: '',
    dividend_yield: '',
    dividend_frequency: 'QUARTERLY',
    pe_ratio: '',
    beta: '',
    
    // Fixed income specific
    coupon_rate: '',
    issue_date: '',
    maturity_date: '',
    credit_rating: 'BBB',
    duration: '',
    yield_to_maturity: '',
    payment_frequency: 'SEMI_ANNUAL',
    face_value: '',
    
    // Fund specific
    fund_type: 'MUTUAL',
    nav: '',
    aum: '',
    expense_ratio: '',
    benchmark: '',
    portfolio_manager: '',
    strategy: '',
    
    // Fees & restrictions
    management_fee: '',
    performance_fee: '',
    minimum_investment: '',
    redemption_period: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Reset asset-specific tabs when asset class changes
    setActiveTab(0);
  }, [formData.asset_class]);

  const validateStep = (step) => {
    const newErrors = {};
    
    // Basic information validation
    if (step === 0) {
      if (!formData.name) newErrors.name = 'Name is required';
      if (!formData.isin) newErrors.isin = 'ISIN is required';
      else if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(formData.isin)) {
        newErrors.isin = 'Invalid ISIN format (e.g., US0378331005)';
      }
      if (!formData.asset_class) newErrors.asset_class = 'Asset class is required';
    }
    
    // Financial details validation
    if (step === 1) {
      if (!formData.price || isNaN(formData.price)) newErrors.price = 'Valid price is required';
      if (!formData.currency) newErrors.currency = 'Currency is required';
      
      // Asset class specific validations
      if (formData.asset_class === 'FUND') {
        if (!formData.nav || isNaN(formData.nav)) newErrors.nav = 'Valid NAV is required';
        if (!formData.aum || isNaN(formData.aum)) newErrors.aum = 'Valid AUM is required';
      }
    }
    
    // Asset-specific details validation
    if (step === 2) {
      switch (formData.asset_class) {
        case 'EQUITY':
          if (!formData.exchange) newErrors.exchange = 'Exchange is required';
          if (!formData.sector) newErrors.sector = 'Sector is required';
          if (!formData.industry) newErrors.industry = 'Industry is required';
          break;
        case 'FIXED_INCOME':
          if (!formData.coupon_rate || isNaN(formData.coupon_rate)) newErrors.coupon_rate = 'Valid coupon rate is required';
          if (!formData.maturity_date) newErrors.maturity_date = 'Maturity date is required';
          if (!formData.credit_rating) newErrors.credit_rating = 'Credit rating is required';
          break;
        case 'FUND':
          if (!formData.fund_type) newErrors.fund_type = 'Fund type is required';
          if (!formData.expense_ratio || isNaN(formData.expense_ratio)) newErrors.expense_ratio = 'Valid expense ratio is required';
          break;
        default:
          // Optionally, you could set a generic error or do nothing
          break;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare the data for submission
      const submissionData = {
        ...formData,
        price: parseFloat(formData.price),
        market_cap: formData.market_cap ? parseFloat(formData.market_cap) : null,
        dividend_yield: formData.dividend_yield ? parseFloat(formData.dividend_yield) : null,
        pe_ratio: formData.pe_ratio ? parseFloat(formData.pe_ratio) : null,
        beta: formData.beta ? parseFloat(formData.beta) : null,
        coupon_rate: formData.coupon_rate ? parseFloat(formData.coupon_rate) : null,
        yield_to_maturity: formData.yield_to_maturity ? parseFloat(formData.yield_to_maturity) : null,
        face_value: formData.face_value ? parseFloat(formData.face_value) : null,
        nav: formData.nav ? parseFloat(formData.nav) : null,
        aum: formData.aum ? parseFloat(formData.aum) : null,
        expense_ratio: formData.expense_ratio ? parseFloat(formData.expense_ratio) : null,
        management_fee: formData.management_fee ? parseFloat(formData.management_fee) : null,
        performance_fee: formData.performance_fee ? parseFloat(formData.performance_fee) : null,
        minimum_investment: formData.minimum_investment ? parseFloat(formData.minimum_investment) : null
      };

      await onSubmit(submissionData);
    } catch (err) {
      setErrors(prev => ({ ...prev, form: err.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCommonFields = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Investment Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!errors.name}
          helperText={errors.name}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CorporateIcon color={errors.name ? "error" : "action"} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControl fullWidth error={!!errors.asset_class} required>
          <InputLabel>Asset Class</InputLabel>
          <Select
            name="asset_class"
            value={formData.asset_class}
            label="Asset Class"
            onChange={handleChange}
          >
            {assetClasses.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar sx={{ 
                    width: 24, 
                    height: 24, 
                    bgcolor: 'transparent',
                    border: `1px solid ${theme.palette.divider}`
                  }}>
                    {type.icon}
                  </Avatar>
                  {type.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="ISIN"
          name="isin"
          value={formData.isin}
          onChange={handleChange}
          error={!!errors.isin}
          helperText={errors.isin || '12-character international identifier (e.g., US0378331005)'}
          required
          inputProps={{ 
            maxLength: 12,
            style: { textTransform: 'uppercase' }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title="International Securities Identification Number">
                  <InfoIcon color={errors.isin ? "error" : "action"} />
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="CUSIP (if applicable)"
          name="cusip"
          value={formData.cusip}
          onChange={handleChange}
          inputProps={{ 
            maxLength: 9,
            style: { textTransform: 'uppercase' }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Tooltip title="Committee on Uniform Securities Identification Procedures">
                  <InfoIcon color="action" />
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Ticker Symbol"
          name="ticker"
          value={formData.ticker}
          onChange={handleChange}
          inputProps={{ 
            maxLength: 10,
            style: { textTransform: 'uppercase' }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ChartLineIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            label="Status"
            onChange={handleChange}
          >
            {statusOptions.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          helperText="Detailed description of the investment product"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                <InfoIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );

  const renderFinancialFields = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth error={!!errors.currency} required>
          <InputLabel>Currency</InputLabel>
          <Select
            name="currency"
            value={formData.currency}
            label="Currency"
            onChange={handleChange}
          >
            {currencyOptions.map((currency) => (
              <MenuItem key={currency.value} value={currency.value}>
                {currency.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={`Current Price (${formData.currency})`}
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          error={!!errors.price}
          helperText={errors.price}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {formData.currency === 'USD' ? '$' : 
                 formData.currency === 'EUR' ? '€' : 
                 formData.currency === 'GBP' ? '£' : 
                 formData.currency === 'JPY' ? '¥' : 'CHF'}
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      {formData.asset_class === 'FUND' && (
        <>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Net Asset Value (NAV)"
              name="nav"
              type="number"
              value={formData.nav}
              onChange={handleChange}
              error={!!errors.nav}
              helperText={errors.nav}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {formData.currency === 'USD' ? '$' : 
                     formData.currency === 'EUR' ? '€' : 
                     formData.currency === 'GBP' ? '£' : 
                     formData.currency === 'JPY' ? '¥' : 'CHF'}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Assets Under Management (AUM)"
              name="aum"
              type="number"
              value={formData.aum}
              onChange={handleChange}
              error={!!errors.aum}
              helperText={errors.aum}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {formData.currency === 'USD' ? '$' : 
                     formData.currency === 'EUR' ? '€' : 
                     formData.currency === 'GBP' ? '£' : 
                     formData.currency === 'JPY' ? '¥' : 'CHF'}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </>
      )}
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Management Fee (%)"
          name="management_fee"
          type="number"
          value={formData.management_fee}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PercentIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">%</InputAdornment>
            )
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Performance Fee (%)"
          name="performance_fee"
          type="number"
          value={formData.performance_fee}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PercentIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">%</InputAdornment>
            )
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label={`Minimum Investment (${formData.currency})`}
          name="minimum_investment"
          type="number"
          value={formData.minimum_investment}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {formData.currency === 'USD' ? '$' : 
                 formData.currency === 'EUR' ? '€' : 
                 formData.currency === 'GBP' ? '£' : 
                 formData.currency === 'JPY' ? '¥' : 'CHF'}
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Redemption Period (days)"
          name="redemption_period"
          type="number"
          value={formData.redemption_period}
          onChange={handleChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <ScheduleIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Inception Date"
          name="inception_date"
          type="date"
          value={formData.inception_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <DateIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
  );

  const renderAssetSpecificFields = () => {
    switch (formData.asset_class) {
      case 'EQUITY':
        return (
          <Box>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Basic Details" />
              <Tab label="Dividend Info" />
              <Tab label="Valuation Metrics" />
            </Tabs>
            
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Exchange"
                    name="exchange"
                    value={formData.exchange}
                    onChange={handleChange}
                    error={!!errors.exchange}
                    helperText={errors.exchange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GlobalIcon color={errors.exchange ? "error" : "action"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Sector"
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    error={!!errors.sector}
                    helperText={errors.sector}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon color={errors.sector ? "error" : "action"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    error={!!errors.industry}
                    helperText={errors.industry}
                    required
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={`Market Cap (${formData.currency})`}
                    name="market_cap"
                    type="number"
                    value={formData.market_cap}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {formData.currency === 'USD' ? '$' : 
                           formData.currency === 'EUR' ? '€' : 
                           formData.currency === 'GBP' ? '£' : 
                           formData.currency === 'JPY' ? '¥' : 'CHF'}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            )}
            
            {activeTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Dividend Yield (%)"
                    name="dividend_yield"
                    type="number"
                    value={formData.dividend_yield}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PercentIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Dividend Frequency</InputLabel>
                    <Select
                      name="dividend_frequency"
                      value={formData.dividend_frequency}
                      label="Dividend Frequency"
                      onChange={handleChange}
                    >
                      {frequencyOptions.map((freq) => (
                        <MenuItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
            
            {activeTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="P/E Ratio"
                    name="pe_ratio"
                    type="number"
                    value={formData.pe_ratio}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ChartIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Beta"
                    name="beta"
                    type="number"
                    value={formData.beta}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TrendingUpIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        );
        
      case 'FIXED_INCOME':
        return (
          <Box>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Basic Details" />
              <Tab label="Yield & Duration" />
              <Tab label="Payment Info" />
            </Tabs>
            
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Coupon Rate (%)"
                    name="coupon_rate"
                    type="number"
                    value={formData.coupon_rate}
                    onChange={handleChange}
                    error={!!errors.coupon_rate}
                    helperText={errors.coupon_rate}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PercentIcon color={errors.coupon_rate ? "error" : "action"} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      )
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.credit_rating} required>
                    <InputLabel>Credit Rating</InputLabel>
                    <Select
                      name="credit_rating"
                      value={formData.credit_rating}
                      label="Credit Rating"
                      onChange={handleChange}
                    >
                      {creditRatings.map((rating) => (
                        <MenuItem key={rating.value} value={rating.value}>
                          {rating.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Issue Date"
                    name="issue_date"
                    type="date"
                    value={formData.issue_date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Maturity Date"
                    name="maturity_date"
                    type="date"
                    value={formData.maturity_date}
                    onChange={handleChange}
                    error={!!errors.maturity_date}
                    helperText={errors.maturity_date}
                    required
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateIcon color={errors.maturity_date ? "error" : "action"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            )}
            
            {activeTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Duration (years)"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ScheduleIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Yield to Maturity (%)"
                    name="yield_to_maturity"
                    type="number"
                    value={formData.yield_to_maturity}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PercentIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            )}
            
            {activeTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Frequency</InputLabel>
                    <Select
                      name="payment_frequency"
                      value={formData.payment_frequency}
                      label="Payment Frequency"
                      onChange={handleChange}
                    >
                      {frequencyOptions.filter(f => f.value !== 'NONE').map((freq) => (
                        <MenuItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={`Face Value (${formData.currency})`}
                    name="face_value"
                    type="number"
                    value={formData.face_value}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {formData.currency === 'USD' ? '$' : 
                           formData.currency === 'EUR' ? '€' : 
                           formData.currency === 'GBP' ? '£' : 
                           formData.currency === 'JPY' ? '¥' : 'CHF'}
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        );
        
      case 'FUND':
        return (
          <Box>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Basic Details" />
              <Tab label="Performance" />
              <Tab label="Management" />
            </Tabs>
            
            {activeTab === 0 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={!!errors.fund_type} required>
                    <InputLabel>Fund Type</InputLabel>
                    <Select
                      name="fund_type"
                      value={formData.fund_type}
                      label="Fund Type"
                      onChange={handleChange}
                    >
                      {fundTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                          {type.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Expense Ratio (%)"
                    name="expense_ratio"
                    type="number"
                    value={formData.expense_ratio}
                    onChange={handleChange}
                    error={!!errors.expense_ratio}
                    helperText={errors.expense_ratio}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PercentIcon color={errors.expense_ratio ? "error" : "action"} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">%</InputAdornment>
                      )
                    }}
                  />
                </Grid>
              </Grid>
            )}
            
            {activeTab === 1 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Benchmark Index"
                    name="benchmark"
                    value={formData.benchmark}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BarChartIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            )}
            
            {activeTab === 2 && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Portfolio Manager"
                    name="portfolio_manager"
                    value={formData.portfolio_manager}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <StarIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Investment Strategy"
                    name="strategy"
                    value={formData.strategy}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                          <InfoIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        );
        
      default:
        return null;
    }
  };

  const renderReviewStep = () => {
    const formatCurrency = (value) => {
      if (value === undefined || value === null) return 'N/A';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: formData.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    };

    const formatPercentage = (value) => {
      if (value === undefined || value === null) return 'N/A';
      return `${parseFloat(value).toFixed(2)}%`;
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString();
    };

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>Investment Summary</Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            {assetClasses.find(a => a.value === formData.asset_class)?.icon}
            {formData.name}
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">ISIN</Typography>
              <Typography sx={{ fontWeight: 500, fontFamily: 'monospace' }}>{formData.isin}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Asset Class</Typography>
              <Typography sx={{ fontWeight: 500 }}>{formData.asset_class.replace('_', ' ')}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Status</Typography>
              <Typography sx={{ fontWeight: 500 }}>{formData.status}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Currency</Typography>
              <Typography sx={{ fontWeight: 500 }}>{formData.currency}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Current Price</Typography>
              <Typography sx={{ fontWeight: 500 }}>{formatCurrency(formData.price)}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Inception Date</Typography>
              <Typography sx={{ fontWeight: 500 }}>{formatDate(formData.inception_date)}</Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Asset class specific summary */}
        {formData.asset_class === 'EQUITY' && (
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>Equity Details</Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Exchange</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formData.exchange || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Sector</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formData.sector || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Industry</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formData.industry || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Market Cap</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formatCurrency(formData.market_cap)}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Dividend Yield</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formatPercentage(formData.dividend_yield)}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">P/E Ratio</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formData.pe_ratio || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Beta</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formData.beta || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
        
        {formData.asset_class === 'FIXED_INCOME' && (
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>Fixed Income Details</Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Coupon Rate</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formatPercentage(formData.coupon_rate)}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Credit Rating</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formData.credit_rating || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Issue Date</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formatDate(formData.issue_date)}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Maturity Date</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formatDate(formData.maturity_date)}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Yield to Maturity</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formatPercentage(formData.yield_to_maturity)}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formData.duration ? `${formData.duration} years` : 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Payment Frequency</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {frequencyOptions.find(f => f.value === formData.payment_frequency)?.label || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Face Value</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formatCurrency(formData.face_value)}</Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
        
        {formData.asset_class === 'FUND' && (
          <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>Fund Details</Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Fund Type</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {fundTypes.find(f => f.value === formData.fund_type)?.label || 'N/A'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Net Asset Value</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formatCurrency(formData.nav)}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Assets Under Management</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formatCurrency(formData.aum)}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Expense Ratio</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formatPercentage(formData.expense_ratio)}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Benchmark</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formData.benchmark || 'N/A'}</Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">Portfolio Manager</Typography>
                <Typography sx={{ fontWeight: 500 }}>{formData.portfolio_manager || 'N/A'}</Typography>
              </Grid>
              
              {formData.strategy && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Investment Strategy</Typography>
                  <Typography sx={{ fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                    {formData.strategy}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        )}
        
        {/* Fees and restrictions */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>Fees & Restrictions</Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Management Fee</Typography>
              <Typography sx={{ fontWeight: 500 }}>{formatPercentage(formData.management_fee)}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Performance Fee</Typography>
              <Typography sx={{ fontWeight: 500 }}>{formatPercentage(formData.performance_fee)}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Minimum Investment</Typography>
              <Typography sx={{ fontWeight: 500 }}>{formatCurrency(formData.minimum_investment)}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Redemption Period</Typography>
              <Typography sx={{ fontWeight: 500 }}>
                {formData.redemption_period ? `${formData.redemption_period} days` : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Description */}
        {formData.description && (
          <Paper elevation={0} sx={{ p: 3, border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>Description</Typography>
            <Typography sx={{ whiteSpace: 'pre-wrap' }}>
              {formData.description}
            </Typography>
          </Paper>
        )}
      </Box>
    );
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0: return renderCommonFields();
      case 1: return renderFinancialFields();
      case 2: return renderAssetSpecificFields();
      case 3: return renderReviewStep();
      default: return null;
    }
  };

  return (
    <>
      <DialogTitle sx={{ 
        position: 'sticky', 
        top: 0, 
        bgcolor: 'background.paper', 
        zIndex: 1,
        borderBottom: `1px solid ${theme.palette.divider}`,
        py: 2
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 2
        }}>
          <Typography variant="h5" fontWeight={600}>
            <MoneyIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />
            New Investment Product
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{
                '& .MuiStepLabel-label': {
                  fontSize: '0.75rem',
                  [theme.breakpoints.up('sm')]: {
                    fontSize: '0.875rem'
                  }
                }
              }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent dividers sx={{ 
        bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        minHeight: '60vh'
      }}>
        {errors.form && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.form}
          </Alert>
        )}

        {renderStepContent(activeStep)}
      </DialogContent>

      <DialogActions sx={{ 
        p: 2,
        position: 'sticky',
        bottom: 0,
        bgcolor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`,
        zIndex: 1
      }}>
        <Box sx={{ flex: 1 }}>
          {activeStep > 0 && (
            <Button 
              onClick={handleBack} 
              variant="outlined" 
              startIcon={<BackIcon />}
              disabled={isSubmitting}
              sx={{ minWidth: 120 }}
            >
              Back
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {activeStep < steps.length - 1 ? (
            <Button 
              onClick={handleNext} 
              variant="contained"
              disabled={isSubmitting}
              sx={{ minWidth: 120 }}
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              color="success"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckIcon />}
              sx={{ minWidth: 180 }}
            >
              {isSubmitting ? 'Creating...' : 'Create Investment'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </>
  );
}