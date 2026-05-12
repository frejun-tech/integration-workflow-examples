# Network Calling — Workflow Example

Initiates a **2-legged phone call** via FreJun's
[Create Call API](https://frejun.com/docs/calling/network/) —
FreJun calls the user first, then connects to the destination number.

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

### Making a Network Call

| Field              | Required | Description                                       |
| ------------------ | -------- | ------------------------------------------------- |
| `user_email`       | Yes      | The FreJun email of the caller                    |
| `candidate_number` | Yes      | Destination number in E.164 format (e.g. +91…)    |
| `candidate_name`   | No       | Display name for the callee                       |

The example POSTs to `POST /integrations/create-call/` and logs the full
API response.

### Error Cases Demonstrated

- **OAuth failure** — logged and reflected in the UI.
- **Missing fields** — client-side validation prevents the API call without email and number.
- **API error** — the HTTP response body is logged.

## Tech Stack

- **Vite** — dev server + build
- **@frejun/oauth** — handles the OAuth popup flow and token refresh
- **FreJun REST API** — `POST /integrations/create-call/`
