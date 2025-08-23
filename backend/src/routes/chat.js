const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route to send a message
router.post('/send', chatController.sendMessage);

// Route to receive messages
router.get('/receive/:conversationId', chatController.receiveMessages);

module.exports = router;