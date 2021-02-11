const Bootcamp = require('../models/Bootcamps.js');

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();

        res.status(200).json({
            success: true,
            data: bootcamps,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error,
        });
    }
};

// @desc        Show single bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.findById(req.params.id);

        if (!bootcamps) {
            return res.status(400).json({
                success: false,
                error: 'Data is null or undefined',
            });
        }

        res.status(200).json({
            success: true,
            data: bootcamps,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error,
        });
    }
};

// @desc        Create new bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
exports.createBootcamp = async (req, res, next) => {
    try {
        /* если req.body есть поля, которых
         * нет в схеме, то они не идут в базу */
        const bootcamp = await Bootcamp.create(req.body);

        res.status(201).json({
            success: true,
            message: bootcamp,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.name,
        });
    }
};

// @desc        Update singe bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `Update bootcamp ${req.params.id}`,
    });
};

// @desc        Delete bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: `Delete bootcamp ${req.params.id}`,
    });
};
