import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookAPI, cartAPI } from '../services/api';
import { useRealtime } from '../hooks/useRealtime';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Button,
    TextField,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Skeleton,
    Alert,
    Paper,
    InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, initializeCart } from '../redux/slices/cartSlice';
import { store } from '../redux/store';
import { toast } from 'react-hot-toast';

const Home = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const [year, setYear] = useState('');
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector(state => state.auth);

    const categories = ['All', 'Engineering', 'Medical', 'Arts', 'Commerce', 'Others'];
    const sortOptions = [
        { value: 'price_asc', label: 'Price: Low to High' },
        { value: 'price_desc', label: 'Price: High to Low' },
        { value: 'title_asc', label: 'Name: A to Z' },
        { value: 'title_desc', label: 'Name: Z to A' }
    ];
    const years = ['All Years', '1st Year', '2nd Year', '3rd Year', '4th Year'];

    const fetchBooks = useCallback(async () => {
        try {
            const response = await bookAPI.getAllBooks();
            if (response.data.success) {
                setBooks(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Use real-time updates
    useRealtime(fetchBooks);

    useEffect(() => {
        const fetchCartData = async () => {
            if (isAuthenticated) {
                try {
                    const response = await cartAPI.getCart();
                    if (response.data.success) {
                        dispatch(initializeCart(response.data.data));
                    }
                } catch (error) {
                    console.error('Error fetching cart:', error);
                }
            }
        };

        fetchBooks();
        fetchCartData();
    }, [isAuthenticated, dispatch]);

    const handleSortChange = (event) => {
        setSortOrder(event.target.value);
        const [field, order] = event.target.value.split('_');
        const sortedBooks = [...books].sort((a, b) => {
            if (order === 'asc') {
                return a[field] > b[field] ? 1 : -1;
            }
            return a[field] < b[field] ? 1 : -1;
        });
        setBooks(sortedBooks);
    };

    const filteredBooks = books.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
                            book.author.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = category === 'All' || category === '' || book.category === category;
        const matchesYear = year === 'All Years' || year === '' || book.year === year;
        
        return matchesSearch && matchesCategory && matchesYear;
    });

    const handleAddToCart = async (book) => {
        try {
            if (!isAuthenticated) {
                navigate('/login');
                return;
            }

            const response = await cartAPI.addToCart({
                bookId: book._id,
                quantity: 1
            });

            console.log('Add to cart response:', response.data);

            if (response.data.success) {
                // Update the entire cart state with the response data
                dispatch(initializeCart(response.data.data));
                toast.success('Book added to cart successfully');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error(error.response?.data?.message || 'Error adding book to cart');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ color: 'primary.main' }}>
                    University Bookstore
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Find and purchase your academic books easily
                </Typography>
            </Box>

            {/* Filter Section */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Search Field */}
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            label="Search books..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>

                    {/* Category Filter */}
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={category}
                                label="Category"
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Year Filter */}
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Year</InputLabel>
                            <Select
                                value={year}
                                label="Year"
                                onChange={(e) => setYear(e.target.value)}
                            >
                                {years.map((yr) => (
                                    <MenuItem key={yr} value={yr}>{yr}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Sort Order */}
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortOrder}
                                label="Sort By"
                                onChange={handleSortChange}
                            >
                                {sortOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Results count */}
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Showing {filteredBooks.length} results
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Books Grid */}
            <Grid container spacing={3}>
                {loading ? (
                    // Loading skeletons
                    [...Array(6)].map((_, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <Skeleton variant="rectangular" height={200} />
                                <CardContent>
                                    <Skeleton variant="text" height={32} />
                                    <Skeleton variant="text" />
                                    <Skeleton variant="text" width="60%" />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                        <Grid item xs={12} sm={6} md={4} key={book._id}>
                            <Card 
                                elevation={1}
                                sx={{ 
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 3
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={book.image || 'https://via.placeholder.com/200x300'}
                                    alt={book.title}
                                    sx={{ objectFit: 'contain', p: 2 }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {book.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        by {book.author}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Category: {book.category}
                                    </Typography>
                                    <Typography variant="h6" color="primary" gutterBottom>
                                        {book.price}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={() => handleAddToCart(book)}
                                        disabled={book.stock <= 0}
                                    >
                                        {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="h6" align="center" color="text.secondary">
                            No books found
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default Home; 