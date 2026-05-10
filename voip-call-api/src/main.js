import { FrejunOAuth } from '@frejun/oauth';

// NOTE: API Key Authentication can also be used instead of OAuth (https://frejun.com/docs/#api-key-authentication).

// ── Config ────────────────────────────────────────────────────────────────
const CLIENT_ID     = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const API_BASE      = 'https://api.frejun.com/api/v1';

// ── State ─────────────────────────────────────────────────────────────────
let accessToken = null;

const log  = (msg) => (document.getElementById('log').textContent += msg + '\n');
const form = document.getElementById('call-form');

// ── Step 1: OAuth ─────────────────────────────────────────────────────────
const oauth = new FrejunOAuth({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });

oauth.on('tokens', (data) => {
  accessToken = data.access_token;
  log('✓ Authenticated');
  form.disabled = false;
});

oauth.on('tokensRefreshed', (data) => {
  accessToken = data.access_token;
  log('✓ Token refreshed');
});

oauth.on('error', (err) => log('Auth error: ' + err.message));

document.getElementById('btn-auth').addEventListener('click', () => oauth.openAuthPopup());

// ── Step 2: Initiate VoIP call via API ────────────────────────────────────
document.getElementById('btn-call').addEventListener('click', async () => {
  const emailId       = document.getElementById('email-id').value.trim();
  const dstnNumber    = document.getElementById('dstn-number').value.trim();
  const candidateName = document.getElementById('candidate-name').value.trim();
  const virtualNumber = document.getElementById('virtual-number').value.trim();

  if (!emailId || !dstnNumber) {
    log('Please fill in email ID and destination number.');
    return;
  }

  log('Initiating VoIP call...');

  try {
    const user_res = await fetch(`${API_BASE}/integrations/user/?email=${encodeURIComponent(emailId)}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (!user_res.ok) {
      throw new Error('Failed to retrieve user: ' + (await user_res.text()));
    }

    const user_data = await user_res.json();
    const agentId = user_data.data.user_id;

    log(`Retrieved user ID: ${agentId}`);

    const res = await fetch(`${API_BASE}/integrations/call-to-voip/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
        dstn_number: dstnNumber,
        ...(candidateName && { candidate_name: candidateName }),
        ...(virtualNumber && { virtual_number: virtualNumber }),
      }),
    });

    const data = await res.json();
    log('Response:\n' + JSON.stringify(data, null, 2));
    log("Handle the call life cycle events via call status webhook as described in the webhook documentation [https://frejun.com/docs/webhooks/supported-events/#callstatus].");
  } catch (err) {
    log('Call failed: ' + err.message);
  }
});
