import { FrejunOAuth } from '@frejun/oauth';

// ── Config ────────────────────────────────────────────────────────────────
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const WIDGET_BASE   = 'https://dialer.frejun.com/';

// ── State ─────────────────────────────────────────────────────────────────
let accessToken = null;
let userEmail   = null;

const log = (msg) => (document.getElementById('log').textContent += msg + '\n');
const $   = (id) => document.getElementById(id);

// ── Step 1: OAuth ─────────────────────────────────────────────────────────
const oauth = new FrejunOAuth({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });

oauth.on('authCode', (data) => {
  userEmail = data.email;
});

oauth.on('tokens', (data) => {
  accessToken = data.access_token;
  log('✓ Authenticated as ' + (userEmail || 'user'));
  $('btn-widget').disabled = false;
});

oauth.on('tokensRefreshed', (data) => {
  accessToken = data.access_token;
  log('✓ Token refreshed — reloading widget');
  loadWidget();
});

oauth.on('error', (err) => log('Auth error: ' + err.message));

$('btn-auth').addEventListener('click', () => oauth.openAuthPopup());

// ── Step 2: Load the Dialer Widget ────────────────────────────────────────
function loadWidget() {
  const iframe = $('dialer-iframe');
  iframe.src = `${WIDGET_BASE}?token=${encodeURIComponent(accessToken)}`;
  $('widget-wrapper').style.display = 'block';
  log('Dialer widget loaded');
}

$('btn-widget').addEventListener('click', () => loadWidget());

// ── Listen for messages from the widget ───────────────────────────────────
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://product.frejun.com' || !event.data) return;
  log('Widget message: ' + JSON.stringify(event.data));
});
