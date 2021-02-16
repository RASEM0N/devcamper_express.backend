const mongoose = require('mongoose');

const CourseScheme = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Pls add a course title'],
        true: true,
        maxlength: [50, 'Title can not be more than 50 characters'],
    },
    description: {
        type: String,
        required: [true, 'Pls add a course title'],
        maxlength: [300, 'Description can not be more than 300 characters'],
    },
    weeks: {
        type: Number,
        required: [true, 'Pls add a number of weeks'],
        min: [1, 'weeks less than zero'],
    },
    tuition: {
        type: Number,
        required: [true, 'Pls add a tuition cost'],
        min: [0, 'tuition less than zero'],
    },
    minimumSkill: {
        type: String,
        required: [true, 'Pls add a minimul skill'],
        enum: ['beginner', 'intermediate', 'advanced'],
    },
    scholarhipsAvailable: {
        type: Boolean,
        default: false,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        /* Имя модели */
        ref: 'Bootcamp',
    },
});

module.exports = mongoose.model('Course', CourseScheme);
