const express = require('express');
const {
  syncFromPartner,
} = require('../controllers/partnerSyncController');

const router = express.Router();

router.post('/sync-from-partner', syncFromPartner);

module.exports = router;
