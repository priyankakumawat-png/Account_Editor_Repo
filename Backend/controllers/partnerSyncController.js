const { callPartnerGraphql } = require('../config/shopify-partner');
const PartnerEvent = require('../models/PartnerEvent');

/**
 * This query fetches ALL important events:
 * - RelationshipInstalled  (NEW STORE INSTALL)
 * - RelationshipUninstalled
 * - SubscriptionChargeActivated
 * - SubscriptionChargeCanceled
 */
const APP_ALL_EVENTS_QUERY = `
query AppAllEvents($appId: ID!, $first: Int!, $after: String) {
  app(id: $appId) {
    id
    events(first: $first, after: $after) {
      edges {
        cursor
        node {
          __typename
          occurredAt
          app {
            id
            name
          }
          shop {
            id
            name
            myshopifyDomain
          }

          ... on SubscriptionChargeActivated {
            charge {
              id
              name
              amount {
                amount
                currencyCode
              }
              billingOn
              test
            }
          }

          ... on SubscriptionChargeCanceled {
            charge {
              id
              name
              amount {
                amount
                currencyCode
              }
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

exports.syncFromPartner = async (req, res) => {
  const { appId } = req.body;

  if (!appId) {
    return res.status(400).json({ error: 'appId required' });
  }

  let after = null;
  let synced = 0;

  try {
    do {
      const data = await callPartnerGraphql(APP_ALL_EVENTS_QUERY, {
        appId,
        first: 50,
        after,
      });

      const events = data.app.events;

      for (const edge of events.edges) {
        const event = edge.node;

        if (!event.shop) continue;

        /**
         * IMPORTANT UPSERT
         * - New store install → INSERT
         * - Existing store event → INSERT new event (no duplicate)
         */
        await PartnerEvent.updateOne(
          {
            typename: event.__typename,
            occurredAt: event.occurredAt,
            'shop.shopId': event.shop.id,
            'charge.chargeId': event.charge?.id || null,
          },
          {
            $setOnInsert: {
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
            },
          },
          { upsert: true }
        );

        synced++;
      }

      after = events.pageInfo.hasNextPage
        ? events.edges[events.edges.length - 1]?.cursor
        : null;

    } while (after);

    res.json({
      success: true,
      synced,
      message: 'Partner events synced successfully',
    });

  } catch (err) {
    console.error('Partner sync error:', err);
    res.status(500).json({ error: 'Partner sync failed' });
  }
};
