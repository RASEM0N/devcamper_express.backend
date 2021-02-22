const asyncHandler = require('../middleware/async.js');
const Review = require('../models/Review.js');
const Bootcamp = require('../models/Bootcamps.js');
const ErrorResponce = require('../utils/errorResponce.js');

// @desc        Get reviews
// @route       GET /api/v1/reviews
// @route       GET /api/v1/bootcamps/:bootcampId/reviews
// @access      Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await Review.find({
            bootcamp: req.params.bootcampId,
        });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });
    }
    res.status(200).json(res.advancedResults);
});

// @desc        Get single review
// @route       GET /api/v1/reviews/:id
// @access      Public
exports.getReview = asyncHandler(async (req, res, next) => {
    
    const review = await (await Review.findById(req.params.id)).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if (!review){
        return next(new ErrorResponce(`No review found with the id of ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        data: review
    });
});