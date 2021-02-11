const asyncHandler = require('../middleware/async.js');
const Bootcamp = require('../models/Bootcamps.js');
const ErrorResponce = require('../utils/errorResponce.js');

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.find();

    res.status(200).json({
        success: true,
        count: bootcamp.length,
        data: bootcamp,
    });
});

// @desc        Show single bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            next(
                new ErrorResponce(
                    `Bootcamp not found with id of ${req.params.id} `,
                    404
                )
            );
        }

        res.status(200).json({
            success: true,
            data: bootcamp,
        });
    } catch (error) {
        next(error);
    }
});

// @desc        Create new bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    try {
        /* если req.body есть поля, которых
         * нет в схеме, то они не идут в базу */
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            message: bootcamp,
        });
    } catch (error) {
        next(error);
    }
});

// @desc        Update singe bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true.valueOf,
                runValidators: true,
            }
        );

        if (!bootcamp) {
            next(
                new ErrorResponce(
                    `Bootcamp not found with id of ${req.params.id} `,
                    404
                )
            );
        }

        res.status(200).json({
            success: true,
            data: bootcamp,
        });
    } catch (error) {
        next(error);
    }
});

// @desc        Delete bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findOneAndDelete(req.params.id);

        if (!bootcamp) {
            next(
                new ErrorResponce(
                    `Bootcamp not found with id of ${req.params.id} `,
                    404
                )
            );
        }

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
});
