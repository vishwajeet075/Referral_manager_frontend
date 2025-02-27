import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  Zoom,
  Fade,
  Chip,
  CircularProgress,
  Backdrop,
  Snackbar,
  Alert
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff,
} from "@mui/icons-material";
import "../styles/Signup.css";

// Array of common passwords
const COMMON_PASSWORDS = ["password", "123456", "qwerty", "admin", "welcome", "12345678", "password123", "abc123"];

// Fun loading messages
const LOADING_MESSAGES = [
  "Warming up the servers...",
  "Getting everything ready for you...",
  "Almost there...",
  "Setting up your account...",
  "Preparing your workspace...",
  "Hang tight, we're almost done..."
];

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });
  const [activeHint, setActiveHint] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  // Email validation
  useEffect(() => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Please enter a valid email address");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  }, [email]);

  // Password validation
  useEffect(() => {
    // Check password criteria
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const isCommon = COMMON_PASSWORDS.includes(password.toLowerCase());
    
    // Determine the active hint
    if (password) {
      if (!hasLength) {
        setActiveHint("Use at least 8 characters");
      } else if (!hasUppercase) {
        setActiveHint("Add an uppercase letter");
      } else if (!hasLowercase) {
        setActiveHint("Add a lowercase letter");
      } else if (!hasNumber) {
        setActiveHint("Add a number");
      } else if (!hasSpecial) {
        setActiveHint("Add a special character");
      } else if (isCommon) {
        setActiveHint("This is a commonly used password");
      } else {
        setActiveHint("");
      }
    } else {
      setActiveHint("");
    }

    // Calculate strength score (0-5)
    let validCriteria = 0;
    if (hasLength) validCriteria++;
    if (hasUppercase) validCriteria++;
    if (hasLowercase) validCriteria++;
    if (hasNumber) validCriteria++;
    if (hasSpecial) validCriteria++;
    if (!isCommon && password) validCriteria++;
    
    // Define strength levels
    let strengthLabel = "";
    let strengthColor = "";
    
    if (password === "") {
      strengthLabel = "";
      strengthColor = "transparent";
    } else if (validCriteria <= 2) {
      strengthLabel = "Weak";
      strengthColor = "#f44336"; // Red
    } else if (validCriteria <= 4) {
      strengthLabel = "Fair";
      strengthColor = "#ff9800"; // Orange
    } else if (validCriteria === 5) {
      strengthLabel = "Good";
      strengthColor = "#2196f3"; // Blue
    } else {
      strengthLabel = "Strong";
      strengthColor = "#4caf50"; // Green
    }
    
    setPasswordStrength({
      score: validCriteria,
      label: strengthLabel,
      color: strengthColor,
    });
  }, [password]);

  // Loading message rotation
  useEffect(() => {
    let messageTimer;
    if (isLoading) {
      setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      
      messageTimer = setInterval(() => {
        setMessageIndex(prevIndex => (prevIndex + 1) % LOADING_MESSAGES.length);
      }, 2000);
    }
    
    return () => {
      if (messageTimer) clearInterval(messageTimer);
    };
  }, [isLoading, messageIndex]);
  
  useEffect(() => {
    if (isLoading) {
      setLoadingMessage(LOADING_MESSAGES[messageIndex]);
    }
  }, [messageIndex, isLoading]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validate before submission
    if (emailError || passwordStrength.score < 3) {
      setSuccessMessage("Please create a stronger password before submitting.");
      return;
    }
  
    // Extract referral token from the URL path
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/');
    
    // Only consider it a referral token if the path format is correct
    // Check if path has enough parts and includes the 'signup' part
    const hasReferralFormat = pathname.includes('/signup/') && pathParts.length > 2;
    const referral_token = hasReferralFormat ? pathParts[pathParts.length - 1] : null;
  
    // Prepare the user object
    const user = { name, email, password };
  
    // Add referral token to the user object if it exists
    if (referral_token) {
      user.referral_token = referral_token;
    }
  
    try {
      setIsLoading(true);
  
      // Always use the regular signup endpoint for non-referral signups
      const endpoint = referral_token
        ? "https://referral-manager-backend.onrender.com/referral/signup" // Endpoint for referral signup
        : "https://referral-manager-backend.onrender.com/auth/signup";   // Default signup endpoint
  
      // Send the request
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
  
      const data = await response.json();
  
      setIsLoading(false);
  
      if (response.ok) {
        setSuccessMessage("Signup successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setSuccessMessage(data.message || "Signup failed. Try again.");
      }
    } catch (error) {
      setIsLoading(false);
      setSuccessMessage("Error: " + error.message);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage("");
  };

  // Custom strength bar component
  const PasswordStrengthBar = ({ strength }) => {
    const segments = [1, 2, 3, 4, 5, 6];
    
    return (
      <Box sx={{ display: 'flex', mt: 1, mb: 0.5, gap: 0.5 }}>
        {segments.map((segment, index) => (
          <Box
            key={index}
            sx={{
              height: 4,
              flexGrow: 1,
              borderRadius: 2,
              bgcolor: index < strength.score ? strength.color : 'rgba(0,0,0,0.1)',
              transition: 'background-color 0.3s ease'
            }}
          />
        ))}
      </Box>
    );
  };

  // Loading overlay component
  const LoadingOverlay = () => (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background: 'rgba(108, 99, 255, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      open={isLoading}
    >
      <Box 
        sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.95)', 
          p: 4, 
          borderRadius: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          maxWidth: 350
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: '#6c63ff',
            mb: 2
          }}
        />
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#2c3e50', 
            textAlign: 'center', 
            fontWeight: 600,
            mb: 1 
          }}
        >
          {loadingMessage}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#666', 
            textAlign: 'center' 
          }}
        >
          This might take a moment as our server wakes up.
        </Typography>
      </Box>
    </Backdrop>
  );

  return (
    <Container
      component="main"
      maxWidth={false}
      disableGutters
      className="signup-container"
    >
      {/* Success message snackbar */}
      <Snackbar 
        open={!!successMessage} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={successMessage && successMessage.includes("successful") ? "success" : "error"}
          sx={{ 
            width: '100%',
            alignItems: 'center',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Loading overlay */}
      <LoadingOverlay />

      <Zoom in={true} timeout={500}>
        <Box className="signup-box">
          <Fade in={true} timeout={800}>
            <Box>
              <Typography
                component="h1"
                variant="h4"
                className="login-title"
                sx={{ textAlign: "center" }}
              >
                Sign Up
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                className="signup-subtitle"
              >
                Let's get started with your 30 days of free trial
              </Typography>
              <Box
                component="form"
                noValidate
                className="signup-form"
                onSubmit={handleSubmit}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  variant="outlined"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                {/* Password strength indicator */}
                {password && (
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        Password Strength
                      </Typography>
                      {passwordStrength.label && (
                        <Chip
                          label={passwordStrength.label}
                          size="small"
                          sx={{
                            bgcolor: passwordStrength.color,
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 24
                          }}
                        />
                      )}
                    </Box>
                    <PasswordStrengthBar strength={passwordStrength} />
                    
                    {/* Dynamic hint */}
                    {activeHint && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 1,
                          color: activeHint.includes("commonly") ? "warning.main" : "text.secondary",
                          fontSize: "0.8rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5
                        }}
                      >
                        <Box 
                          component="span" 
                          sx={{ 
                            display: "inline-block", 
                            width: 8, 
                            height: 8, 
                            borderRadius: "50%", 
                            bgcolor: activeHint.includes("commonly") ? "warning.main" : "primary.main",
                            mr: 0.5
                          }} 
                        />
                        {activeHint}
                      </Typography>
                    )}
                  </Box>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  className="signup-button"
                  disabled={emailError !== "" || passwordStrength.score < 3 || isLoading}
                >
                  Sign Up
                </Button>
                <Divider className="signup-divider">Or continue with</Divider>
                <Typography
                  variant="body2"
                  align="center"
                  className="login-link"
                >
                  Already have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="body2"
                    className="login-link-text"
                  >
                    Log in
                  </Link>
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  className="terms-text"
                >
                  By signing up, you agree to our{" "}
                  <Link href="/" className="terms-link">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/" className="terms-link">
                    Privacy Policy
                  </Link>
                  .
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Box>
      </Zoom>
    </Container>
  );
};

export default Signup;