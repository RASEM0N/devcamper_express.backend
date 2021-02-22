const express = require('express');
const {
    getReviews, getReview
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
    )
router.route('/:id').get(getReview)
module.exports = router;