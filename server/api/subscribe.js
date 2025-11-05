
const { verifySignature, gql, getShortLivedToken } = require("./_utils");

module.exports = async (req, res) => {
  try {
    const signing = process.env.MONDAY_SIGNING_SECRET || "";
    if (!verifySignature(req, signing)) {
      return res.status(401).json({ ok: false, error: "bad signature" });
    }
    const payload = req.body.payload || {};
    const token = getShortLivedToken(payload);
    const boardId = payload.subscriptionData?.boardId;
    const watchCols = (payload.inputFields?.watch_cols || []).map(c => c.id);

    // Create webhook for change_column_value on selected columns (or all if none provided)
    const config = watchCols.length ? JSON.stringify({ columnIds: watchCols }) : "{}";
    const mutation = `mutation ($boardId:Int!, $url:String!, $event:String!, $config:JSON!) {
      create_webhook(board_id:$boardId, url:$url, event:$event, config:$config){ id }
    }`;
    const data = await gql(token, mutation, {
      boardId,
      url: process.env.PUBLIC_BASE_URL + "/api/event",
      event: "change_column_value",
      config
    });

    // Return success & store webhook id in remote storage if you have one (not required to return)
    return res.status(200).json({ ok: true, webhookId: data.create_webhook?.id });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e) });
  }
};
