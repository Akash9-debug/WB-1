import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    CircularProgress
} from '@mui/material';
import { bookAPI } from '../services/api';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await bookAPI.getWishlist();
                if (response.data.success) {
                    setWishlist(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching wishlist:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
        const intervalId = setInterval(fetchWishlist, 5000);

        return () => clearInterval(intervalId);
    }, []);

    const handleRemoveFromWishlist = async (bookId) => {
        try {
            const response = await bookAPI.removeFromWishlist(bookId);
            if (response.data.success) {
                setWishlist(prev => prev.filter(item => item._id !== bookId));
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>
                My Wishlist
            </Typography>

            {wishlist.length === 0 ? (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography>Your wishlist is empty</Typography>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {wishlist.map((book) => (
                        <Grid item xs={12} sm={6} md={4} key={book._id}>
                            <Card>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={book.coverImage}
                                    alt={book.title}
                                />
                                <CardContent>
                                    <Typography variant="h6" noWrap>
                                        {book.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        ₹{book.price}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button 
                                        size="small" 
                                        color="primary"
                                        onClick={() => handleRemoveFromWishlist(book._id)}
                                    >
                                        Remove
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default Wishlist; 