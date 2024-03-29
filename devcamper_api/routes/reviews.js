const express = require('express');
const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
} = require('../controllers/review');
const Review = require('../models/Review.js');

const {
    protect,
    authorize
} = require('../middleware/auth');
const advanceResults = require('../middleware/advanceResults.js');

const router = express.Router({
    mergeParams: true
});

router
    .route('/')
    .get(
        advanceResults(Review, {
            path: 'bootcamp',
            select: 'name description email',
        }),
        getReviews
    ).post(protect, authorize('user', 'admin'), addReview)

router
    .route('/:id')
    .get(getReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview)
module.exports = router;