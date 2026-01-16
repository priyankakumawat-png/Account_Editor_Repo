const { callPartnerGraphql } = require('../config/shopify-partner');
const PartnerEvent = require('../models/PartnerEvent');

/**
 * Fetch ALL partner app events
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
            apiKey
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
         * ✅ SMART UNIQUE FILTER
         * - Charge events → unique by chargeId
         * - Non-charge events → unique by occurredAt
         */
        const filter = {
          typename: event.__typename,
          'app.appId': event.app.id,
          'shop.shopId': event.shop.id,
        };

        if (event.charge?.id) {
          // charge based events
          filter['charge.chargeId'] = event.charge.id;
        } else {
          // non-charge events (install, uninstall, others)
          filter.occurredAt = event.occurredAt;
        }

        /**
         * ✅ UPSERT
         * - New event → INSERT
         * - Existing event → UPDATE
         */
        await PartnerEvent.updateOne(
          filter,
          {
            // 🆕 only on insert
            $setOnInsert: {
              createdAt: new Date(),
            },

            // 🔁 always update with latest data
            $set: {
              typename: event.__typename,
              occurredAt: event.occurredAt,
              updatedAt: new Date(),

              app: {
                appId: event.app.id,
                name: event.app.name,
                apiKey: event.app.apiKey,
              },

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
