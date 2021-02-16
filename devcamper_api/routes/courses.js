const express = require('express');
const {
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourse,
} = require('../controllers/courses');

const router = express.Router({ mergeParams: true });

// Router
router.route('/').get(getCourses).post(addCourse);
router.route('/:id').put(updateCourse).delete(deleteCourse).get(getCourse);

module.exports = router;
