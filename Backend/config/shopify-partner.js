const axios = require('axios');

async function callPartnerGraphql(query, variables = {}) {
  debugger;
  const orgId = process.env.SHOPIFY_PARTNER_ORG_ID;
  const token = process.env.SHOPIFY_PARTNER_ACCESS_TOKEN;

  if (!orgId || !token) {
    throw new Error('Partner credentials missing');
  }

  const url = `https://partners.shopify.com/${orgId}/api/2025-04/graphql.json`;

  const res = await axios.post(
    url,
    { query, variables },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
    }
  );

  if (res.data.errors) {
    console.error(res.data.errors);
    throw new Error('Partner API error');
  }

  return res.data.data;
}

module.exports = { callPartnerGraphql };
