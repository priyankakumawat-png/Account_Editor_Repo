const express = require('express');
const router = express.Router();

const {
  getPartnerStoreDetails,
  updateTagsToStores,
  removeTagsFromStores,
} = require('../controllers/partnerDetailsController');

// router.post('/sync', PartnerStoreDetails);
const { protect, onlySuperAdmin } = require('../middleware/auth');

// 🔐 Protected (token REQUIRED)
router.use(protect, onlySuperAdmin);
router.get('/details', getPartnerStoreDetails);

router.put('/add_tags', updateTagsToStores);
router.put('/remove_tags', removeTagsFromStores);

module.exports = router;
