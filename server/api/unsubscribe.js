
module.exports = async (req, res) => {
  // Optional: delete webhook if you stored its ID. Returning ok=true is sufficient for many cases.
  return res.status(200).json({ ok: true });
};
