const ErrorHandler = (err, req, res, next) => {
    // Log to console for dev
    console.log(err.stack.red);

    res.status(err.statusCode || 500).json({
        success: true,
        error: err.message || 'Server Error',
    });
};

module.exports = ErrorHandler;
