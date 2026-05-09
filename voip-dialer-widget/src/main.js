import { FrejunOAuth } from '@frejun/oauth';

// ── Config ────────────────────────────────────────────────────────────────
const CLIENT_ID     = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const DIALER_ORIGIN = 'https://dialer.frejun.com';
const DIALER_URL    = DIALER_ORIGIN + '/';

// ── Helpers ───────────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

function log(msg) {
  const el = $('log');
  const ts = new Date().toLocaleTimeString();
  el.textContent += `[${ts}] ${msg}\n`;
  el.scrollTop = el.scrollHeight;
}

function setStatus(id, text, variant) {
  const badge = $(id);
  badge.textContent = text;
  badge.className = `status status-${variant}`;
}

// ── State ─────────────────────────────────────────────────────────────────
let accessToken  = null;
let userEmail    = null;
let dialerLoaded = false;   // true once iframe dispatches "ready"
let authRequired = false;   // true when (re-)authorization is needed
let dialerVisible = false;  // tracks widget visibility

// ═══════════════════════════════════════════════════════════════════════════
//  STEP 1 — OAuth Authentication
// ═══════════════════════════════════════════════════════════════════════════
const oauth = new FrejunOAuth({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });

oauth.on('authCode', (data) => {
  userEmail = data.email;
});

oauth.on('tokens', (data) => {
  accessToken = data.access_token;
  setStatus('auth-status', 'Authenticated', 'ok');
  log(`✓ OAuth complete — ${userEmail || 'user'}`);

  // Enable the "Open Widget" button now that we have a token
  $('btn-open').disabled = false;

  // If the widget was already loaded and waiting, authorize immediately
  if (dialerLoaded && authRequired) {
    sendAuthorize();
  }
});

oauth.on('tokensRefreshed', (data) => {
  accessToken = data.access_token;
  log('✓ Token refreshed');

  // Re-authorize the already-loaded widget with the new token
  if (dialerLoaded) {
    sendAuthorize();
  }
});

oauth.on('error', (err) => {
  setStatus('auth-status', 'Auth Error', 'error');
  log('✗ OAuth error: ' + err.message);
});

$('btn-auth').addEventListener('click', () => oauth.openAuthPopup());

// ═══════════════════════════════════════════════════════════════════════════
//  STEP 2 — Widget Lifecycle (load / show / hide)
// ═══════════════════════════════════════════════════════════════════════════

/** Load the dialer iframe (without token in the URL — auth is via postMessage). */
function openWidget() {
  const iframe = $('dialer-iframe');

  // Only set src once; subsequent opens just show the wrapper
  if (!iframe.src || iframe.src === 'about:blank') {
    iframe.src = DIALER_URL;
    log('Loading dialer iframe…');
  }

  showWidget();
}

function showWidget() {
  $('widget-wrapper').style.display = 'block';
  dialerVisible = true;
  $('btn-close').disabled = false;
  setStatus('widget-status', 'Visible', 'ok');
}

function hideWidget() {
  $('widget-wrapper').style.display = 'none';
  dialerVisible = false;
  $('btn-close').disabled = true;
  setStatus('widget-status', 'Hidden', 'idle');
}

$('btn-open').addEventListener('click', openWidget);
$('btn-close').addEventListener('click', hideWidget);

// ═══════════════════════════════════════════════════════════════════════════
//  OUTBOUND MESSAGES  (Parent → Dialer iframe)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Send the "authorize" message so the widget can authenticate the user.
 * Docs: eventName = 'authorize', data = { access_token, user_email }
 */
function sendAuthorize() {
  const iframe = $('dialer-iframe');
  const message = {
    eventName: 'authorize',
    data: {
      access_token: accessToken,
      user_email: userEmail,
    },
  };

  iframe.contentWindow.postMessage(message, { targetOrigin: DIALER_URL });
  authRequired = false;
  log('→ Sent "authorize" to dialer');
}

/**
 * Send the "initiate-call" message to start an outbound call.
 * Docs: eventName = 'initiate-call', data = { user_email, candidate_number,
 *   candidate_name?, virtual_number?, access_token, transaction_id?, job_id?, candidate_id? }
 */
function sendInitiateCall() {
  const candidateNumber = $('call-number').value.trim();
  if (!candidateNumber) {
    log('✗ Candidate number is required to initiate a call');
    return;
  }

  const data = {
    user_email: userEmail,
    candidate_number: candidateNumber,
    access_token: accessToken,
  };

  // Optional fields — include only when provided
  const optionalFields = {
    candidate_name: $('call-name').value.trim(),
    virtual_number: $('call-vn').value.trim(),
    transaction_id: $('call-txn').value.trim(),
    job_id: $('call-job').value.trim(),
    candidate_id: $('call-cid').value.trim(),
  };

  for (const [key, val] of Object.entries(optionalFields)) {
    if (val) data[key] = val;
  }

  const iframe = $('dialer-iframe');
  iframe.contentWindow.postMessage(
    { eventName: 'initiate-call', data },
    { targetOrigin: DIALER_URL },
  );

  openWidget();

  log(`→ Sent "initiate-call" to ${candidateNumber}`);
  $('btn-end-call').disabled = false;
}

/**
 * Send the "end-call" message to terminate an ongoing browser-based call.
 */
function sendEndCall() {
  const iframe = $('dialer-iframe');
  iframe.contentWindow.postMessage(
    { eventName: 'end-call' },
    { targetOrigin: DIALER_URL },
  );
  log('→ Sent "end-call" to dialer');
}

$('btn-call').addEventListener('click', sendInitiateCall);
$('btn-end-call').addEventListener('click', sendEndCall);

// ═══════════════════════════════════════════════════════════════════════════
//  INBOUND MESSAGES  (Dialer iframe → Parent)
// ═══════════════════════════════════════════════════════════════════════════

window.addEventListener('message', (event) => {
  // Only process messages from the dialer origin
  if (event.origin !== DIALER_ORIGIN || !event.data) return;

  const { eventName, detail } = event.data;

  switch (eventName) {
    // ── ready ────────────────────────────────────────────────────────────
    // Sent each time the iframe loads (initial load and page refreshes).
    // We must respond with an "authorize" message.
    case 'ready':
      dialerLoaded = true;
      authRequired = true;
      setStatus('widget-status', 'Loaded', 'ok');
      log('← Dialer "ready"');

      // If we already have a token, authorize immediately
      if (accessToken) {
        sendAuthorize();
      } else {
        log('  (waiting for OAuth before authorizing)');
      }

      // Enable call controls
      $('btn-call').disabled = false;
      break;

    // ── unauthorized ─────────────────────────────────────────────────────
    // Authorization failed. detail contains the reason:
    //   - missing required parameter: access_token
    //   - missing required parameter: user_email
    //   - invalid/expired access_token
    //   - missing/invalid parameter: data
    //   - Subscription is Inactive
    case 'unauthorized':
      authRequired = true;
      setStatus('auth-status', 'Unauthorized', 'error');
      log(`← Dialer "unauthorized" — ${detail}`);
      break;

    // ── incoming-call ────────────────────────────────────────────────────
    // An inbound call is ringing — make the widget visible so the user
    // can accept or reject.
    case 'incoming-call':
      log('← Dialer "incoming-call" — showing widget');
      showWidget();
      $('btn-end-call').disabled = false;
      break;

    // ── close ────────────────────────────────────────────────────────────
    // The iframe signals it can be hidden. This happens:
    //   - After saving call details.
    //   - When a call cannot be initiated (validation errors).
    case 'close':
      log('← Dialer "close" — hiding widget');
      hideWidget();
      $('btn-end-call').disabled = true;
      break;

    // ── height-change ────────────────────────────────────────────────────
    // The iframe content height changed. detail = height in pixels.
    // Resize the wrapper to match.
    case 'height-change': {
      const newHeight = parseInt(detail, 10);
      if (newHeight > 0) {
        $('widget-wrapper').style.height = `${newHeight}px`;
        $('dialer-iframe').style.height = `${newHeight}px`;
        log(`← Dialer "height-change" — ${newHeight}px`);
      }
      break;
    }

    // ── call-ended ───────────────────────────────────────────────────────
    // A browser-based call (incoming or outgoing) has ended, or an
    // incoming call was rejected.
    case 'call-ended':
      log('← Dialer "call-ended"');
      $('btn-end-call').disabled = true;
      break;

    // ── end-call-error ───────────────────────────────────────────────────
    // The "end-call" we sent failed. detail contains the reason:
    //   - Call can not be ended while initiation is in progress
    //   - Received end-call message when there is no ongoing browser-based call
    case 'end-call-error':
      log(`← Dialer "end-call-error" — ${detail}`);
      break;

    // ── fallback ─────────────────────────────────────────────────────────
    default:
      log(`← Dialer unknown event: ${JSON.stringify(event.data)}`);
  }
});

// ── Misc UI ───────────────────────────────────────────────────────────────
$('btn-clear-log').addEventListener('click', () => {
  $('log').textContent = '';
});
