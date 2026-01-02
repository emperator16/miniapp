import { TonConnectUI } from '@tonconnect/ui';

const tg = window.Telegram?.WebApp;
tg?.expand();

const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://emperator16.github.io/miniapp/tonconnect-manifest.json'
});

const connectBtn = document.getElementById('connect-btn');
const boxes = document.querySelectorAll('.box');

/* 🔑 این خط خیلی مهم است */
tonConnectUI.uiOptions = {
  language: 'en'
};

connectBtn.addEventListener('click', async () => {
  try {
    await tonConnectUI.openModal();
  } catch (e) {
    console.error('TonConnect error:', e);
  }
});

tonConnectUI.onStatusChange(wallet => {
  if (!wallet) return;

  connectBtn.textContent = 'Wallet Connected';
  connectBtn.disabled = true;

  boxes.forEach(b => b.classList.add('active'));
});
