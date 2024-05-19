import React, { useEffect, useState } from 'react';
import API from '../../config.api';

import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import Sidebar from './SideBarClient';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('x-auth-token');
    if (!token) {
      navigate('/login');
    } else {
      fetchDashboardData(token);
    }
  }, [navigate]);

  const fetchDashboardData = async (token) => {
    try {
      const response = await axios.get(`${API}/explore/dashboard`, {
        headers: { 'x-auth-token': token }
      });
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!dashboardData) {
    return <Typography variant="h6">Error loading dashboard data.</Typography>;
  }

  const { user, count_interest, count_like } = dashboardData;

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: '240px' }}
      >
        <Typography variant="h4" gutterBottom>
          Hello, {user.user_name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Interested Properties
              </Typography>
              <Typography variant="h6">
                {count_interest}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Liked Properties
              </Typography>
              <Typography variant="h6">
                {count_like}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
