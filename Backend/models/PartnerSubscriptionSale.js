const mongoose = require('mongoose');

const MoneySchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    currencyCode: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const PartnerSubscriptionSaleSchema = new mongoose.Schema(
  {
    /**
     * 🔑 Unique sale id (from Shopify Partner API)
     */
    saleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    /**
     * App info
     */
    app: {
      appId: {
        type: String,
        required: true,
        index: true,
      },
      name: String,
    },

    /**
     * Shop info
     */
    shop: {
      shopId: {
        type: String,
        required: true,
        index: true,
      },
    },

    /**
     * Sale details
     */
    occurredAt: {
      type: Date,
      required: true,
      index: true,
    },

    billingInterval: {
      type: String, // MONTHLY / ANNUAL
    },

    chargeId: {
      type: String,
      index: true,
    },

    /**
     * Amounts
     */
    grossAmount: MoneySchema,
    netAmount: MoneySchema,
    shopifyFee: MoneySchema,

    /**
     * Metadata
     */
    createdAtDb: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = mongoose.model(
  'PartnerSubscriptionSale',
  PartnerSubscriptionSaleSchema
);
