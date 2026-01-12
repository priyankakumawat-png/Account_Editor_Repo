const express = require('express');
const {
  getPartnerStores,
} = require('../controllers/partnerStoresController');

const router = express.Router();

/**
 * GET /partnerevents/stores
 */
router.get('/stores', getPartnerStores);

module.exports = router;
