// import
const express = require('express');
const dotenv = require('dotenv');
// Middleware
const morgan = require('morgan');
// Router files
const bootcamps = require('./routes/bootcamps.js');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Dev loggin middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on -${process.env.NODE_ENV}- mode on port -${PORT}-`
    );
});
