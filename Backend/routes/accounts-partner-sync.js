const express = require('express');
const {
  syncFromPartner,
} = require('../controllers/partnerSyncController');

const router = express.Router();

/**
 * POST /partner/sync-from-partner
 */
router.post('/sync-from-partner', syncFromPartner);

module.exports = router;
