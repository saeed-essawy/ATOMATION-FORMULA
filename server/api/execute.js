
const { verifySignature, gql, getShortLivedToken } = require("./_utils");

module.exports = async (req, res) => {
  try {
    const signing = process.env.MONDAY_SIGNING_SECRET || "";
    if (!verifySignature(req, signing)) {
      return res.status(401).json({ ok: false, error: "bad signature" });
    }
    const payload = req.body.payload || {};
    const token = getShortLivedToken(payload);
    const boardId = payload?.inputFields?.boardId || payload?.boardId || payload?.subscriptionData?.boardId;
    const itemId = payload?.inputFields?.itemId || payload?.itemId || payload?.subscriptionData?.itemId;
    const formulaCol = payload?.inputFields?.formula_col?.id || payload?.inputFields?.formula_col;
    const textCol = payload?.inputFields?.text_col?.id || payload?.inputFields?.text_col;

    // 1) read formula text
    const q = `query ($itemId:[Int!], $formulaCol:[String!]) {
      items(ids:$itemId){ id column_values(ids:$formulaCol){ id text } } }`;
    const rd = await gql(token, q, { itemId: [itemId], formulaCol: [formulaCol] });
    const formulaText = rd.items?.[0]?.column_values?.[0]?.text ?? "";

    // 2) write to text column
    const m = `mutation ($boardId:Int!, $itemId:Int!, $col:String!, $val:String!) {
      change_simple_column_value(board_id:$boardId, item_id:$itemId, column_id:$col, value:$val){ id } }`;
    await gql(token, m, { boardId, itemId, col: textCol, val: formulaText });

    return res.status(200).json({ ok: true, itemId, wrote: formulaText });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e) });
  }
};
