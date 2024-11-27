const express = require('express');
const router = express.Router();
const findPasswordController = require('../controllers/findPasswordController');

router.post('/', findPasswordController.findPassword);

module.exports = router;