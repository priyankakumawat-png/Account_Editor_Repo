const axios = require('axios');

const PARTNER_API_URL =
  'https://account-editor-stage.fly.dev/api/info/partner';

const PARTNER_SECRET = '1|jBOcUR3v0oVGZiYPj0JA5ikkpHJ36jlWZFU7eWSz';

exports.fetchPartnerStoreInfo = async (shopDomain) => {
  const unicId = shopDomain + PARTNER_SECRET;
  const token = Buffer.from(unicId).toString('base64');

  const response = await axios.post(
    PARTNER_API_URL,
    { shop: shopDomain },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    }
  );

  return response.data;
};
