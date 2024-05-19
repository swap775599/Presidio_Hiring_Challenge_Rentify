import React, { useEffect, useState } from 'react';
import API from '../config.api';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
  Container,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import Sidebar from './dashboard/SideBarClient';

const PropertyClient = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [likedProperties, setLikedProperties] = useState([]);
  const [interestedProperties, setInterestedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ country: '', state: '', city: '' });

  useEffect(() => {
    const token = localStorage.getItem('x-auth-token');
    if (!token) {
      navigate('/login');
    } else {
      fetchProperties(token);
      fetchLikedProperties(token);
      fetchInterestedProperties(token);
    }
  }, [navigate]);

  const fetchProperties = async (token) => {
    try {
      const response = await axios.get(`${API}/explore/getProperties`, {
        headers: { 'x-auth-token': token },
      });
      setProperties(response.data.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLikedProperties = async (token) => {
    try {
      const response = await axios.get(`${API}/explore/getLikedProperties`, {
        headers: { 'x-auth-token': token },
      });
      setLikedProperties(response.data.data.map((property) => property._id));
    } catch (error) {
      console.error('Error fetching liked properties:', error);
    }
  };

  const fetchInterestedProperties = async (token) => {
    try {
      const response = await axios.get(`${API}/explore/getInterestedProperties`, {
        headers: { 'x-auth-token': token },
      });
      setInterestedProperties(response.data.data.map((property) => property._id));
    } catch (error) {
      console.error('Error fetching interested properties:', error);
    }
  };

  const handleLike = async (propertyId) => {
    const token = localStorage.getItem('x-auth-token');
    try {
      await axios.post(`${API}/explore/likeProperty/${propertyId}`, {}, {
        headers: { 'x-auth-token': token },
      });
      fetchLikedProperties(token);
      fetchProperties(token); // Re-fetch properties to update like counts
    } catch (error) {
      console.error('Error liking property:', error);
    }
  };

  const handleUnlike = async (propertyId) => {
    const token = localStorage.getItem('x-auth-token');
    try {
      await axios.post(`${API}/explore/unlikeProperty/${propertyId}`, {}, {
        headers: { 'x-auth-token': token },
      });
      fetchLikedProperties(token);
      fetchProperties(token); // Re-fetch properties to update like counts
    } catch (error) {
      console.error('Error unliking property:', error);
    }
  };

  const handleInterested = async (propertyId) => {
    const token = localStorage.getItem('x-auth-token');
    try {
      await axios.post(`${API}/explore/imInterested/${propertyId}`, {}, {
        headers: { 'x-auth-token': token },
      });
      fetchInterestedProperties(token);
    } catch (error) {
      console.error('Error showing interest:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const filteredProperties = properties.filter((property) =>
    (!filters.country || property.address.country === filters.country) &&
    (!filters.state || property.address.state === filters.state) &&
    (!filters.city || property.address.city === filters.city)
  );

  return (
    <Box style={{ marginLeft: '-290px' }} sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: '240px' }}
      >
        {loading ? (
          <CircularProgress style={{marginLeft:"300px"}} />
        ) : (
          <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Country</InputLabel>
                <Select
                  value={filters.country}
                  onChange={handleFilterChange}
                  name="country"
                  label="Country"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {[...new Set(properties.map((p) => p.address.country))].map((country) => (
                    <MenuItem key={country} value={country}>{country}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>State</InputLabel>
                <Select
                  value={filters.state}
                  onChange={handleFilterChange}
                  name="state"
                  label="State"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {[...new Set(properties.map((p) => p.address.state))].map((state) => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>City</InputLabel>
                <Select
                  value={filters.city}
                  onChange={handleFilterChange}
                  name="city"
                  label="City"
                >
                  <MenuItem value=""><em>None</em></MenuItem>
                  {[...new Set(properties.map((p) => p.address.city))].map((city) => (
                    <MenuItem key={city} value={city}>{city}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Grid container spacing={3}>
              {filteredProperties.map((property) => (
                <Grid item key={property._id} xs={12} sm={6} md={4}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={property.images[0] || 'https://via.placeholder.com/150'}
                      alt={property.title}
                    />
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
                        <b>Bedrooms:</b> {property.bedrooms}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>Bathrooms:</b> {property.bathrooms}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>Square Feet:</b> {property.squareFeet} sq ft
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>Geo Location:</b> {property.geoLocation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>Availability :</b> {property.availabilityDate.split('T')[0]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>Likes:</b> {property.likes.length}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        {likedProperties.includes(property._id) ? (
                          <Button variant="contained" color="primary" onClick={() => handleUnlike(property._id)}>Unlike</Button>
                        ) : (
                          <Button variant="contained" color="primary" onClick={() => handleLike(property._id)}>Like</Button>
                        )}
                        {interestedProperties.includes(property._id) ? (
                          <Button variant="contained" color="secondary" disabled>Showed Interest</Button>
                        ) : (
                          <Button variant="contained" color="secondary" onClick={() => handleInterested(property._id)}>Give Interest</Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </Box>
    </Box>
  );
};

export default PropertyClient;
