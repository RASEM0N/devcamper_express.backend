const mongoose = require('mongoose');


const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Pls add a title for the review'],
        maxlength: 100,
    },
    text: {
        type: String,
        required: [true, 'Pls add a some text']
    },
    rating: {
        type: Number,
        required: [true, 'Pls add a rating between 1 and 10'],
        min: 1,
        max: 10
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        /* Имя модели */
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        /* Имя модели */
        ref: 'User',
        required: true
    },
});


module.exports = mongoose.model('Review', ReviewSchema);
