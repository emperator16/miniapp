import { TonConnectUI } from '@tonconnect/ui';

/* ===============================
   Telegram WebApp (safe)
================================ */
var tg = null;
if (window.Telegram && window.Telegram.WebApp) {
  tg = window.Telegram.WebApp;
  tg.expand();
}

/* ===============================
   TonConnect Init
================================ */
var tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://emperator16.github.io/miniapp/tonconnect-manifest.json'
});

tonConnectUI.uiOptions = {
  language: 'en'
};

/* ===============================
   DOM Elements
================================ */
var connectBtn = document.getElementById('connect-btn');
var disconnectBtn = document.getElementById('disconnect-btn');
var boxes = document.querySelectorAll('.box');

/* ===============================
   UI State Helpers
================================ */
function setDisconnectedState() {
  connectBtn.textContent = 'Connect TON Wallet';
  connectBtn.disabled = false;

  if (disconnectBtn) {
    disconnectBtn.classList.add('hidden');
  }

  for (var i = 0; i < slots.length; i++) {
  slots[i].classList.remove('active');
}
}

function setConnectedState() {
  connectBtn.textContent = 'Wallet Connected';
  connectBtn.disabled = true;

  if (disconnectBtn) {
    disconnectBtn.classList.remove('hidden');
  }

  for (var i = 0; i < slots.length; i++) {
  slots[i].classList.add('active');
}
}

/* ===============================
   Force Sync On Load
   (حل مشکل cache موبایل)
================================ */
try {
  var wallet = tonConnectUI.wallet;

  if (!wallet || !wallet.account) {
    tonConnectUI.disconnect();
    setDisconnectedState();
  } else {
    setConnectedState();
  }
} catch (e) {
  console.warn('TonConnect sync warning', e);
  setDisconnectedState();
}

/* ===============================
   Connect Button
================================ */
connectBtn.addEventListener('click', function () {
  try {
    tonConnectUI.openModal();
  } catch (e) {
    console.error('TonConnect openModal error', e);
  }
});

/* ===============================
   Disconnect Button
================================ */
if (disconnectBtn) {
  disconnectBtn.addEventListener('click', function () {
    try {
      tonConnectUI.disconnect();
      setDisconnectedState();
    } catch (e) {
      console.error('Disconnect error', e);
    }
  });
}

/* ===============================
   Wallet Status Listener
================================ */
tonConnectUI.onStatusChange(function (wallet) {
  if (!wallet || !wallet.account) {
    setDisconnectedState();
    return;
  }

  setConnectedState();
});

for (var i = 0; i < slots.length; i++) {
  slots[i].addEventListener('click', function () {
    if (!this.classList.contains('active')) return;

    this.querySelector('.slot-status').textContent = 'Revealed';
  });
}

