const PartnerEvent = require('../models/PartnerEvent');
const PartnerStore = require('../models/PartnerStore');

exports.getFirstChargeList = async (req, res) => {
  try {
    const { planname, sortBy, interval } = req.query;

    // 🔹 MAIN AGGREGATION FOR CHARGES
    const plans = await PartnerEvent.aggregate([
      {
        $match: {
          $or: [
            { "charge.name": { $exists: true } },
            { __typename: "RelationshipInstalled" }
          ],
          "shop.myshopifyDomain": { $exists: true }
        }
      },
      { $sort: { occurredAt: 1 } },
      {
        $group: {
          _id: "$shop.myshopifyDomain",
          planName: { $first: "$charge.name" },
          amount: { $first: "$charge.amount" },
          eventType: { $first: "$__typename" }
        }
      },
      {
        $group: {
          _id: { planName: "$planName", amount: "$amount" },
          merchants: { $sum: 1 },
          shops: { $push: "$_id" },
          events: { $push: "$eventType" }
        }
      },
      {
        $addFields: {
          MRR: { $multiply: ["$_id.amount", "$merchants"] }
        }
      },
      {
        $lookup: {
          from: "partnerstores",
          localField: "shops",
          foreignField: "myshopifyDomain",
          as: "storeData"
        }
      },
      {
        $addFields: {
          Interval: {
            $reduce: {
              input: "$storeData.interval",
              initialValue: [],
              in: {
                $cond: [
                  { $in: ["$$this", "$$value"] },
                  "$$value",
                  { $concatArrays: ["$$value", ["$$this"]] }
                ]
              }
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          Name: "$_id.planName",
          Price: "$_id.amount",
          Interval: 1,
          merchants: 1,
          MRR: 1,
          shops: 1,
          events: 1
        }
      },
      { $sort: { Name: 1 } }
    ]);

    // 🔹 Interval mapping
    const intervalMap = {
      EVERY_7_DAYS: "Weekly",
      EVERY_30_DAYS: "Monthly",
      EVERY_365_DAYS: "Yearly"
    };

    const plansWithFriendlyInterval = plans.map(plan => ({
      ...plan,
      Interval: plan.Interval.map(i => intervalMap[i] || i)
    }));

    let filteredPlans = plansWithFriendlyInterval;

    if (planname) {
      filteredPlans = filteredPlans.filter(
        p => p.Name?.toLowerCase() === planname.toLowerCase()
      );
    }

    if (interval) {
      const intervalArr = interval.split(',').map(i => i.trim().toLowerCase());
      filteredPlans = filteredPlans.filter(plan =>
        plan.Interval.some(i => intervalArr.includes(i.toLowerCase()))
      );
    }

    if (sortBy) {
      switch (sortBy) {
        case 'highest_mrr':
          filteredPlans.sort((a, b) => b.MRR - a.MRR);
          break;
        case 'lowest_mrr':
          filteredPlans.sort((a, b) => a.MRR - b.MRR);
          break;
        case 'most_merchants':
          filteredPlans.sort((a, b) => b.merchants - a.merchants);
          break;
      }
    }

    const totalPlans = filteredPlans.length;
    const totalMRR = filteredPlans.reduce((sum, p) => sum + (p.MRR || 0), 0);
    const totalMerchants = filteredPlans.reduce((sum, p) => sum + (p.merchants || 0), 0);
    const avgCLV = totalMerchants ? Math.round(totalMRR / totalMerchants) : 0;

    // 🔹 TRIALS
    const trialShops = await PartnerEvent.aggregate([
      { $match: { "shop.myshopifyDomain": { $exists: true }, occurredAt: { $exists: true } } },
      { $sort: { occurredAt: -1 } },
      {
        $group: {
          _id: "$shop.myshopifyDomain",
          eventName: { $first: "$typename" },
          charge: { $first: "$charge" }
        }
      },
      {
        $match: {
          eventName: "RelationshipInstalled",
          $or: [{ charge: { $exists: false } }, { charge: null }]
        }
      },
      { $count: "trialActiveShops" }
    ]);

    // 🔹 LAST ACTIVE
    let lastActive = 0;

    if (planname) {
      const lastActiveAgg = await PartnerEvent.aggregate([
        { $match: { "shop.myshopifyDomain": { $exists: true }, occurredAt: { $exists: true } } },
        { $sort: { occurredAt: -1 } },
        {
          $group: {
            _id: "$shop.myshopifyDomain",
            latestEvent: { $first: "$$ROOT" }
          }
        },
        {
          $match: {
            "latestEvent.typename": "SubscriptionChargeActivated",
            "latestEvent.charge.name": planname
          }
        },
        { $count: "lastActiveMerchants" }
      ]);

      lastActive = lastActiveAgg[0]?.lastActiveMerchants || 0;
    }

    // 🔹 PLAN HISTORY
    let planHistory = null;

    if (planname) {
      const historyAgg = await PartnerEvent.aggregate([
        { $match: { "charge.name": planname, occurredAt: { $exists: true } } },
        {
          $group: {
            _id: "$charge.name",
            createdOn: { $min: "$occurredAt" },
            lastModified: { $max: "$occurredAt" }
          }
        }
      ]);

      if (historyAgg.length) {
        planHistory = {
          createdOn: historyAgg[0].createdOn,
          lastModified: historyAgg[0].lastModified
        };
      }
    }

    // 🔹 EARNINGS
    let earnings = 0;
    if (planname && filteredPlans.length) {
      earnings = filteredPlans[0].MRR * 12;
    }

    // 🔹 ✅ TRIAL DAYS (from PartnerStore.useddays)
    let trialDays = 0;
    if (planname) {
      const store = await PartnerStore.findOne(
        { usedDays: { $exists: true } },
        { usedDays: 1 }
      ).lean();

      trialDays = store?.usedDays || 0;
    }

    // 🔹 RESPONSE
    res.json({
      summary: {
        totalPlans,
        totalMRR,
        avgCLV,
        earnings,
        trialDays, // 👈 NEW
        trials: trialShops[0]?.trialActiveShops || 0,
        lastActive
      },
      planHistory,
      plans: filteredPlans.map(({ shops, events, ...rest }) => rest)
    });

  } catch (err) {
    console.error('Plan-wise merchants error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
