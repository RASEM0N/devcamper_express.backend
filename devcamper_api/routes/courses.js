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
    .post(addCourse);
router.route('/:id').put(updateCourse).delete(deleteCourse).get(getCourse);

module.exports = router;
