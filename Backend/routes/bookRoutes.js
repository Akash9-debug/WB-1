const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
    updateStock,
    getBooksByCategory
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getBooks);
router.get('/:id', getBook);
router.get('/category/:category', getBooksByCategory);

// Admin only routes - temporarily remove upload.single('image')
router.post('/', protect, authorize('admin'), upload.single('image'), createBook);
router.put('/:id', protect, authorize('admin'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);
router.put('/:bookId/stock', protect, authorize('admin'), updateStock);

module.exports = router; 