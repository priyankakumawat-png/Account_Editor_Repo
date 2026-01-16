const express = require('express');
const {
  getPartnerStores,
} = require('../controllers/partnerStoresController');
const {
  getFirstChargeList,
} = require('../controllers/plansController');
const router = express.Router();
const { protect, onlySuperAdmin } = require('../middleware/auth');

//Protected (token REQUIRED)
router.use(protect, onlySuperAdmin);

//GET /partnerevents/stores
router.get('/stores', getPartnerStores);
router.get('/get_plans', getFirstChargeList);

module.exports = router;
