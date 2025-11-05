
# Monday Formula → Text Server (Vercel-ready)

This repo provides serverless functions for Vercel under `/api/*`:
- `/api/subscribe`  – registers a webhook (change_column_value) on the selected columns
- `/api/unsubscribe`
- `/api/event`      – acknowledges webhook events
- `/api/execute`    – copies formula column text to a text column

## Deploy on Vercel (recommended)
1. Create a new project on https://vercel.com (Import this folder).
2. Add two Environment Variables in Vercel Project Settings:
   - `MONDAY_SIGNING_SECRET`  ← copy from your monday app (General settings)
   - `PUBLIC_BASE_URL`        ← the Vercel domain you get after first deploy, like `https://<your-project>.vercel.app`
3. Deploy.
4. Update your `app.json` manifest to point to:
   - subscribe: `${PUBLIC_BASE_URL}/api/subscribe`
   - unsubscribe: `${PUBLIC_BASE_URL}/api/unsubscribe`
   - event: `${PUBLIC_BASE_URL}/api/event`
   - execute: `${PUBLIC_BASE_URL}/api/execute`

## Render
If you prefer Render, create a Node web service and route the same endpoints.
You'll need to wrap these handlers with Express; or use Vercel for zero-config.

