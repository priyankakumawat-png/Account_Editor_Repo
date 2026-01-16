const PartnerEvent = require('../models/PartnerEvent');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

exports.exportPartnerStoresCSV = async (req, res) => {
  try {
    // 1️⃣ Get storeUrl query (single OR multiple)
    const { storeUrl } = req.query;

    // Normalize store URLs into array
    const storeUrls = storeUrl
      ? storeUrl
          .split(',')
          .map(url => url.trim().replace(/\/$/, ''))
      : [];

    // 2️⃣ Aggregation pipeline
    const pipeline = [
      { $sort: { occurredAt: -1 } },

      // Latest event per store
      {
        $group: {
          _id: '$shop.shopId',
          latestEvent: { $first: '$$ROOT' },
        },
      },

      // Join PartnerStore collection
      {
        $lookup: {
          from: 'partnerstores',
          localField: 'latestEvent.shop.myshopifyDomain',
          foreignField: 'myshopifyDomain',
          as: 'partnerStore',
        },
      },
      { $unwind: { path: '$partnerStore', preserveNullAndEmptyArrays: true } },

      // Compute status + storeUrl
      {
        $addFields: {
          status: {
            $cond: [
              { $eq: ['$partnerStore.isBlock', true] },
              'blocked',
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
                        $in: [
                          '$latestEvent.typename',
                          ['RelationshipUninstalled', 'AppUninstalled'],
                        ],
                      },
                      then: 'uninstall',
                    },
                  ],
                  default: '$latestEvent.typename',
                },
              },
            ],
          },
          storeUrl: {
            $concat: ['https://', '$latestEvent.shop.myshopifyDomain'],
          },
        },
      },

      // Project required fields
      {
        $project: {
          _id: 0,
          storeName: '$latestEvent.shop.name',
          storeUrl: 1,
          ownerName: '$partnerStore.shopJson.shop_owner',
          shopifyPlan: '$partnerStore.shopJson.plan_name',
          tags: {
            $reduce: {
              input: { $ifNull: ['$partnerStore.tags', []] },
              initialValue: '',
              in: {
                $concat: [
                  '$$value',
                  { $cond: [{ $eq: ['$$value', ''] }, '', ', '] },
                  '$$this',
                ],
              },
            },
          },
          AEplan: '$latestEvent.charge.name',
          status: 1,
        },
      },
    ];

    // 3️⃣ Filter by multiple store URLs (if provided)
    if (storeUrls.length) {
      pipeline.push({
        $match: {
          storeUrl: {
            $in: storeUrls.map(url => new RegExp(`^${url}$`, 'i')),
          },
        },
      });
    }

    // 4️⃣ Execute aggregation
    const stores = await PartnerEvent.aggregate(pipeline);

    // 5️⃣ CSV fields
    const fields = [
      { label: 'Store Name', value: 'storeName' },
      { label: 'Store URL', value: 'storeUrl' },
      { label: 'Owner Name', value: 'ownerName' },
      { label: 'Shopify Plan', value: 'shopifyPlan' },
      { label: 'Tags', value: 'tags' },
      { label: 'AE Plan', value: 'AEplan' },
      { label: 'Status', value: 'status' },
    ];

    // 6️⃣ Convert to CSV
    const parser = new Parser({ fields });
    const csv = parser.parse(stores);

    // 7️⃣ Save CSV to server
    const csvDir = path.join(__dirname, '../public/csv');
    if (!fs.existsSync(csvDir)) {
      fs.mkdirSync(csvDir, { recursive: true });
    }

    const fileName = `partner-stores-${Date.now()}.csv`;
    const filePath = path.join(csvDir, fileName);
    fs.writeFileSync(filePath, csv);

    // 8️⃣ Send CSV URL
    const fileUrl = `${req.protocol}://${req.get('host')}/csv/${fileName}`;
    return res.json({ csvUrl: fileUrl });
  } catch (err) {
    console.error('CSV Export Error:', err);
    res.status(500).json({ error: 'CSV export failed' });
  }
};
