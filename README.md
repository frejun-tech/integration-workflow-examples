# FreJun Integration Workflow Examples

[![Docs](https://img.shields.io/badge/FreJun-Docs-0A66C2)](https://frejun.com/docs/) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

Runnable examples showing how to add FreJun calling to your own platform.

## Examples

| Example | What it shows | Docs |
|---|---|---|
| [voip-dialer-widget](voip-dialer-widget) | Embed the Dialer Widget in an iframe and handle every postMessage event | [Dialer Widget](https://frejun.com/docs/dialer/calling/dialer-widget/) |
| [voip-web-sdk](voip-web-sdk) | Browser softphone: register, dial, accept, mute, hold, end | [Softphone Web SDK](https://www.npmjs.com/package/@frejun/softphone-web-sdk) |
| [voip-call-api](voip-call-api) | Trigger a VoIP call on a logged-in softphone via REST | [Call-to-VoIP API](https://frejun.com/docs/dialer/calling/voip/) |
| [network-calling](network-calling) | Two-legged phone call via the Create Call API | [Network Calling](https://frejun.com/docs/dialer/calling/network/) |

## SDKs used

| Package | Used in | Purpose |
|---|---|---|
| [@frejun/oauth](https://www.npmjs.com/package/@frejun/oauth) ([source](https://github.com/frejun-tech/frejun-oauth-sdk)) | All examples | Popup-based OAuth sign-in and automatic token refresh |
| [@frejun/softphone-web-sdk](https://www.npmjs.com/package/@frejun/softphone-web-sdk) | voip-web-sdk | SIP-based softphone that runs in the browser |

## Run any example

1. Go into the example folder and install dependencies:

   ```bash
   cd <example>
   npm install
   ```

2. Create a `.env` file with your FreJun OAuth app credentials:

   ```
   VITE_CLIENT_ID="<your-client-id>"
   VITE_CLIENT_SECRET="<your-client-secret>"
   ```

   `voip-dialer-widget` also reads an optional `VITE_DIALER_ORIGIN` (defaults to `https://dialer.frejun.com`).

3. Start the dev server:

   ```bash
   npm run dev    # http://localhost:5173
   ```

Each example's own README covers the events, API fields and error cases it demonstrates.
