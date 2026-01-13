const axios = require('axios');

const PARTNER_API_URL =
  'https://account-editor-stage.fly.dev/api/admin/analytics/dashboard-status';

const PARTNER_SECRET = '1|jBOcUR3v0oVGZiYPj0JA5ikkpHJ36jlWZFU7eWSz';

exports.fetchPartnerAnalyticsCount= async (shopDomain) => {
  const unicId = shopDomain + PARTNER_SECRET;
  const token = Buffer.from(unicId).toString('base64');

  const response = await axios.get(PARTNER_API_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        shop: shopDomain,  // include the shop header here
      },
    });

  return response.data;
};
