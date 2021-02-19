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
const { protect } = require('../middleware/auth');

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
    .post(protect, addCourse);
router.route('/:id').put(protect, updateCourse).delete(protect, deleteCourse).get(getCourse);

module.exports = router;
