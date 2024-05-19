import React, { useState } from 'react';
import API from '../config.api';
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_password: '',
    user_mobile: '',
    user_gender: '',
    user_role: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.user_name) newErrors.user_name = 'Name is required';
    if (!formData.user_email) {
      newErrors.user_email = 'Email is required';
    } else if (!validateEmail(formData.user_email)) {
      newErrors.user_email = 'Invalid email format';
    }

    if (!formData.user_password) {
      newErrors.user_password = 'Password is required';
    } else if (!validatePassword(formData.user_password)) {
      newErrors.user_password = 'Password must be at least 8 characters long, include a letter, a number, and a special character';
    }

    if (!formData.user_mobile) {
      newErrors.user_mobile = 'Mobile number is required';
    } else if (!validateMobile(formData.user_mobile)) {
      newErrors.user_mobile = 'Mobile number must be 10 digits';
    }

    if (!formData.user_gender) newErrors.user_gender = 'Gender is required';
    if (!formData.user_role) newErrors.user_role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${API}/register`, formData);
      setMessage(response.data.message);
      setFormData({
        user_name: '',
        user_email: '',
        user_password: '',
        user_mobile: '',
        user_gender: '',
        user_role: '',
      });
      setErrors({});
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
          <Typography component="h1" variant="h5" align="center">
            User Registration
          </Typography>
          <form noValidate onSubmit={handleSubmit} style={{ marginTop: 20 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="user_name"
                  label="Name"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                  error={!!errors.user_name}
                  helperText={errors.user_name}
                />
              </Grid>
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
                  error={!!errors.user_email}
                  helperText={errors.user_email}
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
                  error={!!errors.user_password}
                  helperText={errors.user_password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="user_mobile"
                  label="Mobile Number"
                  id="user_mobile"
                  value={formData.user_mobile}
                  onChange={handleChange}
                  error={!!errors.user_mobile}
                  helperText={errors.user_mobile}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  select
                  name="user_gender"
                  label="Gender"
                  id="user_gender"
                  value={formData.user_gender}
                  onChange={handleChange}
                  error={!!errors.user_gender}
                  helperText={errors.user_gender}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  select
                  name="user_role"
                  label="Role"
                  id="user_role"
                  value={formData.user_role}
                  onChange={handleChange}
                  error={!!errors.user_role}
                  helperText={errors.user_role}
                >
                  <MenuItem value="seller">Seller</MenuItem>
                  <MenuItem value="seeker">Seeker</MenuItem>
                </TextField>
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
              >
                Register
              </Button>
            )}
            {message && (
              <Alert severity="success" style={{ marginTop: 20 }}>
                {message}
              </Alert>
            )}
            {error && (
              <Alert severity="error" style={{ marginTop: 20 }}>
                {error}
              </Alert>
            )}
            <Button
              component={Link}
              to="/login"
              fullWidth
              variant="outlined"
              color="secondary"
              style={{ marginTop: 20 }}
            >
              Already a user? Login
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default RegistrationPage;
