const path = require('path');
const asyncHandler = require('../middleware/async.js');
const Bootcamp = require('../models/Bootcamps.js');
const geocoder = require('../utils/geocoder');
const ErrorResponce = require('../utils/errorResponce.js');

// @desc        Get bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc        Show single bootcamp
// @route       GET /api/v1/bootcamps/:id
// @access      Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id).populate({
        path: 'courses',
        select: 'title description tuition',
    });

    if (!bootcamp) {
        return next(new ErrorResponce(`Bootcamp not found with id of ${req.params.id} `, 404));
    }

    res.status(200).json({
        success: true,
        data: bootcamp,
    });
});

// @desc        Create new bootcamp
// @route       POST /api/v1/bootcamps
// @access      Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    // Add user to body
    req.body.user = req.user.id;

    // Check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(
            new ErrorResponce(
                `The user with ID ${req.user.id} has already published a bootcamp`,
                400
            )
        );
    }

    /* если req.body есть поля, которых
     * нет в схеме, то они не идут в базу */
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
        success: true,
        message: bootcamp,
    });
});

// @desc        Update singe bootcamp
// @route       PUT /api/v1/bootcamps/:id
// @access      Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponce(`Bootcamp not found with id of ${req.params.id} `, 404));
    }

    // Make sure user is bootcamp owner
    /* Если пользователь не владелец и не администратор*/
    if (bootcamp.user.toString() !== req.res.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponce(
                `The user with ID ${req.user.id} is not authorize to UPDATE this bootcamp`,
                401
            )
        );
    }
    
    bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true.valueOf,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: bootcamp,
    });
});

// @desc        Delete bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponce(`Bootcamp not found with id of ${req.params.id} `, 404));
    }

     // Make sure user is bootcamp owner
    /* Если пользователь не владелец и не администратор*/
    if (bootcamp.user.toString() !== req.res.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponce(
                `The user with ID ${req.user.id} is not authorize to DELETE this bootcamp`,
                401
            )
        );
    }
    

    /* Событие на каскадное удаление не запуститься без этого */
    await bootcamp.remove();

    res.status(200).json({
        success: true,
        data: {},
    });
});

// @desc        Get bootcamps within a radius
// @route       GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access      Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    // Get lat/lng fron decoder
    const loc = await geocoder.geocode(zipcode);
    const { latitude, longitude } = loc[0];

    // Calc raduis using radians
    // Divide dist by radius of Earth
    // Earth radius = 6.378 km / 3.963 mi
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [[longitude, latitude], radius],
            },
        },
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
});

// @desc        Upload photo for bootcamp
// @route       PUT /api/v1/bootcamps/:id/photo
// @access      Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        return next(new ErrorResponce(`Bootcamp not found with id of ${req.params.id} `, 404));
    }

     // Make sure user is bootcamp owner
    /* Если пользователь не владелец и не администратор*/
    if (bootcamp.user.toString() !== req.res.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponce(
                `The user with ID ${req.user.id} is not authorize to UPDATE a photo for bootcamp`,
                401
            )
        );
    }
    

    if (!req.files) {
        return next(new ErrorResponce(`Plz upload a file`, 400));
    }

    const file = req.files.file;

    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponce(`Plz upload an image file`, 400));
    }

    // Check filesize
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponce(`Plz upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400)
        );
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (error) => {
        if (error) {
            console.error(error);
            return next(new ErrorResponce(`Plz with file upload`, 500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, {
            photo: file.name,
        });

        res.status(200).json({
            success: true,
            data: file.name,
        });
    });
});
