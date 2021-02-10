//#region IMPORT
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
// Middleware
const morgan = require('morgan');
// Router files
const bootcamps = require('./routes/bootcamps.js');
//#endregion *************************************

// Load env vars
dotenv.config({ path: './config/config.env' });

// Connected to database
connectDB();

const app = express();

// Dev loggin middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(
        `Server running on -${process.env.NODE_ENV}- mode on port -${PORT}-`
    );
});

// Handle unhandle promise rejections
/* Отлавливает ошибки
 * В случае ошибки выводит сообщение,
 * а также закрывает сервер и обрывает процесс */
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
