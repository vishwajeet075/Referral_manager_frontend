import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import LockIcon from '@mui/icons-material/Lock';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


import { useNavigate } from 'react-router-dom';

// Styled components
const FormPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(5),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
  marginTop: theme.spacing(8),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 8px ${theme.palette.primary.light}`,
    },
  },
  marginTop: theme.spacing(2),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(1.2, 4),
  borderRadius: 30,
  background: 'linear-gradient(45deg, #4a66eb 0%, #65acfa 100%)',
  boxShadow: '0 4px 20px rgba(97, 117, 252, 0.4)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 25px rgba(97, 117, 252, 0.6)',
    transform: 'translateY(-2px)',
  },
}));

const LogoBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: '#fff',
  width: 70,
  height: 70,
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
}));

const PasswordStrengthBar = styled(LinearProgress)(({ theme, value }) => ({
  marginTop: theme.spacing(1),
  borderRadius: 5,
  height: 8,
  backgroundColor: '#e0e0e0',
  '& .MuiLinearProgress-bar': {
    backgroundColor:
      value < 33 ? '#f44336' : value < 66 ? '#ff9800' : '#4caf50',
  },
}));

 // eslint-disable-next-line 
const PasswordRequirement = styled(Box)(({ theme, met }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(0.5),
  color: met ? '#4caf50' : '#9e9e9e',
  fontSize: '0.75rem',
}));

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [tokenValid, setTokenValid] = useState(true);
  const [validatingToken, setValidatingToken] = useState(true);

  const token = window.location.pathname.split('/').pop();
  console.log(token);
  const navigate = useNavigate();

  // Password requirements
  const hasLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch(
          `https://referral-manager-backend.onrender.com/forgot/validate-reset-token/${token}`
        );
        const data = await response.json();

        if (!response.ok) {
          setTokenValid(false);
          setError(data.error || 'Invalid or expired token');
          setOpenSnackbar(true);
        }
      } catch (err) {
        setTokenValid(false);
        setError('Failed to validate token. Please request a new password reset link.');
        setOpenSnackbar(true);
      } finally {
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (hasLength) strength += 20;
    if (hasUpperCase) strength += 20;
    if (hasLowerCase) strength += 20;
    if (hasNumber) strength += 20;
    if (hasSpecialChar) strength += 20;

    setPasswordStrength(strength);
  }, [password, hasLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar]);

  // Handle password reset submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setOpenSnackbar(true);
      return;
    }

    if (passwordStrength < 60) {
      setError('Password is not strong enough');
      setOpenSnackbar(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://referral-manager-backend.onrender.com/forgot/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setIsLoading(false);
      setSuccess(true);
      setOpenSnackbar(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Something went wrong. Please try again.');
      setOpenSnackbar(true);
    }
  };

  // Handle snackbar close
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // Loading state while validating token
  if (validatingToken) {
    return (
      <Container maxWidth="sm">
        <FormPaper elevation={3}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Validating your reset link...
          </Typography>
        </FormPaper>
      </Container>
    );
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <Container maxWidth="sm">
        <FormPaper elevation={3}>
          <Typography variant="h5" color="error" gutterBottom>
            Invalid or Expired Link
          </Typography>
          <Typography variant="body1" paragraph>
            This password reset link is invalid or has expired.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/forgot-password')}
          >
            Request New Link
          </Button>
        </FormPaper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FormPaper elevation={3}>
          <LogoBox>
            <LockResetIcon fontSize="large" />
          </LogoBox>

          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Reset Password
          </Typography>

          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your new password below
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {/* Password Input */}
            <StyledTextField
              required
              fullWidth
              name="password"
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Password Strength Bar */}
            <Box sx={{ mt: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Password Strength
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Medium' : 'Strong'}
                </Typography>
              </Box>
              <PasswordStrengthBar variant="determinate" value={passwordStrength} />
            </Box>

            {/* Confirm Password Input */}
            <StyledTextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPassword !== '' && password !== confirmPassword}
              helperText={
                confirmPassword !== '' && password !== confirmPassword
                  ? 'Passwords do not match'
                  : ''
              }
              InputProps={{
                startAdornment: <LockIcon color="action" sx={{ mr: 1 }} />,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || password !== confirmPassword || passwordStrength < 60}
            >
              {isLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                  Resetting Password...
                </Box>
              ) : (
                'Reset Password'
              )}
            </SubmitButton>
          </Box>
        </FormPaper>
      </motion.div>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert
          onClose={handleCloseSnackbar}
          severity={success ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {success ? 'Password reset successfully! Redirecting to login...' : error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ResetPassword;