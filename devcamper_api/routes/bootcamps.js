const express = require('express');
const router = express.Router();

//#region GET
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Show all bootcamps',
    });
});
router.get('/:id', (req, res) => {
    res.status(200).json({
        success: true,
        message: `Show bootcamp ${req.params.id}`,
    });
});
//#endregion

//#region POST
router.post('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Create new bootcamp',
    });
});
//#endregion

//#region PUT
/* ID-это то, что находится :id
 * и приходит в request.params.id*/
router.put('/:id', (req, res) => {
    res.status(200).json({
        success: true,
        message: `Update bootcamp ${req.params.id}`,
    });
});
//#endregion

//#region DELETE
router.delete('/:id', (req, res) => {
    res.status(200).json({
        success: true,
        message: `Delete bootcamp ${req.params.id}`,
    });
});
//#endregion

// exports
module.exports = router;
