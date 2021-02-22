const ErrorResponce = require('../utils/errorResponce');

const ErrorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    // console.log(err);
    console.log(error);

    // Mongoose bad ObjectID
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value} `;
        error = new ErrorResponce(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = `Diplicate filed value entered`;
        error = new ErrorResponce(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map((item) => item.message);
        error = new ErrorResponce(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: true,
        error: error.message || 'Server Error',
    });
};

module.exports = ErrorHandler;
