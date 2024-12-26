const Book = require('../models/Book');

// Get all books with search, filter, and sort
exports.getBooks = async (req, res, next) => {
    try {
        const { search, category, minPrice, maxPrice, sort, type } = req.query;
        let query = {};

        // Search by title or author
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Filter by type
        if (type) {
            query.type = type;
        }

        // Build query
        let queryStr = Book.find(query);

        // Sorting
        if (sort) {
            const sortOrder = sort.startsWith('-') ? -1 : 1;
            const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
            queryStr = queryStr.sort({ [sortField]: sortOrder });
        } else {
            queryStr = queryStr.sort('-createdAt');
        }

        // Execute query
        const books = await queryStr;

        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        next(error);
    }
};

// Get single book
exports.getBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }
        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
};

// Create book (Admin only)
exports.createBook = async (req, res, next) => {
    try {
        console.log('Received book data:', req.body);
        
        const bookData = {
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            category: req.body.category,
            price: Number(req.body.price),
            stock: Number(req.body.stock)
        };

        // Add image URL if file was uploaded
        if (req.file) {
            // Use forward slashes for URLs
            bookData.image = `/uploads/${req.file.filename}`;
        }

        console.log('Processed book data:', bookData);

        const book = await Book.create(bookData);
        
        res.status(201).json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error('Error creating book:', error);
        next(error);
    }
};

// Update book (Admin only)
exports.updateBook = async (req, res, next) => {
    try {
        let book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        const updateData = req.body;
        
        // Add new image URL if file was uploaded
        if (req.file) {
            updateData.image = req.file.path;
        }

        book = await Book.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
};

// Delete book (Admin only)
exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        await book.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Book deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Add stock management
exports.updateStock = async (req, res, next) => {
    try {
        const { bookId } = req.params;
        const { quantity } = req.body;

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        if (book.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        book.stock -= quantity;
        await book.save();

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
};

// Get books by category
exports.getBooksByCategory = async (req, res, next) => {
    try {
        const books = await Book.find({ category: req.params.category });
        res.status(200).json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        next(error);
    }
}; 