const asyncHandler = require('../middleware/async.js');
const Bootcamp = require('../models/Bootcamps.js');
const geocoder = require('../utils/geocoder');
const ErrorResponce = require('../utils/errorResponce.js');

// @desc        Get all bootcamps
// @route       GET /api/v1/bootcamps
// @access      Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    // Copy qyery
    const reqQuery = { ...req.query };

    // Fileds to exclude
    const removeField = ['select', 'sort'];

    // Loop over removeFields and delete them from reqQuery
    /* Удаляем где есть одно из
     * значений массива removeFiled,
     * чтоб они не входили в запрос и не как не влияли
     * на результат, до нужного момента */
    removeField.forEach((param) => delete reqQuery[param]);

    // Create query string
    /* некоторые слова в Mongoose зарезирвированны
     * и чтобы коректно их использовать перед
     * ними надо добавить $*/
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

    // Finding resource
    let query = Bootcamp.find(JSON.parse(queryStr));

    // Select fields
    if (req.query.select) {
        /* если придет select=name,description,
         * то выведится у каждого "пользователя"
         * _id(по умолчанию), name, description.
         * Странно зачем в строку то делать это?
         * => name description*/
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort fields
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createAt');
    }

    // Executing query
    const bootcamp = await query;
    console.log(bootcamp);

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
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
        next(new ErrorResponce(`Bootcamp not found with id of ${req.params.id} `, 404));
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
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true.valueOf,
        runValidators: true,
    });

    if (!bootcamp) {
        next(new ErrorResponce(`Bootcamp not found with id of ${req.params.id} `, 404));
    }

    res.status(200).json({
        success: true,
        data: bootcamp,
    });
});

// @desc        Delete bootcamp
// @route       DELETE /api/v1/bootcamps/:id
// @access      Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findOneAndDelete(req.params.id);

    if (!bootcamp) {
        next(new ErrorResponce(`Bootcamp not found with id of ${req.params.id} `, 404));
    }

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

    //Cala raduis using radians
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
