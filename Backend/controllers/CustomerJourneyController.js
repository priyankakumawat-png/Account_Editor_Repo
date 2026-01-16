const PartnerEvent = require('../models/PartnerEvent');

function buildTimeline(journey) {
  const timeline = [];

  if (journey.installed) {
    timeline.push({
      key: 'installed',
      title: 'Installed',
      description: 'Store installed Account Editor',
      date: journey.installed,
    });
  }

  if (journey.trialStarted) {
    timeline.push({
      key: 'trialStarted',
      title: 'Trial Started',
      description: '14-day free trial activated',
      date: journey.trialStarted,
    });
  }

  if (journey.trialEnded) {
    timeline.push({
      key: 'trialEnded',
      title: 'Trial Ended',
      description: journey.subscriptionStatus
        ? `Trial ended – Upgraded to ${journey.subscriptionStatus}`
        : 'Trial ended – Not subscribed',
      date: journey.trialEnded,
    });
  }

  if (journey.trialExtended) {
    timeline.push({
      key: 'trialExtended',
      title: 'Trial Extended',
      description: 'Trial extended',
      date: journey.trialExtended,
    });
  }

  if (journey.planUpgrade) {
    timeline.push({
      key: 'planUpgrade',
      title: 'Plan Upgrade',
      description: `Upgraded to ${journey.subscriptionStatus}`,
      date: journey.planUpgrade,
    });
  }

  if (journey.planDowngrade) {
    timeline.push({
      key: 'planDowngrade',
      title: 'Plan Downgrade',
      description: 'Plan downgraded',
      date: journey.planDowngrade,
    });
  }

  if (journey.firstUpsell) {
    timeline.push({
      key: 'firstUpsell',
      title: 'First Upsell',
      description: 'First upsell generated',
      date: journey.firstUpsell,
    });
  }

  if (journey.firstEdit) {
    timeline.push({
      key: 'firstEdit',
      title: 'First Edit',
      description: 'First edit performed',
      date: journey.firstEdit,
    });
  }

  if (journey.review) {
    timeline.push({
      key: 'review',
      title: 'Review',
      description: 'Review submitted',
      date: journey.review.date,
    });
  }

  if (journey.uninstall) {
    timeline.push({
      key: 'uninstall',
      title: 'Uninstalled',
      description: 'Merchant uninstalled app',
      date: journey.uninstall,
    });
  }

  if (journey.lastActive) {
    timeline.push({
      key: 'lastActive',
      title: 'Last Active',
      description: 'Last active',
      date: journey.lastActive,
    });
  }

  // Sort timeline by date
  return timeline.sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}

// GET Customer Journey API
exports.getCustomerJourney = async (req, res) => {
  try {
    const { shopDomain } = req.params;

    if (!shopDomain) {
      return res.status(400).json({ error: 'shopDomain is required' });
    }

    const events = await PartnerEvent.find({
      'shop.myshopifyDomain': shopDomain,
    }).sort({ occurredAt: 1 });

    if (!events.length) {
      return res.status(404).json({ error: 'No events found for this shop' });
    }

    const journey = {
      installed: null,
      trialStarted: null,
      trialEnded: null,
      trialExtended: null,
      subscriptionStatus: null,
      planUpgrade: null,
      planDowngrade: null,
      lastActive: null,
      uninstall: null,
      review: null,
      firstUpsell: null,
      firstEdit: null,
    };

    let lastPlan = null;

    for (const event of events) {
      const type = event.typename;
      const occurredAt = event.occurredAt;
      const charge = event.charge;

      // last active
      if (!journey.lastActive || occurredAt > journey.lastActive) {
        journey.lastActive = occurredAt;
      }

      switch (type) {
        case 'RelationshipInstalled':
          journey.installed = journey.installed || occurredAt;
          break;

        case 'SubscriptionChargeCreated':
          if (charge?.name?.toLowerCase().includes('trial')) {
            journey.trialStarted = journey.trialStarted || occurredAt;
          }
          break;

        case 'SubscriptionChargeActivated':
          journey.subscriptionStatus = charge?.name;

          if (lastPlan && lastPlan.name !== charge?.name) {
            if (charge.amount > lastPlan.amount) {
              journey.planUpgrade = occurredAt;
            } else {
              journey.planDowngrade = occurredAt;
            }
          }

          lastPlan = charge;
          break;

        case 'SubscriptionChargeCanceled':
          journey.trialEnded = occurredAt;
          break;

        case 'TrialExtended':
          journey.trialExtended = occurredAt;
          break;

        case 'RelationshipUninstalled':
          journey.uninstall = occurredAt;
          break;

        case 'ReviewSubmitted':
          journey.review = {
            date: occurredAt,
            rating: event.rating || null,
          };
          break;

        case 'UpsellCreated':
          journey.firstUpsell = journey.firstUpsell || occurredAt;
          break;

        case 'CustomerEdited':
          journey.firstEdit = journey.firstEdit || occurredAt;
          break;

        default:
          break;
      }
    }

    const timeline = buildTimeline(journey);

    return res.json({
      shop: shopDomain,
      timeline,
    });

  } catch (err) {
    console.error('Customer journey error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
