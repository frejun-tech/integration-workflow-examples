import { FrejunOAuth } from '@frejun/oauth';
import { Softphone } from '@frejun/softphone-web-sdk';

// ── Config ────────────────────────────────────────────────────────────────
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

// NOTE: In .env, make sure you are prefixing special characters in client secret with a backslash, e.g. if your secret is `abc$123`, set it as `CLIENT_SECRET=abc\$123`

// ── State ─────────────────────────────────────────────────────────────────
let accessToken = null;
let softphone   = null;
let isMuted     = false;
let isOnHold    = false;

const log       = (msg) => { const el = document.getElementById('log'); el.textContent += msg + '\n'; el.scrollTop = el.scrollHeight; };
const setStatus = (text, cls) => { const el = document.getElementById('status'); el.textContent = text; el.className = 'status ' + cls; };
const $         = (id) => document.getElementById(id);

// ── Step 1: OAuth ─────────────────────────────────────────────────────────
const oauth = new FrejunOAuth({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });

oauth.on('tokens', (data) => {
  accessToken = data.access_token;
  log('✓ Authenticated');
  $('phone-section').disabled = false;
});

oauth.on('tokensRefreshed', (data) => {
  accessToken = data.access_token;
  log('✓ Token refreshed');
  if (softphone) {
    try { softphone.updateAccessToken(accessToken); } catch (_) {}
  }
});

oauth.on('error', (err) => log('Auth error: ' + err.message));

$('btn-auth').addEventListener('click', () => oauth.openAuthPopup());

// ── Step 2: Softphone setup ───────────────────────────────────────────────
$('btn-start').addEventListener('click', async () => {
  const email = $('user-email').value.trim();
  if (!email) { log('Enter your FreJun email first.'); return; }

  try {
    softphone = new Softphone();

    log('Logging in...');
    await softphone.login({ type: 'OAuth2.0', token: accessToken, email });

    const audioElements = {
      remote: $('sip-remote-audio'),
      local:  $('sip-local-audio'),
    };

    const listeners = {
      onConnectionStateChange: (type, newState, attemptReconnection, error) => {
        log(`Connection [${type}]: ${newState}`);
        if (newState === 'Registered') {
          setStatus('Registered — ready to call', 'registered');
          $('btn-dial').disabled = false;
        }
        if (newState === 'Stopped' || newState === 'Terminated') {
          setStatus('Disconnected', 'idle');
          $('btn-dial').disabled = true;
        }
        if (attemptReconnection) {
          log('Reconnecting...');
          softphone.reset(type === 'UserAgentState');
        }
      },

      onCallCreated: (type, details) => {
        log(`Call created [${type}]: ${details.candidate}`);
        setStatus(`${type} call — ${details.candidate}`, 'ringing');
        if (type === 'Incoming') $('btn-accept').disabled = false;
      },

      onCallRinging: (type, details) => {
        log(`Ringing [${type}]: ${details.candidate}`);
        setStatus('Ringing...', 'ringing');
        $('btn-end').disabled   = false;
        $('btn-mute').disabled  = false;
        $('btn-hold').disabled  = false;
      },

      onCallHangup: (type, details) => {
        log(`Call ended [${type}]: ${details.candidate}`);
        setStatus('Registered — ready to call', 'registered');
        $('btn-accept').disabled = true;
        $('btn-end').disabled    = true;
        $('btn-mute').disabled   = true;
        $('btn-hold').disabled   = true;
        isMuted = false;
        isOnHold = false;
      },
    };

    log('Starting softphone...');
    await softphone.start(listeners, audioElements);
    log('✓ Softphone started');
  } catch (err) {
    log('Softphone error: ' + err.message);
  }
});

// ── Call controls ─────────────────────────────────────────────────────────
$('btn-dial').addEventListener('click', async () => {
  const number  = $('phone-number').value.trim();
  const virtual = $('virtual-number').value.trim() || undefined;
  if (!number) { log('Enter a destination number.'); return; }

  try {
    log('Dialling ' + number + '...');
    await softphone.makeCall(number, virtual);
  } catch (err) {
    log('Dial error: ' + err.message);
  }
});

$('btn-accept').addEventListener('click', () => {
  try { softphone.getSession.accept(); log('Call accepted'); } catch (e) { log(e.message); }
});

$('btn-end').addEventListener('click', () => {
  try { softphone.getSession.end(); log('Call ended'); } catch (e) { log(e.message); }
});

$('btn-mute').addEventListener('click', () => {
  try {
    if (isMuted) { softphone.getSession.unmute(); log('Unmuted'); }
    else         { softphone.getSession.mute();   log('Muted'); }
    isMuted = !isMuted;
    $('btn-mute').textContent = isMuted ? 'Unmute' : 'Mute';
  } catch (e) { log(e.message); }
});

$('btn-hold').addEventListener('click', () => {
  try {
    if (isOnHold) { softphone.getSession.unhold(); log('Resumed'); }
    else          { softphone.getSession.hold();   log('On hold'); }
    isOnHold = !isOnHold;
    $('btn-hold').textContent = isOnHold ? 'Unhold' : 'Hold';
  } catch (e) { log(e.message); }
});
