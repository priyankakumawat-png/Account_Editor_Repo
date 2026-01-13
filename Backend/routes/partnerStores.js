const express = require('express');
const {
  getPartnerStores,
} = require('../controllers/partnerStoresController');

const router = express.Router();
const { protect, onlySuperAdmin } = require('../middleware/auth');

//Protected (token REQUIRED)
router.use(protect, onlySuperAdmin);

//GET /partnerevents/stores
router.get('/stores', getPartnerStores);

module.exports = router;
