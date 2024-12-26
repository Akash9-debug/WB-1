import React, { useState } from 'react';
import {
    Paper,
    TextField,
    Button,
    Grid,
    Typography,
    MenuItem,
    Alert,
    Box,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import { bookAPI } from '../../services/api';

const AddBookForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        image: null,
        year: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const categories = ['Engineering', 'Medical', 'Arts', 'Commerce', 'Others'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'price' || name === 'stock') {
            setFormData(prev => ({
                ...prev,
                [name]: Number(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            console.log('Form Data before sending:', formData);

            if (!formData.title || !formData.author || !formData.description || 
                !formData.category || !formData.price || !formData.stock) {
                throw new Error('Please fill in all required fields');
            }

            const formDataToSend = new FormData();
            
            formDataToSend.append('title', formData.title);
            formDataToSend.append('author', formData.author);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('price', formData.price.toString());
            formDataToSend.append('stock', formData.stock.toString());
            
            if (formData.image) {
                formDataToSend.append('image', formData.image);
            }

            for (let pair of formDataToSend.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await bookAPI.createBook(formDataToSend);
            console.log('Response:', response);

            setSuccess(true);
            setFormData({
                title: '',
                author: '',
                description: '',
                category: '',
                price: '',
                stock: '',
                image: null,
                year: ''
            });
        } catch (error) {
            console.error('Error adding book:', error);
            setError(error.response?.data?.message || error.message || 'Failed to add book');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
                Add New Book
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    Book added successfully!
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            error={!formData.title}
                            helperText={!formData.title ? "Title is required" : ""}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            required
                            error={!formData.author}
                            helperText={!formData.author ? "Author is required" : ""}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            required
                            error={!formData.description}
                            helperText={!formData.description ? "Description is required" : ""}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            select
                            label="Category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            error={!formData.category}
                            helperText={!formData.category ? "Category is required" : ""}
                        >
                            {categories.map(category => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            error={!formData.price}
                            helperText={!formData.price ? "Price is required" : ""}
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Stock"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            required
                            error={!formData.stock}
                            helperText={!formData.stock ? "Stock is required" : ""}
                            InputProps={{ inputProps: { min: 0 } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Year</InputLabel>
                            <Select
                                name="year"
                                value={formData.year}
                                label="Year"
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="1st Year">1st Year</MenuItem>
                                <MenuItem value="2nd Year">2nd Year</MenuItem>
                                <MenuItem value="3rd Year">3rd Year</MenuItem>
                                <MenuItem value="4th Year">4th Year</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                            sx={{ height: '100%' }}
                        >
                            Upload Image
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Adding Book...' : 'Add Book'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default AddBookForm; 