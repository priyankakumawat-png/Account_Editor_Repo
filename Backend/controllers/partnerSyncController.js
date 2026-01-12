const { callPartnerGraphql } = require('../config/shopify-partner');
const PartnerEvent = require('../models/PartnerEvent');
const PartnerStore = require('../models/PartnerStore'); // Ensure this model exists

// --- Events Query ---
const APP_SUBSCRIPTION_EVENTS_QUERY = `
query AppSubscriptionEvents($appId: ID!, $first: Int!, $after: String) {
  app(id: $appId) {
    id
    events(first: $first, after: $after) {
      edges {
        cursor
        node {
          __typename
          occurredAt
          app { id name apiKey }
          shop { id name myshopifyDomain }

          ... on SubscriptionChargeActivated {
            charge {
              id
              name
              amount { amount currencyCode }
              billingOn
              test
            }
          }

          ... on SubscriptionChargeAccepted {
            charge {
              id
              name
              amount { amount currencyCode }
              billingOn
              test
            }
          }

          ... on SubscriptionChargeCanceled {
            charge {
              id
              name
              amount { amount currencyCode }
              billingOn
              test
            }
          }
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
}
`;

// --- Shops Query ---
const APP_SHOPS_QUERY = `
query AppShops($appId: ID!, $first: Int!, $after: String) {
  app(id: $appId) {
    shops(first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          name
          myshopifyDomain
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
}
`;

exports.syncFromPartner = async (req, res) => {
  const { appId } = req.body;
  if (!appId) {
    return res.status(400).json({ error: 'appId required' });
  }

  let eventsAfter = null;
  let storesAfter = null;
  let syncedEvents = 0;
  let syncedStores = 0;

  try {
    // ===== 1. Sync Events =====
    do {
      const data = await callPartnerGraphql(APP_SUBSCRIPTION_EVENTS_QUERY, { appId, first: 30, after: eventsAfter });
      const events = data.app.events;

      for (const edge of events.edges) {
        const event = edge.node;
        if (!event.shop) continue;

        // --- Upsert Event ---
        const eventFilter = {
          typename: event.__typename,
          occurredAt: event.occurredAt,
          'shop.shopId': event.shop.id,
          'charge.chargeId': event.charge?.id || null,
        };

        const eventData = {
          typename: event.__typename,
          occurredAt: event.occurredAt,
          app: event.app,
          shop: {
            shopId: event.shop.id,
            name: event.shop.name,
            myshopifyDomain: event.shop.myshopifyDomain,
          },
          charge: event.charge
            ? {
                chargeId: event.charge.id,
                name: event.charge.name,
                amount: event.charge.amount.amount,
                currencyCode: event.charge.amount.currencyCode,
                billingOn: event.charge.billingOn,
                test: event.charge.test,
              }
            : null,
        };

        await PartnerEvent.updateOne(eventFilter, { $set: eventData }, { upsert: true });
        syncedEvents++;

        // --- Upsert Store from event (ensure store exists) ---
        const storeFilter = { shopId: event.shop.id };
        const storeData = {
          shopId: event.shop.id,
          name: event.shop.name,
          myshopifyDomain: event.shop.myshopifyDomain,
          lastSyncedAt: new Date(),
        };

        await PartnerStore.updateOne(storeFilter, { $set: storeData }, { upsert: true });
        syncedStores++;
      }

      eventsAfter = events.pageInfo.hasNextPage
        ? events.edges[events.edges.length - 1]?.cursor
        : null;
    } while (eventsAfter);

    // ===== 2. Sync All Installed Stores =====
    do {
      const data = await callPartnerGraphql(APP_SHOPS_QUERY, { appId, first: 30, after: storesAfter });
      const shops = data.app.shops;

      for (const edge of shops.edges) {
        const shop = edge.node;
        const storeFilter = { shopId: shop.id };
        const storeData = {
          shopId: shop.id,
          name: shop.name,
          myshopifyDomain: shop.myshopifyDomain,
          lastSyncedAt: new Date(),
        };

        await PartnerStore.updateOne(storeFilter, { $set: storeData }, { upsert: true });
        syncedStores++;
      }

      storesAfter = shops.pageInfo.hasNextPage
        ? shops.edges[shops.edges.length - 1]?.cursor
        : null;
    } while (storesAfter);

    res.json({ syncedEvents, syncedStores });
  } catch (err) {
    console.error('❌ Partner sync error:', err);
    res.status(500).json({ error: 'Partner sync failed' });
  }
};
