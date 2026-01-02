import { TonConnectUI } from '@tonconnect/ui';

/* ===============================
   Telegram WebApp
================================ */
const tg = window.Telegram?.WebApp;
tg?.expand();

/* ===============================
   TonConnect Init
================================ */
const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://emperator16.github.io/miniapp/tonconnect-manifest.json'
});

tonConnectUI.uiOptions = {
  language: 'en'
};

/* ===============================
   DOM Elements
================================ */
const connectBtn = document.getElementById('connect-btn');
const disconnectBtn = document.getElementById('disconnect-btn'); // اگر نداری پایین توضیح دادم
const boxes = document.querySelectorAll('.box');

/* ===============================
   Helpers
================================ */
function setDisconnectedState() {
  connectBtn.textContent = 'Connect TON Wallet';
  connectBtn.disabled = false;
  disconnectBtn?.classList.add('hidden');
  boxes.forEach(b => b.classList.remove('active'));
}

function setConnectedState() {
  connectBtn.textContent = 'Wallet Connected';
  connectBtn.disabled = true;
  disconnectBtn?.classList.remove('hidden');
  boxes.forEach(b => b.classList.add('active'));
}

/* ===============================
   Force sync on page load
   (حل باگ cache / session موبایل)
================================ */
(async () => {
  try {
    const wallet = tonConnectUI.wallet;

    if (!wallet || !wallet.account) {
      await tonConnectUI.disconnect(); // پاک‌کردن session فاسد
      setDisconnectedState();
