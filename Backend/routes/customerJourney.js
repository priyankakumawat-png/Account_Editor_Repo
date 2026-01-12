const express = require('express');
const router = express.Router();
const { getCustomerJourney } = require('../controllers/CustomerJourneyController');

router.get('/', getCustomerJourney); // <-- just '/' because you already mounted at /api/customer-journey

module.exports = router;
