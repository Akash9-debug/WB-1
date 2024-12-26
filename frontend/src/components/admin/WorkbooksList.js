import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Grid,
    InputAdornment,
    Tabs,
    Tab,
    FormControlLabel,
    Switch
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon
} from '@mui/icons-material';
import Chip from '@mui/material/Chip';

const WorkbooksList = () => {
    const [books, setBooks] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        image: null,
        type: 'workbook',
        subject: '',
        grade: '',
        numberOfPages: '',
        hasAnswerKey: false,
        practiceExercises: '',
        academicYear: ''
    });

    const categories = ['Engineering', 'Medical', 'Arts', 'Commerce', 'Others'];
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography'];
    const grades = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];

    useEffect(() => {
        fetchWorkbooks();
    }, []);

    useEffect(() => {
        if (selectedBook) {
            setFormData({
                title: selectedBook.title,
                author: selectedBook.author,
                description: selectedBook.description,
                category: selectedBook.category,
                price: selectedBook.price,
                stock: selectedBook.stock,
                image: selectedBook.image,
                type: 'workbook',
                subject: selectedBook.subject,
                grade: selectedBook.grade,
                numberOfPages: selectedBook.numberOfPages,
                hasAnswerKey: selectedBook.hasAnswerKey,
                practiceExercises: selectedBook.practiceExercises,
                academicYear: selectedBook.academicYear
            });
        } else {
            setFormData({
                title: '',
                author: '',
                description: '',
                category: '',
                price: '',
                stock: '',
                image: null,
                type: 'workbook',
                subject: '',
                grade: '',
                numberOfPages: '',
                hasAnswerKey: false,
                practiceExercises: '',
                academicYear: ''
            });
        }
    }, [selectedBook]);

    useEffect(() => {
        console.log('Books state updated:', books);
    }, [books]);

    const fetchWorkbooks = async () => {
        try {
            console.log('Fetching workbooks...');
            const response = await fetch('http://localhost:5000/api/workbooks', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            console.log('Workbooks response:', data);
            if (data.success) {
                setBooks(data.data);
            }
        } catch (error) {
            console.error('Error fetching workbooks:', error);
        }
    };

    const handleDeleteClick = (book) => {
        setSelectedBook(book);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/admin/books/${selectedBook._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                setBooks(books.filter(book => book._id !== selectedBook._id));
                setDeleteDialogOpen(false);
                setSelectedBook(null);
            }
        } catch (error) {
            console.error('Error deleting workbook:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const url = selectedBook 
                ? `http://localhost:5000/api/workbooks/${selectedBook._id}`
                : 'http://localhost:5000/api/workbooks';

            const method = selectedBook ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formDataToSend
            });

            if (response.ok) {
                fetchWorkbooks();
                setOpenDialog(false);
                setSelectedBook(null);
            }
        } catch (error) {
            console.error('Error saving workbook:', error);
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Workbooks Management</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setSelectedBook(null);
                        setOpenDialog(true);
                    }}
                >
                    Add New Workbook
                </Button>
            </Box>

            {/* Workbooks Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Subject</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>Pages</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Answer Key</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow key={book._id}>
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.subject}</TableCell>
                                <TableCell>{book.grade}</TableCell>
                                <TableCell>{book.numberOfPages}</TableCell>
                                <TableCell>₹{book.price}</TableCell>
                                <TableCell>{book.stock}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={book.hasAnswerKey ? "Yes" : "No"}
                                        color={book.hasAnswerKey ? "success" : "default"}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton 
                                        color="primary"
                                        onClick={() => {
                                            setSelectedBook(book);
                                            setOpenDialog(true);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton 
                                        color="error"
                                        onClick={() => handleDeleteClick(book)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete "{selectedBook?.title}"?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Add/Edit Workbook Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>{selectedBook ? 'Edit Workbook' : 'Add New Workbook'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                >
                                    {subjects.map((subject) => (
                                        <MenuItem key={subject} value={subject}>
                                            {subject}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Grade"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                    required
                                >
                                    {grades.map((grade) => (
                                        <MenuItem key={grade} value={grade}>
                                            {grade}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Number of Pages"
                                    name="numberOfPages"
                                    type="number"
                                    value={formData.numberOfPages}
                                    onChange={handleChange}
                                    required
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
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start">₹</InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Stock"
                                    name="stock"
                                    type="number"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.hasAnswerKey}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                hasAnswerKey: e.target.checked
                                            }))}
                                            name="hasAnswerKey"
                                        />
                                    }
                                    label="Includes Answer Key"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Academic Year"
                                    name="academicYear"
                                    value={formData.academicYear}
                                    onChange={handleChange}
                                    placeholder="e.g., 2023-24"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                    sx={{ height: '100%' }}
                                >
                                    {formData.image ? 'Change Image' : 'Upload Image'}
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedBook ? 'Update' : 'Add'} Workbook
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WorkbooksList; 