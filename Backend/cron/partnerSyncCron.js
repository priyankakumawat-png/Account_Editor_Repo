const cron = require('node-cron');
const axios = require('axios');

// import the partnerDetailSyncCron file
const partnerDetailSyncCron = require('./partnerDetailSyncCron');

cron.schedule('0 * * * *', async () => {
  try {
    console.log('⏳ Partner subscription sync started');

    await axios.post(
      'http://localhost:4000/partner/sync-from-partner',
      {
        appId: "gid://partners/App/228669423617"
      }
    );

    console.log('✅ Partner subscription sync completed');

    // ✅ trigger partnerDetailSyncCron logic after subscription
    // This will run your existing cron logic immediately
    if (typeof partnerDetailSyncCron === "function") {
      await partnerDetailSyncCron();
    } else {
      console.log('⚠️ partnerDetailSyncCron is not a callable function');
    }

  } catch (err) {
    console.error('❌ Partner subscription sync failed', err.message);
  }
});
