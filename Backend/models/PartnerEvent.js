const mongoose = require('mongoose');

const PartnerAppSchema = new mongoose.Schema(
  {
    appId: String,
    name: String,
    apiKey: String,
  },
  { _id: false }
);

const PartnerShopSchema = new mongoose.Schema(
  {
    shopId: String,
    name: String,
    myshopifyDomain: {
      type: String,
      index: true,
    },
  },
  { _id: false }
);

const PartnerChargeSchema = new mongoose.Schema(
  {
    chargeId: String,
    name: String,
    amount: Number,
    currencyCode: String,
    billingOn: Date,
    test: Boolean,
  },
  { _id: false }
);

const PartnerEventSchema = new mongoose.Schema(
  {
    typename: { type: String, required: true },
    occurredAt: { type: Date, required: true },

    app: { type: PartnerAppSchema, required: true },
    shop: { type: PartnerShopSchema, required: true },
    charge: { type: PartnerChargeSchema, default: null },
  },
  { timestamps: true }
);

//Prevent duplicate events
PartnerEventSchema.index(
  {
    typename: 1,
    occurredAt: 1,
    'shop.shopId': 1,
    'charge.chargeId': 1,
  },
  { unique: true, sparse: true }
);

module.exports = mongoose.model('PartnerEvent', PartnerEventSchema);
