const express = require('express');
const router = express.Router();

const {
  getPartnerStoreDetails,
  updateTagsToStores,
  removeTagsFromStores,
} = require('../controllers/partnerDetailsController');

// router.post('/sync', PartnerStoreDetails);

router.get('/details', getPartnerStoreDetails);

router.put('/add_tags', updateTagsToStores);
router.put('/remove_tags', removeTagsFromStores);

module.exports = router;
