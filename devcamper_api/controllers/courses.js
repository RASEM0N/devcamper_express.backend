const asyncHandler = require('../middleware/async.js');
const Courses = require('../models/Courses.js');
const geocoder = require('../utils/geocoder');
const ErrorResponce = require('../utils/errorResponce.js');

// @desc        Get courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/:bootcampId/courses
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if (req.params.bootcampId) {
        query = Courses.find({
            bootcamp: req.params.bootcampId,
        });
    } else {
        query = Courses.find().populate({
            path: 'bootcamp',
            select: 'name description email',
        });
    }

    const total = await Courses.countDocuments();
    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        total,
        data: courses,
    });
});
