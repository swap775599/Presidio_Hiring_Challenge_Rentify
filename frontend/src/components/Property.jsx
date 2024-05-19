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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import Sidebar from './dashboard/SideBar';

const Property = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProperty, setEditProperty] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    },
    price: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    amenities: '',
    geoLocation: '',
    availabilityDate: ''
  });
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('x-auth-token');
    if (!token) {
      navigate('/login');
    } 
    else {
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

  const handleEdit = (property) => {
    setEditProperty(property);
    setOpenEdit(true);
  };

  const handleDelete = async (propertyId) => {
    const token = localStorage.getItem('x-auth-token');
    try {
      await axios.delete(`${API}/property/deleteProperty/${propertyId}`, {
        headers: { 'x-auth-token': token }
      });
      setProperties(properties.filter((property) => property._id !== propertyId));
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setEditProperty(null);
  };

  const handleEditSave = async () => {
    const token = localStorage.getItem('x-auth-token');
    try {
      await axios.put(`${API}/property/updateProperty/${editProperty._id}`, editProperty, {
        headers: { 'x-auth-token': token }
      });
      fetchProperties(token);
      handleEditClose();
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleAddClose = () => {
    setOpenAdd(false);
    setNewProperty({
      title: '',
      description: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      },
      price: '',
      bedrooms: '',
      bathrooms: '',
      squareFeet: '',
      amenities: '',
      geoLocation: '',
      availabilityDate: ''
    });
  };

  const handleAddSave = async () => {
    const token = localStorage.getItem('x-auth-token');
    try {
      await axios.post(`${API}/property/addProperty`, newProperty, {
        headers: { 'x-auth-token': token }
      });
      fetchProperties(token);
      handleAddClose();
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  const handleChange = (e, isEdit = true) => {
    const { name, value } = e.target;
    const updateProperty = isEdit ? editProperty : newProperty;
    const setProperty = isEdit ? setEditProperty : setNewProperty;

    if (name.includes('.')) {
      const [field, subfield] = name.split('.');
      updateProperty[field] = { ...updateProperty[field], [subfield]: value };
    } else {
      updateProperty[name] = value;
    }

    setProperty({ ...updateProperty });
  };

  return (
    <Box style={{marginLeft:"-290px"}} sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: '240px' }}
      >
        {loading ? (
          <CircularProgress style={{marginLeft:"300px"}}  />
        ) : (
          <Container>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button variant="contained" color="primary" onClick={() => setOpenAdd(true)}>Add Property</Button>
            </Box>
            <Grid container spacing={3}>
              {properties.map((property) => (
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
                        <b>Geo Location :</b> {property.geoLocation}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>Availability :</b> {property.availabilityDate.split('T')[0]}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <b>Likes:</b> {property.likes.length}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button variant="contained" color="primary" onClick={() => handleEdit(property)}>Edit</Button>
                        <Button variant="contained" color="secondary" onClick={() => handleDelete(property._id)}>Delete</Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
        <Dialog open={openEdit} onClose={handleEditClose}>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              name="title"
              value={editProperty?.title || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              name="description"
              value={editProperty?.description || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              margin="dense"
              label="Street"
              type="text"
              fullWidth
              name="address.street"
              value={editProperty?.address?.street || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              margin="dense"
              label="City"
              type="text"
              fullWidth
              name="address.city"
              value={editProperty?.address?.city || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              margin="dense"
              label="State"
              type="text"
              fullWidth
              name="address.state"
              value={editProperty?.address?.state || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              margin="dense"
              label="Postal Code"
              type="text"
              fullWidth
              name="address.postalCode"
              value={editProperty?.address?.postalCode || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              margin="dense"
              label="Country"
              type="text"
              fullWidth
              name="address.country"
              value={editProperty?.address?.country || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              name="price"
              value={editProperty?.price || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              margin="dense"
              label="Bedrooms"
              type="number"
              fullWidth
              name="bedrooms"
              value={editProperty?.bedrooms || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              margin="dense"
              label="Bathrooms"
              type="number"
              fullWidth
              name="bathrooms"
              value={editProperty?.bathrooms || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              margin="dense"
              label="Square Feet"
              type="number"
              fullWidth
              name="squareFeet"
              value={editProperty?.squareFeet || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              margin="dense"
              label="Amenities"
              type="text"
              fullWidth
              name="amenities"
              value={editProperty?.amenities || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              margin="dense"
              label="Geo Location"
              type="text"
              fullWidth
              name="geoLocation"
              value={editProperty?.geoLocation || ''}
              onChange={(e) => handleChange(e, true)}
            />
            <TextField
              margin="dense"
              label="Availability Date"
              type="date"
              fullWidth
              name="availabilityDate"
              value={editProperty?.availabilityDate ? editProperty.availabilityDate.split('T')[0] : ''}
              onChange={(e) => handleChange(e, true)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openAdd} onClose={handleAddClose}>
          <DialogTitle>Add Property</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              name="title"
              value={newProperty.title}
              onChange={(e) => handleChange(e, false)}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              fullWidth
              name="description"
              value={newProperty.description}
              onChange={(e) => handleChange(e, false)}
            />
            <TextField
              margin="dense"
              label="Street"
              type="text"
              fullWidth
              name="address.street"
              value={newProperty.address.street}
              onChange={(e) => handleChange(e, false)}
            />
            <TextField
              margin="dense"
              label="City"
              type="text"
              fullWidth
              name="address.city"
              value={newProperty.address.city}
              onChange={(e) => handleChange(e, false)}
            />
            <TextField
              margin="dense"
              label="State"
              type="text"
              fullWidth
              name="address.state"
              value={newProperty.address.state}
              onChange={(e) => handleChange(e, false)}
            />
            <TextField
              margin="dense"
              label="Postal Code"
              type="text"
              fullWidth
              name="address.postalCode"
              value={newProperty.address.postalCode}
              onChange={(e) => handleChange(e, false)}
            />
            <TextField
              margin="dense"
              label="Country"
              type="text"
              fullWidth
              name="address.country"
              value={newProperty.address.country}
              onChange={(e) => handleChange(e, false)}
            />
            <TextField
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              name="price"
              value={newProperty.price}
              onChange={(e) => handleChange(e, false)}
            />
            <TextField
              margin="dense"
              label="Bedrooms"
              type="number"
              fullWidth
              name="bedrooms"
              value={newProperty.bedrooms}
              onChange={(e) => handleChange(e, false)}
            />
            <TextField
              margin="dense"
              label="Bathrooms"
              type="number"
              fullWidth
              name="bathrooms"
              value={newProperty.bathrooms}
              onChange={(e) => handleChange(e, false)}
            />
            <TextField
              margin="dense"
              label="Square Feet"
              type="number"
              fullWidth
              name="squareFeet"
              value={newProperty.squareFeet}
              onChange={(e) => handleChange(e, false)}
            />
            <TextField
              margin="dense"
              label="Amenities"
              type="text"
              fullWidth
              name="amenities"
              value={newProperty.amenities}
              onChange={(e) => handleChange(e, false)}
            />
            <TextField
              margin="dense"
              label="Geo Location"
              type="text"
              fullWidth
              name="geoLocation"
              value={newProperty.geoLocation}
              onChange={(e) => handleChange(e, false)}
            />
            <TextField
              margin="dense"
              label="Availability Date"
              type="date"
              fullWidth
              name="availabilityDate"
              value={newProperty.availabilityDate}
              onChange={(e) => handleChange(e, false)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Property;
