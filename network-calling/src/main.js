import { FrejunOAuth } from '@frejun/oauth';

// ── Config ────────────────────────────────────────────────────────────────
const CLIENT_ID     = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
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

// ── Step 2: Initiate network call ─────────────────────────────────────────
document.getElementById('btn-call').addEventListener('click', async () => {
  const userEmail       = document.getElementById('user-email').value.trim();
  const candidateNumber = document.getElementById('candidate-number').value.trim();
  const candidateName   = document.getElementById('candidate-name').value.trim();

  if (!userEmail || !candidateNumber) {
    log('Please fill in email and destination number.');
    return;
  }

  log('Initiating network call...');

  try {
    const res = await fetch(`${API_BASE}/integrations/create-call/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_email: userEmail,
        candidate_number: candidateNumber,
        ...(candidateName && { candidate_name: candidateName }),
      }),
    });

    const data = await res.json();
    log('Response:\n' + JSON.stringify(data, null, 2));
  } catch (err) {
    log('Call failed: ' + err.message);
  }
});
