
require('dotenv').config();
require('./cron/partnerSyncCron');
require('./cron/partnerDetailSyncCron');

const express = require('express');
const cors = require('cors');          // ✅ ADD
const connectDb = require('./config/db');

const partnerEventRoutes = require('./routes/partnerStores');
const partnerSyncRoutes = require('./routes/accounts-partner-sync');
const partnerDetailsRoutes = require('./routes/partnerDetails');
const customerJourneyRoutes  = require('./routes/customerJourney');

async function start() {
  try {
    await connectDb();

    const app = express();
    app.use(cors());
    app.use(express.json());

    // Routes mount karo
    app.use('/partnerevents', partnerEventRoutes);
    app.use('/partner', partnerSyncRoutes);
    app.use('/api/partner-store', partnerDetailsRoutes);
    app.use('/api/customer-journey', customerJourneyRoutes);

    // const port = process.env.PORT || 4000;
    // app.listen(port, () => {
    //   console.log(`🚀 Account Editor backend running on port ${port}`);
    // });
    const port = process.env.PORT || 4000;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Account Editor backend running on port ${port}`);
});
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}
start();
