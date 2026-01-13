const PartnerStore = require('../models/PartnerStore');
const PartnerEvent = require('../models/PartnerEvent');

exports.getPartnerStoreDetails = async (req, res) => {
  try {
    const { shopDomain } = req.query;

    if (!shopDomain) {
      return res.status(400).json({
        error: 'shopDomain is required',
      });
    }

    const result = await PartnerStore.aggregate([
      {
        $match: {
          myshopifyDomain: shopDomain,
        },
      },

      // Join with PartnerEvent
      {
        $lookup: {
          from: 'partnerevents', //collection name (IMPORTANT)
          localField: 'myshopifyDomain',
          foreignField: 'shop.myshopifyDomain',
          as: 'events',
        },
      },

      //Latest event
      {
        $addFields: {
          latestEvent: {
            $arrayElemAt: [
              {
                $sortArray: {
                  input: '$events',
                  sortBy: { occurredAt: -1 },
                },
              },
              0,
            ],
          },
        },
      },

      //Status calculation
      {
        $addFields: {
          status: {
            $switch: {
              branches: [
                {
                  case: {
                    $eq: [
                      '$latestEvent.typename',
                      'SubscriptionChargeActivated',
                    ],
                  },
                  then: 'active',
                },
                {
                  case: {
                    $eq: [
                      '$latestEvent.typename',
                      'RelationshipInstalled',
                    ],
                  },
                  then: 'trial',
                },
                {
                  case: {
                    $in: [
                      '$latestEvent.typename',
                      [
                        'RelationshipUninstalled',
                        'AppUninstalled',
                      ],
                    ],
                  },
                  then: 'uninstall',
                },
              ],
              default: 'trial',
            },
          },
        },
      },

      //Cleanup response
      {
        $project: {
          _id: 0,
          shopJson: 1,
          status: 1,
          tags: 1,
          segments: 1,
          notes: 1,
          isBlock: 1,
          planName: 1,
          orders: 1,
          totalEdit: 1,
          upsellRevenue: 1,
          lifeTimeValue: 1,
          customerRevenue: 1,
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).json({
        error: 'Partner store not found',
      });
    }

    res.json({
      success: true,
      data: result[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to fetch partner store',
    });
  }
};

exports.updateTagsToStores = async (req, res) => {
  try {
    const {
      domains = [],
      tags,
      notes,
    } = req.body || {};

    //domains mandatory
    if (!Array.isArray(domains) || !domains.length) {
      return res.status(400).json({
        error: 'domains must be a non-empty array',
      });
    }

    //at least one of tags or notes required
    const hasValidTags = Array.isArray(tags) && tags.length;
    const hasNotes = typeof notes === 'string' && notes.trim();

    if (!hasValidTags && !hasNotes) {
      return res.status(400).json({
        error: 'Either tags or notes must be provided',
      });
    }

    //build update object dynamically
    const update = {};

    // add tags if provided
    if (hasValidTags) {
      update.$addToSet = {
        tags: { $each: tags },
      };
    }

    // add/update notes if provided
    if (hasNotes) {
      update.$set = {
        notes,
      };
    }

    const result = await PartnerStore.updateMany(
      { myshopifyDomain: { $in: domains } },
      update
    );

    res.json({
      success: true,
      message: 'Stores updated successfully',
      matchedStores: result.matchedCount,
      updatedStores: result.modifiedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to update stores',
    });
  }
};

exports.removeTagsFromStores = async (req, res) => {
  try {
    const { domains = [], isBlock } = req.body;

    if (!domains.length) {
      return res.status(400).json({
        error: 'domains must be a non-empty array',
      });
    }

    //Prepare update object conditionally
    const update = { $set: {} };

    if (typeof isBlock === 'boolean') {
      update.$set.isBlock = isBlock;
    } else {
      update.$set.tags = [];
    }

    const result = await PartnerStore.updateMany(
      { myshopifyDomain: { $in: domains } },
      update
    );

    res.json({
      success: true,
      message: 'Update applied successfully',
      matchedStores: result.matchedCount,
      updatedStores: result.modifiedCount,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update stores' });
  }
};

