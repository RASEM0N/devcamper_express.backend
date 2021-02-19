const express = require('express');
const {
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourse,
} = require('../controllers/courses');
const advanceResults = require('../middleware/advanceResults.js');
const Courses = require('../models/Courses.js');

/* защита на какие-то действие с бд  */
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// Router
router
    .route('/')
    .get(
        advanceResults(Courses, {
            path: 'bootcamp',
            select: 'name description email',
        }),
        getCourses
    )
    .post(protect, authorize('publisher', 'admin'), addCourse);
router
    .route('/:id')
    .put(protect, authorize('publisher', 'admin'), updateCourse)
    .delete(protect, authorize('publisher', 'admin'), deleteCourse)
    .get(getCourse);

module.exports = router;
