// const cron = require('node-cron');
// const axios = require('axios');

// // import the partnerDetailSyncCron file
// const partnerDetailSyncCron = require('./partnerDetailSyncCron');

// cron.schedule('0 * * * *', async () => {
//   try {
//     console.log('⏳ Partner subscription sync started');

//     await axios.post(
//       'http://localhost:4000/partner/sync-from-partner',
//       {
//         appId: "gid://partners/App/228669423617"
//       }
//     );

//     console.log('✅ Partner subscription sync completed');

//     // ✅ trigger partnerDetailSyncCron logic after subscription
//     // This will run your existing cron logic immediately
//     if (typeof partnerDetailSyncCron === "function") {
//       await partnerDetailSyncCron();
//     } else {
//       console.log('⚠️ partnerDetailSyncCron is not a callable function');
//     }

//   } catch (err) {
//     console.error('❌ Partner subscription sync failed', err.message);
//   }
// });
const cron = require('node-cron');
const axios = require('axios');

const partnerDetailSyncCron = require('./partnerDetailSyncCron');
const partnerAnalyticSyncCron = require('./partnerAnalyticSyncCron');
const runAppSubscriptionSalesCron = require('./appSubscriptionSaleCron');

cron.schedule('0 * * * *', async () => {
  console.log('Hourly partner cron started');

  try {
    //Partner subscription sync
    console.log('Syncing partner subscriptions');

    await axios.post(
      'http://localhost:4000/partner/sync-from-partner',
      {
        appId: 'gid://partners/App/228669423617',
      }
    );

    console.log('Partner subscription sync completed');

  console.log('Syncing partner subscription sales');
await runAppSubscriptionSalesCron({
  appId: 'gid://partners/App/228669423617',
});
console.log('Partner subscription sales sync completed');

    //Partner detail sync
    if (typeof partnerDetailSyncCron === 'function') {
      console.log('Syncing partner details');
      await partnerDetailSyncCron();
      console.log('Partner detail sync completed');
    }

    //Partner analytics sync (NEW STORES)
    if (typeof partnerAnalyticSyncCron === 'function') {
      console.log('Syncing partner analytics');
      await partnerAnalyticSyncCron();
      console.log('Partner analytics sync completed');
    }

    console.log('Hourly partner cron finished successfully');
  } catch (err) {
    console.error(
      'Hourly partner cron failed:',
      err.response?.data || err.message
    );
  }
});
