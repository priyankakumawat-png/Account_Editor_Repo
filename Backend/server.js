
require('dotenv').config();
require('./cron/partnerSyncCron');
require('./cron/partnerDetailSyncCron');
require('./cron/appSubscriptionSaleCron');

const express = require('express');
const cors = require('cors');          // ✅ ADD
const connectDb = require('./config/db');
const path = require('path');

const partnerEventRoutes = require('./routes/partnerStores');
const partnerSyncRoutes = require('./routes/accounts-partner-sync');
const partnerDetailsRoutes = require('./routes/partnerDetails');
const customerJourneyRoutes  = require('./routes/customerJourney');
const superAdminRoutes = require('./routes/superAdmin');
const exportRoutes = require('./routes/export');

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
    app.use('/api/superadmin', superAdminRoutes);
    app.use('/api', exportRoutes);
    app.use('/csv', express.static(path.join(__dirname, 'public/csv')));


    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`🚀 Account Editor backend running on port ${port}`);
    });
    
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}
start();
