import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../../config.api';

import axios from 'axios';
import Sidebar from './SideBar';
// import './Dashboard.css'; // Import the CSS file for animations

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({ count_properties: 0, count_interest: 0 });

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
            const response = await axios.get(`${API}/property/dashboard`, {
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
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: '240px', position: 'relative' }}
            >
                {/* Background video */}
                <video autoPlay muted loop id="background-video">
                    <source src="/background.mp4" type="video/mp4" />
                    Your browser does not support HTML5 video.
                </video>
                
                <Container>
                    <Typography variant="h4" gutterBottom>
                        Hello, {dashboardData.user && dashboardData.user.user_name}!
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Card className="animated-card" sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Total Properties Posted
                                </Typography>
                                <Typography variant="h4">
                                    {dashboardData.count_properties}
                                </Typography>
                            </CardContent>
                        </Card>
                        <Card className="animated-card" sx={{ minWidth: 275 }}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Total People Interested
                                </Typography>
                                <Typography variant="h4">
                                    {dashboardData.count_interest}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default Dashboard;
