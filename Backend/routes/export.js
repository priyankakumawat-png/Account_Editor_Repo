const express = require('express');
const router = express.Router();
const { exportPartnerStoresCSV } = require('../controllers/exportStoresCSVController');

router.get('/partner-stores/export', exportPartnerStoresCSV);

module.exports = router;
