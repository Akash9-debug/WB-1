const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    getWorkbooks,
    createWorkbook,
    updateWorkbook,
    deleteWorkbook
} = require('../controllers/workbookController');

router.route('/')
    .get(getWorkbooks)
    .post(protect, authorize('admin'), upload.single('image'), createWorkbook);

router.route('/:id')
    .put(protect, authorize('admin'), upload.single('image'), updateWorkbook)
    .delete(protect, authorize('admin'), deleteWorkbook);

module.exports = router; 