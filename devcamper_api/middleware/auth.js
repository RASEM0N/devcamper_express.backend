const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponce = require('../utils/errorResponce');
const User = require('../models/User.js');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        /* */
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponce('Not authorization to access this route', 400));
    }
    console.log(token);
    try {
        // Verify token
        /* декодируем нашь токен,
         * который идет к нам с помощью СЕКРЕТНОГО слова
         * и наже доставем из него id*/
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.id);
        console.log(req.user);
        next();
    } catch (error) {
        return next(new ErrorResponce(`Not authorization to access this route`, 401));
    }
});
