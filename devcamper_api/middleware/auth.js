const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponce = require('../utils/errorResponce');
const User = require('../models/User.js');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    const authorization = req.headers.authorization;

    if (
        authorization &&
        authorization.startsWith('Bearer') &&
        authorization.split(' ')[1] !== 'null'
    ) {
        console.log(authorization.split(' ')[1]);
        token = authorization.split(' ')[1];
    } else if (req.cookies.token) {
        /* */
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponce('Not authorization to access this route', 400));
    }
    try {
        // Verify token
        /* декодируем нашь токен,
         * который идет к нам с помощью СЕКРЕТНОГО слова
         * и наже доставем из него id*/
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorResponce(`Not authorization to access this route`, 401));
    }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponce(
                    `User role ${req.user.role} is not authorized to access this route`,
                    401
                )
            );
        }
        next();
    };
};
