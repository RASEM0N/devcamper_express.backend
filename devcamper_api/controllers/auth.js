const asyncHandler = require('../middleware/async.js');
const ErrorResponce = require('../utils/errorResponce.js');
const dotenv = require('dotenv');
const User = require('../models/User.js');

// @desc        Register user
// @route       POST /api/v1/auth/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    sendTokenResponce(user, 200, res);
});

// @desc        Login user
// @route       POST /api/v1/auth/login
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponce('Please provide an email and password', 400));
    }

    // Check for user
    /* В пользователя также добавляет пароль,
     * ибо он у нас по умолч выключен для отображения*/
    const user = await User.findOne({
        email,
    }).select('+password');

    if (!user) {
        return next(new ErrorResponce('Invalid credentials', 401));
    }

    // Check if passworf matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponce('Invalid credentials', 401));
    }

    sendTokenResponce(user, 200, res);
});

// @desc        Login user
// @route       POST /api/v1/auth/me
// @access      Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc        Forgot password
// @route       POST /api/v1/auth/forgotpassword
// @access      Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    });

    if (!user){
        return next(new ErrorResponce('There is no user with that email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken()

    /* токен и дата работы токена добавятся
     * я хз как ток */
    user.save({
        validateBeforeSave: false
    })

    res.status(200).json({
        success: true,
        data: user,
    });
});

// Get token from model, create cookie and send responce
const sendTokenResponce = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    options.secure = process.env.NODE_ENV === 'production' ? true : false;

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};