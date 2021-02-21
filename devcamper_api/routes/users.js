const express = require('express');
const {
    getUsers,
    createUser,
    getUser,
    updateUser,
    deteleUser
} = require('../controllers/users');

const {
    protect,    // защита на авторизацию
    authorize   // защита на права
} = require('../middleware/auth');
const advanceResults = require('../middleware/advanceResults.js'); // пагинация и т.д.
const User = require('../models/User');

const router = express.Router({ mergeParams: true});

router.use(protect)
router.use(authorize('admin'))

router.route('/')
    .get(advanceResults(User), getUsers)
    .post(createUser);
router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deteleUser);

module.exports = router;