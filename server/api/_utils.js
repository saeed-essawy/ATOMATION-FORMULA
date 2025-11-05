
const crypto = require("crypto");

function verifySignature(req, signingSecret) {
  try {
    const sig = req.headers["x-monday-signature"];
    const raw = JSON.stringify(req.body || {});
    const hmac = crypto.createHmac("sha256", signingSecret).update(raw).digest("base64");
    return sig && hmac === sig;
  } catch (e) {
    return false;
  }
}

async function gql(token, query, variables) {
  const resp = await fetch("https://api.monday.com/v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await resp.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data;
}

function getShortLivedToken(payload) {
  return payload?.shortLivedToken || payload?.integrationShortLivedToken || payload?.inputFields?.shortLivedToken;
}

module.exports = { verifySignature, gql, getShortLivedToken };
