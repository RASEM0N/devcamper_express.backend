const asyncHandler = require('../middleware/async.js');
const Courses = require('../models/Courses.js');
const Bootcamp = require('../models/Bootcamps.js');
const geocoder = require('../utils/geocoder');
const ErrorResponce = require('../utils/errorResponce.js');

// @desc        Get courses
// @route       GET /api/v1/courses
// @route       GET /api/v1/bootcamps/:bootcampId/courses
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const courses = await Courses.find({
            bootcamp: req.params.bootcampId,
        });

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    }
    res.status(200).json(res.advancedResults);
});

// @desc        Get single course
// @route       GET /api/v1/courses/:id
// @access      Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Courses.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description',
    });

    if (!course) {
        return next(new ErrorResponce(`Course not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: course,
    });
});

// @desc        Create new course
// @route       GET /api/v1/bootcamps/:bootcampId/courses
// @access      Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    /* :bootcampId это id bootcamp-а к которому будет привязан нашь курс*/
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    /* Проверяет его на наличие*/
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        /* Если нету то ошибка*/
        return next(new ErrorResponce(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponce(
                `The user with ID ${req.user.id} is not authorize to add a course to bootcamp ${bootcamp._id}`,
                401
            )
        );
    }

    /* Если есть то создает новый курс*/
    const course = await Courses.create(req.body);

    /* И выводит его */
    res.status(201).json({
        success: true,
        message: course,
    });
});

// @desc        Update singe course
// @route       PUT /api/v1/courses/:id
// @access      Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
    const course = await Courses.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponce(`Course not found with id of ${req.params.id}`, 404));
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponce(
                `The user with ID ${req.user.id} is not authorize to update a course${course._id}`,
                401
            )
        );
    }

    const updCours = await Courses.findByIdAndUpdate(req.params.id, req.body, {
        new: true.valueOf,
        runValidators: true,
    }).populate({
        path: 'bootcamp',
        select: 'name description',
    });
    res.status(200).json({
        success: true,
        data: updCours,
    });
});

// @desc        Delete course
// @route       DELETE /api/v1/courses/:id
// @access      Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Courses.findById(req.params.id);

    if (!course) {
        return next(new ErrorResponce(`Course not found with id of ${req.params.id}`, 404));
    }

    if (course.user.toString() !== req.user.id && req.user.role !== 'admin'){
        return next(
            new ErrorResponce(
                `The user with ID ${req.user.id} is not authorize to delete a course to bootcamp ${course._id}`,
                401
            )
        );
    }

    await course.remove();

    res.status(200).json({
        success: true,
        data: {},
    });
});
