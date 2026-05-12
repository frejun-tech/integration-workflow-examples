# VoIP Web SDK — Workflow Example

Full **browser-based VoIP softphone** using FreJun's
[Softphone Web SDK](https://frejun.com/docs/calling/voip/#softphone-sdk-javascript) —
register a SIP user agent, make and receive calls, and control the call
(mute, hold, accept, end) entirely in the browser.

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

> **Note:** Prefix special characters in the client secret with a backslash
> (e.g. `abc$123` → `VITE_CLIENT_SECRET=abc\$123`).

## What This Example Covers

### Authentication

- Uses `@frejun/oauth` to open a popup-based OAuth flow.
- Captures the user's `email` from the `authCode` event.
- Listens for `tokens` and `tokensRefreshed` events; auto-starts the softphone once authenticated.
- Calls `softphone.updateAccessToken()` on token refresh to keep the session alive.

### Softphone Lifecycle

| Step | Action                                                                   |
| ---- | ------------------------------------------------------------------------ |
| 1    | `new Softphone()` — creates the softphone instance                       |
| 2    | `softphone.login()` — authenticates with the FreJun SIP infrastructure   |
| 3    | `softphone.start()` — registers the user agent and begins listening      |

### Event Listeners

| Callback                   | Handling                                                           |
| -------------------------- | ------------------------------------------------------------------ |
| `onConnectionStateChange`  | Updates status badge; enables/disables dial button; auto-reconnects on failure |
| `onCallCreated`            | Logs the call type (incoming/outgoing) and enables accept button for incoming calls |
| `onCallRinging`            | Updates status to "Ringing" and enables call control buttons       |
| `onCallHangup`             | Resets all UI controls and status back to "Registered"             |

### Call Controls

| Button  | Action                            |
| ------- | --------------------------------- |
| Dial    | `softphone.makeCall(number, virtualNumber)` — starts an outbound call |
| Accept  | `session.accept()` — answers an incoming call                         |
| End     | `session.end()` — terminates the active call                          |
| Mute    | `session.mute()` / `session.unmute()` — toggles microphone           |
| Hold    | `session.hold()` / `session.unhold()` — toggles call hold            |

### Error Cases Demonstrated

- **OAuth failure** — logged to the on-screen console.
- **Softphone login/start failure** — error message is logged.
- **Dial error** — caught and logged (e.g. invalid number, unregistered agent).
- **Call control errors** — accept/end/mute/hold failures are caught and logged.
- **Connection loss** — `attemptReconnection` flag triggers `softphone.reset()`.

## Tech Stack

- **Vite** — dev server + build
- **@frejun/oauth** — handles the OAuth popup flow and token refresh
- **@frejun/softphone-web-sdk** — SIP-based browser softphone (wraps sip.js)
