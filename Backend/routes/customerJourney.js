const express = require('express');
const router = express.Router();
const { getCustomerJourney } = require('../controllers/CustomerJourneyController');
const { protect, onlySuperAdmin } = require('../middleware/auth');

// 🔐 Protected (token REQUIRED)
router.use(protect, onlySuperAdmin);
router.get('/:shopDomain', getCustomerJourney);

module.exports = router;
