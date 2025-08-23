const express = require('express');
const router = express.Router();
const googleController = require('../controllers/googleController');

// Route to handle Google Apps Script requests
router.post('/execute', googleController.executeScript);

module.exports = router;