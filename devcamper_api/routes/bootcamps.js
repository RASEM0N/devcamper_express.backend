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
const advanceResults = require('../middleware/advanceResults.js');
const Bootcamps = require('../models/Bootcamps.js');

// include other resource router
const courseRouter = require('./courses.js');
const reviewsRouter = require('./review.js');

const router = express.Router();

/* защита на какие-то действие с бд  */
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routerss
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewsRouter);

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// router /* middleware для getBootcamps*/
router
    .route('/')
    .get(advanceResults(Bootcamps, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);
router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

// exports
module.exports = router;
