import React, { useState } from "react";
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
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../styles/Login.css";
import { verifyToken } from "../utils/api";

const Login = ({setIsAuthenticated}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const navigate = useNavigate();

  // Loading animation effect
  React.useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            return 0;
          }
          return prev + 2;
        });
      }, 400);
    } else {
      setLoadingProgress(0);
    }
    return () => clearInterval(timer);
  }, [isLoading]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = { email, password, rememberMe };

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", data.user.email);

        localStorage.setItem("token", data.token);

        const isValid = await verifyToken(data.token);

        if (isValid) {
          setIsAuthenticated(true);
          navigate("/dashboard");
        } else {
          localStorage.removeItem("token");
          alert("Invalid token. Please log in again.");
        }
        window.location.reload(); 
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed. Check your credentials.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container
      component="main"
      maxWidth={false}
      disableGutters
      className="login-container"
    >
      <Zoom in={true} timeout={500}>
        <Box className="login-box">
          <Fade in={true} timeout={800}>
            <Box>
              <Typography
                component="h1"
                variant="h4"
                className="login-title"
                sx={{ textAlign: "center" }}
              >
                Welcome Back
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                className="login-subtitle"
              >
                {isLoading
                  ? "Waking up the server..."
                  : "Enter your credentials to access your account"}
              </Typography>
              <Box
                component="form"
                noValidate
                className="login-form"
                onSubmit={handleSubmit}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  variant="outlined"
                  disabled={isLoading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          disabled={isLoading}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      value="remember"
                      color="primary"
                      disabled={isLoading}
                    />
                  }
                  label="Remember me"
                  className="remember-me"
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <Box position="relative">
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    className="login-button"
                    disabled={isLoading}
                    sx={{
                      height: "48px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {isLoading ? (
                      <>
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            height: "4px",
                            bgcolor: "rgba(255, 255, 255, 0.4)",
                            width: `${loadingProgress}%`,
                            transition: "width 0.4s linear",
                          }}
                        />
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CircularProgress size={20} color="inherit" />
                          Logging you in...
                        </Box>
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </Box>
                <Divider className="login-divider">Or continue with</Divider>
                <Typography
                  variant="body2"
                  align="center"
                  className="signup-link"
                >
                  Don't have an account?{" "}
                  <Link
                    component={RouterLink}
                    to="/signup"
                    variant="body2"
                    className="signup-link-text"
                    sx={{ pointerEvents: isLoading ? "none" : "auto" }}
                  >
                    Sign up
                  </Link>
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  className="forgot-password"
                >
                  <Link
                    component="button" // This makes it look like a link but act like a button
                    className="forgot-password-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/forgot");
                    }}
                    sx={{ pointerEvents: isLoading ? "none" : "auto" }}
                  >
                    Forgot your password?
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Fade>
        </Box>
      </Zoom>
    </Container>
  );
};

export default Login;
