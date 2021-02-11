const ErrorResponce = require('../utils/errorResponce');

const ErrorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    console.log(err.stack.red);

    // Mongoose bad ObjectID
    if (err.name === 'CastError') {
        const message = `Bootcamp not found with id of ${err.value} `;
        error = new ErrorResponce(message, 404);
    }

    res.status(error.statusCode || 500).json({
        success: true,
        error: error.message || 'Server Error',
    });
};

module.exports = ErrorHandler;
