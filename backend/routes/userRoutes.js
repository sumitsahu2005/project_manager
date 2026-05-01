const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/').get(protect, authorize('Admin'), getUsers);

module.exports = router;
