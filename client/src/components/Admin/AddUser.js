import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider,
  Paper,
  Alert,
  InputAdornment,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Business as RoleIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

const steps = ['Basic Information', 'Account Details', 'Review'];

export default function AddUser({ onSubmit, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    role: 'investor',
    password: '',
    confirmPassword: '',
    sendWelcomeEmail: true
  });
  const [errors, setErrors] = useState({
    email: false,
    full_name: false,
    phone: false,
    password: false,
    confirmPassword: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    if (!phone) return true;
    const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    return re.test(phone);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleNext = () => {
    let valid = true;
    const newErrors = {...errors};

    if (activeStep === 0) {
      if (!formData.email) {
        newErrors.email = 'Email is required';
        valid = false;
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Invalid email format';
        valid = false;
      }

      if (!formData.full_name) {
        newErrors.full_name = 'Full name is required';
        valid = false;
      }
    } else if (activeStep === 1) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
        valid = false;
      } else if (!validatePassword(formData.password)) {
        newErrors.password = 'Password must be at least 8 characters';
        valid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
        valid = false;
      }
    }

    setErrors(newErrors);
    if (valid) setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        email: formData.email.trim(),
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim(),
        role: formData.role,
        password: formData.password,
        sendWelcomeEmail: formData.sendWelcomeEmail
      });
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      setErrors(prev => ({ ...prev, form: err.message || 'Failed to create user' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color={errors.email ? "error" : "action"} />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                error={!!errors.full_name}
                helperText={errors.full_name}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color={errors.full_name ? "error" : "action"} />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number (Optional)"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone || 'Include country code if applicable'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color={errors.phone ? "error" : "action"} />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || 'Minimum 8 characters'}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color={errors.password ? "error" : "action"} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color={errors.confirmPassword ? "error" : "action"} />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>User Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="User Role"
                  onChange={handleChange}
                  required
                  variant="outlined"
                >
                  <MenuItem value="investor">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'success.light' }}>I</Avatar>
                      <span>Investor</span>
                    </Box>
                  </MenuItem>
                  <MenuItem value="admin">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}>A</Avatar>
                      <span>Admin</span>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>Review Information</Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography>{formData.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                <Typography>{formData.full_name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                <Typography>{formData.phone || 'Not provided'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Role</Typography>
                <Typography sx={{ textTransform: 'capitalize' }}>{formData.role}</Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.sendWelcomeEmail}
                    onChange={(e) => setFormData({...formData, sendWelcomeEmail: e.target.checked})}
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>Send welcome email with login instructions</span>
                    <Tooltip title="Includes their temporary password and login link">
                      <InfoIcon color="action" sx={{ ml: 1 }} fontSize="small" />
                    </Tooltip>
                  </Box>
                }
              />
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={onClose} TransitionComponent={Fade}>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="600">
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2, display: 'inline-flex' }}>
              <PersonIcon />
            </Avatar>
            {success ? 'User Created Successfully' : 'Create New User'}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {success ? (
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>User Account Created</Typography>
            <Typography color="text.secondary" textAlign="center">
              {formData.full_name} has been successfully added to the system.
              {formData.sendWelcomeEmail && ' A welcome email has been sent.'}
            </Typography>
          </Box>
        </DialogContent>
      ) : (
        <>
          <DialogContent>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {errors.form && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.form}
              </Alert>
            )}

            {renderStepContent(activeStep)}
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Box sx={{ flex: 1 }}>
              {activeStep > 0 && (
                <Button onClick={handleBack} variant="outlined" disabled={isSubmitting}>
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
                >
                  Continue
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit} 
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                >
                  {isSubmitting ? 'Creating...' : 'Create User'}
                </Button>
              )}
            </Box>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}