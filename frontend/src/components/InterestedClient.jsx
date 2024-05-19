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
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import Sidebar from './dashboard/SideBarClient'; // Adjust the import according to your file structure

const InterestedClient = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [owner, setOwner] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('x-auth-token');
        if (!token) {
            navigate('/login');
        } else {
            fetchInterestedProperties(token);
        }
    }, [navigate]);

    const fetchInterestedProperties = async (token) => {
        try {
            const response = await axios.get(`${API}/explore/getInterestedProperties`, {
                headers: { 'x-auth-token': token }
            });
            setProperties(response.data.data);
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewOwner = async (ownerEmail) => {
        const token = localStorage.getItem('x-auth-token');
        try {
            const response = await axios.get(`${API}/explore/getOwnerDetails/${ownerEmail}`, {
                headers: { 'x-auth-token': token }
            });
            setOwner(response.data.data);
            setOpen(true);
        } catch (error) {
            console.error('Error fetching owner details:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setOwner(null);
    };

    return (
        <Box style={{ marginLeft: "-290px" }} sx={{ display: 'flex' }}>
            <Sidebar />
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, ml: '240px' }}
            >
                {loading ? (
                    <CircularProgress style={{marginLeft:"300px"}}  />
                ) : (
                    <Container>
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
                                                <b>Geo Location:</b> {property.geoLocation}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <b>Availability :</b> {property.availabilityDate.split('T')[0]}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <b>Likes:</b> {property.likes.length}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleViewOwner(property.owner)}
                                                >
                                                    View Owner
                                                </Button>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                )}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Owner Details</DialogTitle>
                    <DialogContent>
                        {owner ? (
                            <>
                                <DialogContentText>
                                    <b>Name:</b> {owner.user_name}
                                </DialogContentText>
                                <DialogContentText>
                                    <b>Email:</b> {owner.user_email}
                                </DialogContentText>
                                <DialogContentText>
                                    <b>Phone:</b> {owner.user_mobile}
                                </DialogContentText>
                            </>
                        ) : (
                            <CircularProgress />
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
};

export default InterestedClient;
