# VoIP Dialer Widget — Workflow Example

Embeds FreJun's **Dialer Widget** as an `<iframe>` and demonstrates every
outbound and inbound `postMessage` event from the
[Dialer Widget API docs](https://frejun.com/docs/calling/dialer-widget/).

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

## What This Example Covers

### Outbound Messages (App → Dialer)

| Message           | Description                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| `authorize`       | Sends `access_token` + `user_email` after the dialer emits `ready`        |
| `initiate-call`   | Starts an outbound call with all optional params (name, virtual number, metadata) |
| `end-call`        | Terminates an ongoing browser-based call                                   |

### Inbound Messages (Dialer → App)

| Message          | Handling                                                                          |
| ---------------- | --------------------------------------------------------------------------------- |
| `ready`          | Marks dialer as loaded; auto-authorizes if a token is already available           |
| `unauthorized`   | Shows the error detail (e.g. expired token, missing params, inactive subscription)|
| `incoming-call`  | Makes the widget visible so the user can accept/reject                            |
| `close`          | Hides the widget (after saving call details or on validation error)               |
| `height-change`  | Dynamically resizes the widget wrapper to match the iframe content height         |
| `call-ended`     | Logs the event and disables the "End Call" button                                 |
| `end-call-error` | Logs the failure reason (e.g. no ongoing call, initiation in progress)            |

### Error Cases Demonstrated

- **OAuth failure** — logged and reflected in the auth status badge.
- **Unauthorized widget** — detail string from the dialer is shown (missing param, expired token, inactive subscription).
- **Call initiation failure** — widget sends `close` when the number is invalid, virtual number doesn't match, or the country code is unsupported.
- **End-call failure** — widget returns `end-call-error` if there's no ongoing call or the call is still being initiated.
- **Missing candidate number** — client-side validation prevents sending `initiate-call` without a number.

## Tech Stack

- **Vite** — dev server + build
- **@frejun/oauth** — handles the OAuth popup flow and token refresh
- **postMessage API** — all communication between the parent page and the dialer iframe
