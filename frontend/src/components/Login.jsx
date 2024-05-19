import React, { useState, useEffect } from 'react';
import API from '../config.api';

import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../asset/img/logo.png'; // Adjust the import according to your file structure

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_email: '',
    user_password: '',
  });
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkTokenAndRole = async () => {
      const token = localStorage.getItem('x-auth-token');
      if (token) {
        try {
          const response = await axios.get(`${API}/verify`, {
            headers: { 'x-auth-token': token }
          });
          if (response.status === 200) {
            if (response.data.role === 'seller') {
              navigate('/dashboardSeller');
            } else if (response.data.role === 'seeker') {
              navigate('/dashboard');
            } else {
              setError('Unknown user role');
            }
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          setError('Invalid token');
        }
      }
    };

    checkTokenAndRole();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'user_email') {
      validateEmail(value);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || !formData.user_email || !formData.user_password) {
      if (!formData.user_email) setEmailError('Email is required');
      if (!formData.user_password) setError('Password is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API}/login`, formData);
      if (response.data.token) {
        // Set x-auth-token in local storage
        localStorage.setItem('x-auth-token', response.data.token);

        // Check user role and redirect accordingly
        const verifyResponse = await axios.get(`${API}/verify`, {
          headers: { 'x-auth-token': response.data.token }
        });

        if (verifyResponse.status === 200) {
          if (verifyResponse.data.role === 'seller') {
            navigate('/dashboardSeller');
          } else if (verifyResponse.data.role === 'seeker') {
            navigate('/dashboard');
          } else {
            setError('Unknown user role');
          }
        }
      } else {
        setError('Login failed');
      }
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Container component="main" maxWidth="sm">
        <Paper style={{ padding: 20 }}>
          <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
            <img src={logo} alt="Logo" style={{ width: '150px', height: 'auto' }} />
          </Box>
          <Typography component="h1" variant="h5" align="center">
            User Login
          </Typography>
          <form noValidate onSubmit={handleSubmit} style={{ marginTop: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="user_email"
                  label="Email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  type="email"
                  error={!!emailError}
                  helperText={emailError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="user_password"
                  label="Password"
                  type="password"
                  id="user_password"
                  value={formData.user_password}
                  onChange={handleChange}
                  error={!formData.user_password && error === 'Password is required'}
                  helperText={!formData.user_password && error === 'Password is required' ? 'Password is required' : ''}
                />
              </Grid>
            </Grid>
            {loading ? (
              <CircularProgress style={{ marginTop: 20 }} />
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                style={{ marginTop: 20 }}
                disabled={!!emailError || !formData.user_email || !formData.user_password}
              >
                Login
              </Button>
            )}
            {error && (
              <Alert severity="error" style={{ marginTop: 20 }}>
                {error}
              </Alert>
            )}
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              style={{ marginTop: 20 }}
              onClick={() => navigate('/register')}
            >
              Are you a new user? Register here
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default LoginPage;
