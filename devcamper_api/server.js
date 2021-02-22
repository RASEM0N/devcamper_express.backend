//#region IMPORT
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const ErrorHandler = require('./middleware/error.js');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
// Protect request
// https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html
const mongoSanitize = require('express-mongo-sanitize');
// Middleware
const morgan = require('morgan');
const logger = require('./middleware/logger.js');
// Router files
const bootcamps = require('./routes/bootcamps.js');
const courses = require('./routes/courses.js');
const auth = require('./routes/auth.js');
const users = require('./routes/users.js');
const reviews = require('./routes/reviews.js');
//#endregion *************************************

// Line
console.log(`----------------------------------------------------`.yellow);

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connected to database
connectDB();

const app = express();

// Body parser
/* Можем постить.
 * Принимаем json в качастве запроса
 * req.body */
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    // app.use(logger);
}

// File upload
app.use(fileupload());

// Sanitize data
app.use(mongoSanitize())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/auth/users', users);
app.use('/api/v1/reviews', reviews);

app.use(ErrorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server running on -${process.env.NODE_ENV}- mode on port -${PORT}-`.yellow.bold);
});

// Handle unhandle promise rejections
/* Отлавливает ошибки
 * В случае ошибки выводит сообщение,
 * а также закрывает сервер и обрывает процесс */
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});
