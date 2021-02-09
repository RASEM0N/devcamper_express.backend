const express = require('express');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// создаем нашm express
const app = express();

//#region Запросы
//#region GET
app.get('/api/v1/bootcamps', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Show all bootcamps',
    });
});
app.get('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({
        success: true,
        message: `Show bootcamp ${req.params.id}`,
    });
});
//#endregion

//#region POST
app.post('/api/v1/bootcamps', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Create new bootcamp',
    });
});
//#endregion

//#region PUT
/* ID-это то, что находится :id
 * и приходит в request.params.id*/
app.put('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({
        success: true,
        message: `Update bootcamp ${req.params.id}`,
    });
});
//#endregion

//#region DELETE
app.delete('/api/v1/bootcamps/:id', (req, res) => {
    res.status(200).json({
        success: true,
        message: `Delete bootcamp ${req.params.id}`,
    });
});
//#endregion

//#endregion Запросы

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(
        `Server running on -${process.env.NODE_ENV}- mode on port -${PORT}-`
    );
});
