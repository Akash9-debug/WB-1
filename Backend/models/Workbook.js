const mongoose = require('mongoose');

const workbookSchema = new mongoose.Schema({
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
    subject: {
        type: String,
        required: [true, 'Please add a subject'],
        enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography']
    },
    grade: {
        type: String,
        required: [true, 'Please add a grade'],
        enum: ['6th', '7th', '8th', '9th', '10th', '11th', '12th']
    },
    numberOfPages: {
        type: Number,
        required: [true, 'Please add number of pages']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    stock: {
        type: Number,
        required: [true, 'Please add stock quantity'],
        min: 0
    },
    hasAnswerKey: {
        type: Boolean,
        default: false
    },
    practiceExercises: {
        type: String
    },
    academicYear: {
        type: String
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Workbook', workbookSchema); 