const asyncHandler = require('./async');

const advanceResults = (models, populate) =>
    asyncHandler(async (req, res, next) => {
        // Copy qyery
        const reqQuery = { ...req.query };

        // Fileds to exclude
        const removeField = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeField.forEach((param) => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

        // Finding resource
        let query = models.find(JSON.parse(queryStr));

        // Select fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 1;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await models.countDocuments();

        query = query.skip(startIndex).limit(limit);

        if (populate) {
            query = query.populate(populate);
        }

        // Executing query
        const results = await query;

        // Pagination result
        const pagination = {
            now: {
                page,
                startIndex,
            },
        };

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page > total ? total : page - 1,
                limit,
            };
        }

        /* Заготовленный ответ */
        res.advancedResults = {
            success: true,
            count: results.length,
            pagination,
            data: results,
        };

        /* чтоб продолжались след middlware если они есть конечно*/
        next();
    });

module.exports = advanceResults;
