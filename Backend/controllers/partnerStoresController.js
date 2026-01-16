const PartnerEvent = require('../models/PartnerEvent');

exports.getPartnerStores = async (req, res) => {
  try {
    const {
      shopify_plan,
      status,   // active, trial, uninstall
      plan,     // Bronze, Silver, Gold
      minDays,  // number
      maxDays,
      sortBy,
      tags,
      tagsLogic //'and' (default) or 'or'
    } = req.query;

    const matchStage = {};

    //TAG ARRAY (lowercase + trim)
    const tagArray = tags
      ? tags.split(',').map(t => t.trim().toLowerCase())
      : [];

    //STATUS FILTER
    if (status) {
      matchStage.status = { $in: status.split(',') };
    }

    //PLAN FILTER
    if (plan) {
      matchStage.AEplan = { $in: plan.split(',') };
    }

    //DAYS FILTER
    if (minDays || maxDays) {
      matchStage.daysSinceInstall = {};
      if (minDays) matchStage.daysSinceInstall.$gte = Number(minDays);
      if (maxDays) matchStage.daysSinceInstall.$lte = Number(maxDays);
    }

    //SORT
    let sortStage = {};

    switch (sortBy) {
      case 'oldest':
        sortStage = { 'latestEvent.occurredAt': 1 };
        break;

      case 'newest':
        sortStage = { 'latestEvent.occurredAt': -1 };
        break;

      //EDITS SORTING
      case 'highest_edits':
        sortStage = { totalEdit: -1 };
        break;

      case 'lowest_edits':
        sortStage = { totalEdit: 1 };
        break;

      //REVENUE SORTING
      case 'higher_revenue':
        sortStage = { customerRevenue: -1 };
        break;

      case 'lower_revenue':
        sortStage = { customerRevenue: 1 };
        break;

      default:
        sortStage = { 'latestEvent.occurredAt': -1 };
    }


    const stores = await PartnerEvent.aggregate([
      //Latest event first
      { $sort: { occurredAt: -1 } },

      //One store = one latest event
      {
        $group: {
          _id: '$shop.shopId',
          latestEvent: { $first: '$$ROOT' },
        },
      },

      //Days since install
      {
        $addFields: {
          daysSinceInstall: {
            $dateDiff: {
              startDate: '$latestEvent.occurredAt',
              endDate: '$$NOW',
              unit: 'day',
            },
          },
        },
      },

      //First filter (status, plan, days)
      { $match: matchStage },

      //JOIN PartnerStore
      {
        $lookup: {
          from: 'partnerstores',
          localField: 'latestEvent.shop.myshopifyDomain',
          foreignField: 'myshopifyDomain',
          as: 'partnerStore',
        },
      },
      {
        $unwind: {
          path: '$partnerStore',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $addFields: {
          totalEdit: { $ifNull: ['$partnerStore.totalEdit', 0] },
          upsellRevenue: { $ifNull: ['$partnerStore.upsellRevenue', 0] },
          lifeTimeValue: { $ifNull: ['$partnerStore.lifeTimeValue', 0] },
          customerRevenue: { $ifNull: ['$partnerStore.customerRevenue', 0] },
        },
      },

      {
        $addFields: {
          status: {
            $cond: [
              { $eq: ['$partnerStore.isBlock', true] },
              'blocked', //highest priority
              {
                $switch: {
                  branches: [
                    {
                      case: { $eq: ['$latestEvent.typename', 'SubscriptionChargeActivated'] },
                      then: 'active',
                    },
                    {
                      case: { $eq: ['$latestEvent.typename', 'RelationshipInstalled'] },
                      then: 'trial',
                    },
                    {
                      case: {
                        $in: ['$latestEvent.typename', ['RelationshipUninstalled', 'AppUninstalled']],
                      },
                      then: 'uninstall',
                    },
                  ],
                  default: '$latestEvent.typename',
                },
              },
            ],
          },
        },
      },

      //NORMALIZE TAGS (case-insensitive)
      {
        $addFields: {
          normalizedTags: {
            $map: {
              input: { $ifNull: ['$partnerStore.tags', []] },
              as: 'tag',
              in: { $toLower: '$$tag' },
            },
          },
        },
      },

      //FINAL FILTERS (shopify plan + TAGS AND/OR LOGIC)
      {
        $match: {
          ...matchStage,
          ...(shopify_plan
            ? {
              'partnerStore.shopJson.plan_name': {
                $in: shopify_plan.split(','),
              },
            }
            : {}),
          ...(tagArray.length
            ? {
              $expr:
                (tagsLogic && tagsLogic.toLowerCase() === 'or')
                  ? {
                    //OR logic
                    $gt: [
                      {
                        $size: {
                          $setIntersection: [tagArray, '$normalizedTags'],
                        },
                      },
                      0,
                    ],
                  }
                  : {
                    //Default AND logic (existing)
                    $and: [
                      { $isArray: '$normalizedTags' },
                      { $eq: [{ $size: '$normalizedTags' }, tagArray.length] }, // exact length
                      { $setIsSubset: [tagArray, '$normalizedTags'] },           // all required tags
                    ],
                  },
            }
            : {}),
        },
      },

      // 8️⃣ SORT
      { $sort: sortStage },

      // 9️⃣ RESPONSE
      {
        $project: {
          _id: 0,
          storeName: '$latestEvent.shop.name',
          storeUrl: {
            $concat: ['https://', '$latestEvent.shop.myshopifyDomain'],
          },
          ownerName: '$partnerStore.shopJson.shop_owner',
          shopifyPlan: '$partnerStore.shopJson.plan_name',
          tags: '$partnerStore.tags',
          AEplan: '$latestEvent.charge.name',
          status: 1,
        },
      },
    ]);

    res.json({
      count: stores.length,
      data: stores,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};
