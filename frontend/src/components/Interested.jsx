import React, { useEffect, useState } from 'react';
import API from '../config.api';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Container,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import Sidebar from './dashboard/SideBar'; // Adjust the import according to your file structure

const Interested = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [open, setOpen] = useState(false);
  // eslint-disable-next-line
  const [currentPropertyId, setCurrentPropertyId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('x-auth-token');
    if (!token) {
      navigate('/login');
    } else {
      fetchProperties(token);
    }
  }, [navigate]);

  const fetchProperties = async (token) => {
    try {
      const response = await axios.get(`${API}/property/getProperties`, {
        headers: { 'x-auth-token': token }
      });
      setProperties(response.data.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewInterested = async (propertyId) => {
    setCurrentPropertyId(propertyId);
    const token = localStorage.getItem('x-auth-token');
    try {
      const response = await axios.get(`${API}/property/getInterestedUsers/${propertyId}`, {
        headers: { 'x-auth-token': token }
      });
      setInterestedUsers(response.data.data);
      setOpen(true);
    } catch (error) {
      console.error('Error fetching interested users:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setInterestedUsers([]);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress style={{marginLeft:"300px"}}  />
      </Box>
    );
  }

  return (
    <Box style={{ marginLeft: "-290px" }} sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: '240px' }}
      >
        <Container>
          <Grid container spacing={3}>
            {properties.map((property) => (
              <Grid item key={property._id} xs={12} sm={6} md={4}>
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {property.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Description:</b> {property.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Address:</b> {property.address.street}, {property.address.city}, {property.address.state}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Price:</b> ${property.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Interested People:</b> {property.interested.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <b>Likes:</b> {property.likes.length}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Button variant="contained" color="primary" onClick={() => handleViewInterested(property._id)}>
                        View Interested
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Interested Users</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {interestedUsers.length > 0 ? (
                interestedUsers.map(user => (
                  <Box key={user._id} sx={{ mb: 2 }}>
                    <Typography variant="body1"><b>Name:</b> {user.user_name}</Typography>
                    <Typography variant="body1"><b>Email:</b> {user.user_email}</Typography>
                    <Typography variant="body1"><b>Phone:</b> {user.user_mobile}</Typography>
                  </Box>
                ))
              ) : (
                <Typography>No interested users found.</Typography>
              )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Interested;
