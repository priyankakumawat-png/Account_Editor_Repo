const { callPartnerGraphql } = require('../config/shopify-partner');
const PartnerSubscriptionSale = require('../models/PartnerSubscriptionSale');

/**
 * GraphQL – App Subscription Sales
 * ✅ Using appId properly
 */
const APP_SUBSCRIPTION_SALES_QUERY = `
query AppSubscriptionSalesForApp($appId: ID!, $first: Int = 10, $after: String, $createdAtMin: DateTime, $createdAtMax: DateTime) {
  transactions(first: $first, after: $after, appId: $appId, createdAtMin: $createdAtMin, createdAtMax: $createdAtMax, types: [APP_SUBSCRIPTION_SALE]) {
    edges {
      cursor
      node {
        __typename
        ... on AppSubscriptionSale {
          id
          createdAt
          chargeId
          billingInterval
          grossAmount {
            amount
            currencyCode
          }
          netAmount {
            amount
            currencyCode
          }
          shopifyFee {
            amount
            currencyCode
          }
          app {
            id
            name
          }
          shop {
            id
            myshopifyDomain
            name
          }
        }
      }
    }
    pageInfo {
      hasNextPage
    }
  }
}
`;

/**
 * ✅ CRON FUNCTION
 */
async function runAppSubscriptionSalesCron({
  appId,
  createdAtMin,
  createdAtMax,
} = {}) {
  if (!appId) {
    throw new Error('appId required for subscription sales cron');
  }

  let after = null;
  let inserted = 0;
  let fetched = 0;

  console.log('🔄 Syncing partner subscription sales...');

  try {
    do {
      const data = await callPartnerGraphql(APP_SUBSCRIPTION_SALES_QUERY, {
        appId,
        first: 50,
        after,
        createdAtMin: createdAtMin || null,
        createdAtMax: createdAtMax || null,
      });

      const transactions = data.transactions;

      if (!transactions || !transactions.edges.length) break;

      console.log(`📦 Fetched ${transactions.edges.length} sales from Partner API`);

      for (const edge of transactions.edges) {
        fetched++;
        const sale = edge.node;

        const result = await PartnerSubscriptionSale.updateOne(
          { saleId: sale.id, appId: sale.app.id },
          {
            $setOnInsert: { createdAtDb: new Date() },
            $set: {
              saleId: sale.id,
              occurredAt: sale.createdAt,
              billingInterval: sale.billingInterval,
              chargeId: sale.chargeId,
              app: { appId: sale.app.id, name: sale.app.name },
              shop: { shopId: sale.shop.id, shopDomain: sale.shop.myshopifyDomain },
              grossAmount: { amount: sale.grossAmount.amount, currencyCode: sale.grossAmount.currencyCode },
              netAmount: { amount: sale.netAmount.amount, currencyCode: sale.netAmount.currencyCode },
              shopifyFee: { amount: sale.shopifyFee.amount, currencyCode: sale.shopifyFee.currencyCode },
              updatedAt: new Date(),
            },
          },
          { upsert: true }
        );

        if (result.upsertedCount === 1) inserted++;
      }

      after = transactions.pageInfo.hasNextPage
        ? transactions.edges[transactions.edges.length - 1].cursor
        : null;

    } while (after);

    console.log('✅ Partner subscription sales sync completed');
    console.log(`📊 Total fetched from API: ${fetched}`);
    console.log(`🆕 New records inserted: ${inserted}`);

    return { fetched, inserted };

  } catch (err) {
    console.error('❌ Subscription sales cron failed:', err.message);
    throw err;
  }
}

module.exports = runAppSubscriptionSalesCron;
