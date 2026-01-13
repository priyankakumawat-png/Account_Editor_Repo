const mongoose = require('mongoose');

const OnBoardingSchema = new mongoose.Schema(
  {
    status: Boolean,
    testOrder: {
      orderId: String,
      orderNumber: String,
      orderStatusUrl: String,
    },
  },
  { _id: false }
);

const PartnerStoreSchema = new mongoose.Schema(
  {
    myshopifyDomain: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    lifeTimeValue: { type: Number, default: 0 },
    upsellRevenue: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    totalEdit: { type: Number, default: 0 },
    customerRevenue: { type: Number, default: 0 },

    shopJson: Object,

    planName: String,
    planId: mongoose.Schema.Types.ObjectId,

    subscribeId: String,
    appUsageLineItemId: String,

    interval: String,
    chargeId: Number,
    amount: Number,

    isFreePlan: Boolean,
    isStarted: Boolean,
    planStatus: Boolean,
    isInstall: Boolean,
    isBlock: Boolean,

    hidingFeatures: [String],

    installationDate: Date,
    trialStartDate: Date,
    planStartDate: Date,
    planEndDate: Date,

    usedDays: Number,
    tags: {
      type: [String],
      index: true,
    },
    segments: {
      type: [String], // ['Gold users', 'High edit']
      index: true,
    },
    notes: String,

    onBoarding: OnBoardingSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model('PartnerStore', PartnerStoreSchema);
