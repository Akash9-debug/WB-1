const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    author: {
        type: String,
        required: [true, 'Please add an author'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Engineering', 'Medical', 'Arts', 'Commerce', 'Science']
    },
    stock: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        min: 0
    },
    year: {
        type: String,
        enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
        required: [true, 'Please specify the year']
    }
});

module.exports = mongoose.model('Book', bookSchema); 