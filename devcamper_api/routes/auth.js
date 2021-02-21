const express = require('express');
const { register, login, getMe, forgotPassword, resetPasword, updateDetails, updatePassword} = require('../controllers/auth');

const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getMe);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').put(resetPasword);
router.route('/updatedetails').put(protect, updateDetails);
router.route('/updatepassword').put(protect, updatePassword);

module.exports = router;
