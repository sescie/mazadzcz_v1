// src/components/Auth/Register.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Container, Typography, TextField, Grid, Avatar,
  FormControlLabel, Checkbox, Link, Box, Alert, Divider,
  IconButton, Button, CircularProgress, Stepper, Step, StepLabel, 
  Paper, FormHelperText, InputAdornment
} from '@mui/material';
import { 
  LockOutlined, Person, Email, Phone, 
  LocationOn, Visibility, VisibilityOff, Google, GitHub,
  Home, Badge, Description, CheckCircle, ArrowBack,
  Cake, Flag, AccountBalance, Receipt, CreditCard
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import ParticlesAuthBackground from './ParticlesAuthBackground';
import { register } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const GlassPaper = styled(Container)(({ theme }) => ({
  backdropFilter: 'blur(16px) saturate(180%)',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(17, 25, 40, 0.85)'
    : 'rgba(255, 255, 255, 0.95)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.125)',
  boxShadow: theme.shadows[15],
  padding: '40px 32px',
  position: 'relative',
  zIndex: 1,
  maxWidth: '800px',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderWidth: '2px',
      boxShadow: `${theme.palette.primary.light} 0 0 8px`,
    },
  },
  marginBottom: theme.spacing(2),
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(1),
  borderBottom: `2px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.primary.main,
}));

const steps = ['Personal', 'Address & ID', 'Financial', 'Review'];

export default function Register() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Personal Details
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    date_of_birth: '',
    nationality: '',
    
    // Address & ID
    residential_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    id_number: '',
    id_document: null,
    proof_of_address: null,
    source_of_funds: '',
    
    // Financial Information
    bank_name: '',
    bank_account_name: '',
    bank_account_number: '',
    bank_branch: '',
    swift_bic: '',
    preferred_payout_method: 'bank_transfer',
    
    // Terms
    terms_accepted: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (name) => (e) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.target.files[0]
    }));
  };

  const handleNext = () => {
    // Validate current step before proceeding
    let errors = [];
    
    switch (activeStep) {
      case 0: // Personal Details
        if (!formData.full_name) errors.push('Full name is required');
        if (!formData.email) errors.push('Email is required');
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) 
          errors.push('Invalid email format');
        if (formData.password.length < 8) 
          errors.push('Password must be at least 8 characters');
        if (formData.password !== formData.confirmPassword) 
          errors.push('Passwords do not match');
        break;
      
      case 1: // Address & ID
        if (!formData.residential_address) errors.push('Address is required');
        if (!formData.country) errors.push('Country is required');
        if (!formData.id_number) errors.push('ID number is required');
        if (!formData.id_document) errors.push('ID document is required');
        if (!formData.source_of_funds) errors.push('Source of funds is required');
        break;
      
      case 2: // Financial Information
        if (!formData.bank_account_name) errors.push('Account name is required');
        if (!formData.bank_account_number) errors.push('Account number is required');
        break;
      
      case 3: // Review - no validation needed
        break;
    }
    
    if (errors.length) {
      setError(errors.join(' • '));
      return;
    }
    
    setError('');
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setError('');
    setActiveStep(activeStep - 1);
  };

  const handleSubmit = async () => {
    if (!formData.terms_accepted) {
      setError('You must accept the terms and conditions');
      return;
    }
    console.log(formData);
    
    setLoading(true);
    try {
      // Prepare form data for submission
      const formDataToSend = new FormData();
      
      // Append all form fields
      const { confirmPassword, ...submissionData } = formData;
      Object.entries(submissionData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
        }
      });
      console.log("sending data", formDataToSend);
      
      // Call API with form data
      const data = await register(formData);
      
      navigate("/", {
        state: {
          flash: "Your application has been successfully sent and is under review. You'll receive an email once your account has been approved."
        }
      });
      
    } catch (err) {
      let errorMessage = err.message;
      
      if (err.status === 409) {
        errorMessage = `
          ${err.message}
          ${err.details ? `\nDetails: ${err.details}` : ''}
          ${err.resolution ? `\nResolution: ${err.resolution}` : ''}
        `;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSocialRegister = (provider) => {
    console.log(`Register with ${provider}`);
  };

  // Form sections
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Personal Details
        return (
          <>
            <SectionHeader variant="h6">
              <Person fontSize="small" />
              Personal Information
            </SectionHeader>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Full Name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )
                  }}
                  helperText="Must be at least 8 characters"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Cake color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Flag color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </>
        );
      
      case 1: // Address & ID
        return (
          <>
            <SectionHeader variant="h6">
              <Home fontSize="small" />
              Address Information
            </SectionHeader>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="Residential Address"
                  name="residential_address"
                  value={formData.residential_address}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="State/Province"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Postal Code"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <SectionHeader variant="h6" sx={{ mt: 4 }}>
                  <Badge fontSize="small" />
                  Identity Verification
                </SectionHeader>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="ID Number"
                  name="id_number"
                  value={formData.id_number}
                  onChange={handleChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Source of Funds"
                  name="source_of_funds"
                  value={formData.source_of_funds}
                  onChange={handleChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ 
                    py: 2, 
                    borderRadius: '12px',
                    mb: 1,
                    borderStyle: formData.id_document ? 'solid' : 'dashed'
                  }}
                  startIcon={<Description />}
                >
                  {formData.id_document ? 'ID Document Uploaded' : 'Upload ID Document'}
                  <input
                    type="file"
                    name="id_document"
                    hidden
                    onChange={handleFileChange('id_document')}
                    required
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </Button>
                <FormHelperText>
                  {formData.id_document ? formData.id_document.name : 'Required: Passport, ID card or driver license'}
                </FormHelperText>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ 
                    py: 2, 
                    borderRadius: '12px',
                    mb: 1,
                    borderStyle: formData.proof_of_address ? 'solid' : 'dashed'
                  }}
                  startIcon={<Description />}
                >
                  {formData.proof_of_address ? 'Proof Uploaded' : 'Proof of Address'}
                  <input
                    type="file"
                    name="proof_of_address"
                    hidden
                    onChange={handleFileChange('proof_of_address')}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </Button>
                <FormHelperText>
                  {formData.proof_of_address ? formData.proof_of_address.name : 'Optional: Utility bill or bank statement'}
                </FormHelperText>
              </Grid>
            </Grid>
          </>
        );
      
      case 2: // Financial Information
        return (
          <>
            <SectionHeader variant="h6">
              <AccountBalance fontSize="small" />
              Bank Account Details
            </SectionHeader>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Bank Name"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Account Holder Name"
                  name="bank_account_name"
                  value={formData.bank_account_name}
                  onChange={handleChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Account Number"
                  name="bank_account_number"
                  value={formData.bank_account_number}
                  onChange={handleChange}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <StyledTextField
                  fullWidth
                  label="Bank Branch"
                  name="bank_branch"
                  value={formData.bank_branch}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  label="SWIFT/BIC Code"
                  name="swift_bic"
                  value={formData.swift_bic}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <StyledTextField
                  fullWidth
                  select
                  label="Preferred Payout Method"
                  name="preferred_payout_method"
                  value={formData.preferred_payout_method}
                  onChange={handleChange}
                  SelectProps={{
                    native: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCard color="action" />
                      </InputAdornment>
                    )
                  }}
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="crypto">Cryptocurrency</option>
                </StyledTextField>
              </Grid>
            </Grid>
          </>
        );
      
      case 3: // Review
        return (
          <>
            <SectionHeader variant="h6">
              <Receipt fontSize="small" />
              Review Your Information
            </SectionHeader>
            
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '16px', bgcolor: 'background.paper' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person fontSize="small" /> Personal Details
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Full Name</Typography>
                  <Typography>{formData.full_name || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Email</Typography>
                  <Typography>{formData.email}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Phone</Typography>
                  <Typography>{formData.phone || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Date of Birth</Typography>
                  <Typography>{formData.date_of_birth || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Nationality</Typography>
                  <Typography>{formData.nationality || 'Not provided'}</Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '16px', bgcolor: 'background.paper' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Home fontSize="small" /> Address & Identification
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Address</Typography>
                  <Typography>{formData.residential_address}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>City</Typography>
                  <Typography>{formData.city || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>State</Typography>
                  <Typography>{formData.state || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Postal Code</Typography>
                  <Typography>{formData.postal_code || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Country</Typography>
                  <Typography>{formData.country}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>ID Number</Typography>
                  <Typography>{formData.id_number}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Source of Funds</Typography>
                  <Typography>{formData.source_of_funds}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>ID Document</Typography>
                  <Typography>{formData.id_document ? formData.id_document.name : 'Not uploaded'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Proof of Address</Typography>
                  <Typography>{formData.proof_of_address ? formData.proof_of_address.name : 'Not uploaded'}</Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: '16px', bgcolor: 'background.paper' }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalance fontSize="small" /> Financial Information
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Bank Name</Typography>
                  <Typography>{formData.bank_name || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Account Holder</Typography>
                  <Typography>{formData.bank_account_name}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Account Number</Typography>
                  <Typography>{formData.bank_account_number}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Bank Branch</Typography>
                  <Typography>{formData.bank_branch || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>SWIFT/BIC</Typography>
                  <Typography>{formData.swift_bic || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Payout Method</Typography>
                  <Typography>{formData.preferred_payout_method}</Typography>
                </Grid>
              </Grid>
            </Paper>
            
            <FormControlLabel
              control={
                <Checkbox 
                  name="terms_accepted" 
                  checked={formData.terms_accepted}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  I agree to the{' '}
                  <Link href="#" underline="hover" sx={{ fontWeight: 600 }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" underline="hover" sx={{ fontWeight: 600 }}>
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mt: 2 }}
            />
          </>
        );
      
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.palette.mode === 'dark'
        ? 'radial-gradient(circle at top, #0f0c29, #302b63, #24243e)'
        : 'radial-gradient(circle at top, #f5f7fa, #c3cfe2)',
      position: 'relative',
      overflow: 'hidden',
      py: 4,
    }}>
      <ParticlesAuthBackground />

      <GlassPaper maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar sx={{ 
              m: '0 auto', 
              bgcolor: 'primary.main',
              width: 64,
              height: 64,
              boxShadow: theme.shadows[6]
            }}>
              <LockOutlined sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800, 
                letterSpacing: '-0.5px',
                mt: 2,
                color: theme.palette.mode === 'dark' ? '#e0e0e0' : '#333',
              }}
            >
              Join Mazadzicz
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: 'text.secondary' }}>
              Create your investor account in seconds
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel 
                  StepIconProps={{
                    sx: {
                      '&.Mui-completed': { color: 'success.main' },
                      '&.Mui-active': { color: 'primary.main' }
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: '12px',
                    boxShadow: theme.shadows[1],
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <Box component="form">
            {renderStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0 || loading}
                startIcon={<ArrowBack />}
                sx={{ 
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  visibility: activeStep === 0 ? 'hidden' : 'visible'
                }}
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <LoadingButton
                  variant="contained"
                  onClick={handleSubmit}
                  loading={loading}
                  loadingIndicator={
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <CircularProgress size={20} />
                      Submitting...
                    </Box>
                  }
                  startIcon={<CheckCircle />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 700,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `${theme.palette.primary.main} 0 8px 24px`,
                    },
                  }}
                >
                  Submit Application
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    fontWeight: 700,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `${theme.palette.primary.main} 0 8px 24px`,
                    },
                  }}
                >
                  Continue
                </Button>
              )}
            </Box>
          </Box>

          {activeStep === 0 && (
            <>
              <Divider sx={{ my: 3, color: 'text.secondary' }}>OR CONTINUE WITH</Divider>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
                {['Google', 'GitHub'].map((provider) => (
                  <Button
                    key={provider}
                    variant="outlined"
                    sx={{
                      borderRadius: '12px',
                      px: 3,
                      py: 1.5,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor: 'primary.main',
                      },
                    }}
                    onClick={() => handleSocialRegister(provider)}
                  >
                    {provider === 'Google' ? (
                      <Google sx={{ fontSize: 28 }} />
                    ) : (
                      <GitHub sx={{ fontSize: 28 }} />
                    )}
                  </Button>
                ))}
              </Box>

              <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
                Already have an account?{' '}
                <Link href="/login" underline="hover" sx={{ fontWeight: 600 }}>
                  Sign in here
                </Link>
              </Typography>
            </>
          )}
        </motion.div>
      </GlassPaper>
    </Box>
  );
}