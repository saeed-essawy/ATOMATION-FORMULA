
const { verifySignature } = require("./_utils");

module.exports = async (req, res) => {
  const signing = process.env.MONDAY_SIGNING_SECRET || "";
  if (!verifySignature(req, signing)) {
    return res.status(401).json({ ok: false, error: "bad signature" });
  }
  // Acknowledge immediately; monday just needs 200 OK
  return res.status(200).json({ ok: true, challenge: req.body?.challenge || "ok" });
};
