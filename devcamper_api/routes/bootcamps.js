// import
const express = require('express');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload,
} = require('../controllers/bootcamps.js');

// include other resource router
const courseRouter = require('./courses.js');

const router = express.Router();

// Re-route into other resource routerss
router.use('/:bootcampId/courses', courseRouter);

// router
router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
router.route('/:id/photo').put(bootcampPhotoUpload);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// exports
module.exports = router;
