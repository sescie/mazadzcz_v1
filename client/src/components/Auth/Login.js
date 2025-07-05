// client/src/components/Auth/Login.js
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { 
  Container, TextField, Button, Typography, 
  Box, InputAdornment, IconButton, Divider,
  Tooltip, Alert, CircularProgress, Link
} from '@mui/material';
import { styled } from '@mui/system'; 
import {
  EmailRounded, LockRounded, Visibility, VisibilityOff,
  Google, GitHub, RocketLaunch, AccountCircleRounded
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import ParticlesAuthBackground from './ParticlesAuthBackground';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../services/api';

const GlassContainer = styled(Container)(({ theme }) => ({
  backdropFilter: 'blur(16px) saturate(180%)',
  backgroundColor: theme.palette.mode === 'dark' 
    ? 'rgba(17, 25, 40, 0.75)'
    : 'rgba(255, 255, 255, 0.9)',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.125)',
  boxShadow: theme.shadows[10],
  padding: '40px 32px',
  position: 'relative',
  zIndex: 1,
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
}));

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  useEffect(() => {
    if (auth) {
      const redirectPath = location.state?.from?.pathname || 
                         (auth.user.role === 'admin' ? '/admin/dashboard' : '/investor/portfolio');
      navigate(redirectPath, { replace: true });
    }
  }, [auth, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await login(email, password);
      setAuth({
        token: data.token,
        user: data.user
      });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: theme.palette.mode === 'dark'
        ? 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
        : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <ParticlesAuthBackground />

      <GlassContainer maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <RocketLaunch 
              sx={{ 
                fontSize: 56, 
                color: 'primary.main',
                filter: `drop-shadow(0 0 8px ${theme.palette.primary.light})`
              }} 
            />
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800, 
                letterSpacing: '-1px',
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(45deg, #00b4d8, #90e0ef)'
                  : 'linear-gradient(45deg, #1976d2, #2196f3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mt: 1,
              }}
            >
              Mazadzicz Portal
            </Typography>
          </Box>

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
                    boxShadow: theme.shadows[2],
                  }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <StyledTextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailRounded sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
                autoFocus
              />

              <StyledTextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRounded sx={{ color: 'text.secondary' }} />
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
                  ),
                }}
              />

              <LoadingButton
                fullWidth
                size="large"
                loading={isLoading}
                variant="contained"
                type="submit"
                sx={{
                  mt: 3,
                  py: 1.5,
                  borderRadius: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `${theme.palette.primary.main} 0 8px 24px`,
                  },
                }}
                loadingIndicator={
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <CircularProgress size={20} />
                    Authenticating...
                  </Box>
                }
              >
                {!isLoading && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AccountCircleRounded />
                    Sign In
                  </span>
                )}
              </LoadingButton>
            </motion.div>
          </form>

          {/* Registration Link Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Typography 
              variant="body2" 
              align="center" 
              sx={{ 
                mt: 2,
                color: 'text.secondary',
                a: {
                  fontWeight: 600,
                  textDecoration: 'none',
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #00b4d8, #90e0ef)'
                    : 'linear-gradient(45deg, #1976d2, #2196f3)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }
              }}
            >
              New to Mazadzicz?{' '}
              <Link component={RouterLink} to="/register">
                Create an account
              </Link>
            </Typography>
          </motion.div>

          <Divider sx={{ my: 3, color: 'text.secondary' }}>OR CONTINUE WITH</Divider>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            {['Google', 'GitHub'].map((provider) => (
              <Tooltip key={provider} title={`Sign in with ${provider}`}>
                <Button
                  variant="outlined"
                  sx={{
                    borderRadius: '12px',
                    px: 3,
                    py: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      borderColor: 'primary.main',
                      bgcolor: theme.palette.mode === 'dark'
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(25, 118, 210, 0.05)',
                    },
                  }}
                  onClick={() => handleSocialLogin(provider)}
                >
                  {provider === 'Google' ? (
                    <Google sx={{ fontSize: 28 }} />
                  ) : (
                    <GitHub sx={{ fontSize: 28 }} />
                  )}
                </Button>
              </Tooltip>
            ))}
          </Box>
        </motion.div>
      </GlassContainer>
    </Box>
  );
}