const express = require('express');
const dotenv = require('dotenv');

// Router files
const bootcamps = require('./routes/bootcamps.js');

// Load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

// Middleware
/* промежуточное, при любых запросах выполняется.
 * Можно использоваться для проверки, аунтификации*/
const logger = (req, res, next) => {
    /* создает переменную hello, которую
     * мы можем потом использовать не только здесь.
     * Для всех маршрутов и т.д через req.hello*/
    req.hello = 'Hello World';
    console.log('Middleware ran');
    /* next говорит, что после выполнения этого
     * middleware мы перешли к следующему middleware */
    next();
};

app.use(logger);

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on -${process.env.NODE_ENV}- mode on port -${PORT}-`
    );
});
