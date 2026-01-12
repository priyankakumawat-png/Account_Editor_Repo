const PartnerEvent = require('../models/PartnerEvent');
const PartnerStore = require('../models/PartnerStore');
const { fetchPartnerStoreInfo } = require('../services/partnerDetails.service');

module.exports = async function partnerDetailSyncCron() {
  console.log('🔁 PartnerStore sync cron started');

  try {
    // your existing cron logic goes here exactly as is
    const domains = await PartnerEvent.distinct('shop.myshopifyDomain');
    const validDomains = domains.filter(Boolean);

    if (!validDomains.length) {
      console.log('ℹ️ No domains found');
      return;
    }

    const existingStores = await PartnerStore.find({
      myshopifyDomain: { $in: validDomains },
    }).select('myshopifyDomain');

    const existingSet = new Set(existingStores.map((s) => s.myshopifyDomain));
    const missingDomains = validDomains.filter((d) => !existingSet.has(d));

    console.log(`🆕 Found ${missingDomains.length} new domains to sync`);

    for (const domain of missingDomains) {
      try {
        console.log(`➡️ Fetching partner data for ${domain}`);
        const apiResponse = await fetchPartnerStoreInfo(domain);
        const result = apiResponse?.result || {};
        const shopJson = result?.shopJson;

        if (!shopJson || !shopJson.domain) {
          console.warn(`⚠️ No valid shopJson for ${domain}, skipping`);
          continue;
        }

        await PartnerStore.updateOne(
          { myshopifyDomain: shopJson.domain },
          {
            $set: {
              myshopifyDomain: shopJson.domain,
              shopJson,
              planName: result.planName,
              planId: result.planId,
              subscribeId: result.subscribeId,
              interval: result.interval,
              chargeId: result.chargeId,
              amount: result.amount,
              planStartDate: result.planStartDate,
              planEndDate: result.planEndDate,
              planStatus: result.planStatus,
              isInstall: result.isInstall,
              isBlock: result.isBlock,
              usedDays: result.usedDays,
              hidingFeatures: result.hidingFeatures || [],
              onBoarding: result.onBoarding,
              tags: result.tags || [],
              segments: result.segments || [],
              notes: result.notes,
            },
          },
          { upsert: true }
        );

        console.log(`✅ Saved partner store: ${shopJson.domain}`);
        await new Promise((r) => setTimeout(r, 500));
      } catch (err) {
        console.error(`❌ Failed for ${domain}`, err.response?.data || err.message);
      }
    }

    console.log('✅ PartnerStore sync cron completed');
  } catch (err) {
    console.error('🔥 PartnerStore cron failed', err);
  }
};
