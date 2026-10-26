# FreJun Integration Workflow Examples

[![Docs](https://img.shields.io/badge/FreJun-Docs-0A66C2)](https://frejun.com/docs/) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)

Runnable examples showing how to add FreJun calling to your own platform.

## Examples

| Example | What it shows | Docs |
|---|---|---|
| [voip-dialer-widget](voip-dialer-widget) | Embed the Dialer Widget in an iframe and handle every postMessage event | [Dialer Widget](https://frejun.com/docs/calling/dialer-widget/) |
| [voip-web-sdk](voip-web-sdk) | Browser softphone: register, dial, accept, mute, hold, end | [Softphone SDK](https://frejun.com/docs/calling/voip/#softphone-sdk-javascript) |
| [voip-call-api](voip-call-api) | Trigger a VoIP call on a logged-in softphone via REST | [Call-to-VoIP API](https://frejun.com/docs/calling/voip/#initiating-voip-calls) |
| [network-calling](network-calling) | Two-legged phone call via the Create Call API | [Network Calling](https://frejun.com/docs/calling/network/) |

## Run any example

    cd <example>
    npm install
    npm run dev    # http://localhost:5173

Each example needs a `.env` with `VITE_CLIENT_ID` and `VITE_CLIENT_SECRET` (FreJun OAuth app). Authentication uses [@frejun/oauth](https://github.com/frejun-tech/frejun-oauth-sdk).
