# VoIP Call API — Workflow Example

Initiates a **VoIP call** via FreJun's
[Call-to-VoIP API](https://frejun.com/docs/calling/voip/#initiating-voip-calls) —
the caller must already be logged in on a softphone (e.g. Softphone Web SDK,
FreJun Chrome Extension, or Dialer Widget). This API only triggers the call;
the softphone handles the actual audio session.

## Quick Start

```bash
npm install
npm run dev          # opens http://localhost:5173
```

Create a `.env` file with your OAuth credentials:

```
VITE_CLIENT_ID="<your-client-id>"
VITE_CLIENT_SECRET="<your-client-secret>"
```

> **Note:** API Key Authentication can also be used instead of OAuth
> ([docs](https://frejun.com/docs/#api-key-authentication)).

## What This Example Covers

### Authentication

- Uses `@frejun/oauth` to open a popup-based OAuth flow.
- Listens for `tokens` and `tokensRefreshed` events to keep the `access_token` current.
- Auth errors are logged to the on-screen console.

### Initiating a VoIP Call

| Field            | Required | Description                                        |
| ---------------- | -------- | -------------------------------------------------- |
| `email_id`       | Yes      | Email of the user making the call                  |
| `dstn_number`    | Yes      | Destination number in E.164 format (e.g. +91…)     |
| `candidate_name` | No       | Display name for the callee                        |
| `virtual_number` | No       | Virtual number to use as the caller ID             |

The example first resolves the user's `agent_id` via
`GET /integrations/user/?email=…`, then POSTs to
`POST /integrations/call-to-voip/` and logs the full API response.

### Call Lifecycle

After the call is initiated, the call status updates are delivered via
[webhooks](https://frejun.com/docs/webhooks/supported-events/#callstatus) —
not through this API. Configure a webhook endpoint to track call progress.

### Error Cases Demonstrated

- **OAuth failure** — logged and reflected in the UI.
- **Missing fields** — client-side validation prevents the API call without email and number.
- **User lookup failure** — HTTP error from the user endpoint is logged.
- **Call initiation failure** — the HTTP response body is logged.

## Tech Stack

- **Vite** — dev server + build
- **@frejun/oauth** — handles the OAuth popup flow and token refresh
- **FreJun REST API** — `GET /integrations/user/`, `POST /integrations/call-to-voip/`
