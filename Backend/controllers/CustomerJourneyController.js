const PartnerEvent = require('../models/PartnerEvent');
const PartnerStore = require('../models/PartnerStore');

exports.getCustomerJourney = async (req, res) => {
  // Read shopId from query param instead of path param
  const { shopId } = req.query; // now FE can call /api/customer-journey?shopId=...

  if (!shopId) {
    return res.status(400).json({ error: 'shopId is required' });
  }

  try {
    const journey = await PartnerEvent.aggregate([
      { $match: { 'shop.shopId': shopId } },

      // Sort by latest event first
      { $sort: { occurredAt: -1 } },

      // Join PartnerStore data
      {
        $lookup: {
          from: 'partnerstores',
          localField: 'shop.shopId',
          foreignField: 'shopId',
          as: 'partnerStore'
        }
      },

      { $unwind: { path: '$partnerStore', preserveNullAndEmptyArrays: true } },

      // Project only needed fields for FE
      {
        $project: {
          _id: 0,
          storeId: '$partnerStore.shopId',        // store-level unique ID
          latestEventId: '$_id',                  // event ID
          storeName: '$shop.name',
          storeUrl: { $concat: ['https://', '$shop.myshopifyDomain'] },
          ownerName: '$partnerStore.shopJson.name',
          shopifyPlan: '$partnerStore.shopJson.plan_name',
          AEplan: '$partnerStore.testOrder.planName',
          subscriptionStatus: '$partnerStore.testOrder.planStatus',
          trialStartDate: '$partnerStore.testOrder.planStartDate',
          trialEndDate: '$partnerStore.testOrder.planEndDate',
          charge: '$charge',
          notes: '$partnerStore.notes',
          tags: '$partnerStore.tags',
          lastEventAt: '$occurredAt',
        }
      },

      // Return only latest event per store
      { $limit: 1 }
    ]);

    if (!journey.length) {
      return res.status(404).json({ error: 'No data found for this store' });
    }

    res.json(journey[0]);
  } catch (err) {
    console.error('Customer Journey API error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
