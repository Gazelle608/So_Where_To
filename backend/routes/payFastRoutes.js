const express = require('express');
const router = express.Router();
const payfastController = require('../controllers/payFastController');

router.get('/pay', payfastController.createPayment);
router.post('/notify', payfastController.notify);
router.get('/success', payfastController.success);
router.get('/cancel', payfastController.cancel);

module.exports = router;