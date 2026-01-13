const PartnerEvent = require('../models/PartnerEvent');
const PartnerStore = require('../models/PartnerStore');
const { fetchPartnerAnalyticsCount } = require('../services/partnerAnalytics.service');

module.exports = async function partnerAnalyticSyncCron() {
  console.log('🔁 Partner analytics sync cron started');

  try {
    //Get all unique shop domains
    const domains = await PartnerEvent.distinct('shop.myshopifyDomain');
    const validDomains = domains.filter(Boolean);

    if (!validDomains.length) {
      console.log('ℹ️ No domains found');
      return;
    }

    console.log(`🔄 Syncing analytics for ${validDomains.length} stores`);

    //Loop through ALL domains (existing + new)
    for (const domain of validDomains) {
      try {
        console.log(`➡️ Fetching analytics for ${domain}`);

        const apiResponse = await fetchPartnerAnalyticsCount(domain);

        if (!apiResponse?.result) {
          console.warn(`⚠️ Invalid response for ${domain}`);
          continue;
        }

        const {
          orders = 0,
          totalEdit = 0,
          upsellRevenue = 0,
          lifeTimeValue = 0,
          customerRevenue = 0,
        } = apiResponse.result;

        //Upsert = update if exists, insert if not
        await PartnerStore.updateOne(
          { myshopifyDomain: domain },
          {
            $set: {
              myshopifyDomain: domain,
              orders: Number(orders),
              totalEdit: Number(totalEdit),
              upsellRevenue: Number(upsellRevenue),
              lifeTimeValue: Number(lifeTimeValue),
              customerRevenue: Number(customerRevenue),
              lastSyncedAt: new Date(),
            },
          },
          { upsert: true }
        );

        console.log(`✅ Analytics updated for ${domain}`);

        //Rate-limit protection
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        console.error(
          'Failed syncing ${domain}:',
          err.response?.data || err.message
        );
      }
    }

    console.log('Partner analytics sync cron completed');
  } catch (err) {
    console.error('Partner analytics cron failed', err);
  }
};
