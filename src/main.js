import { TonConnectUI } from '@tonconnect/ui';

const tg = window.Telegram?.WebApp;
tg?.expand();

const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://emperator16.github.io/miniapp/tonconnect-manifest.json'
});

const connectBtn = document.getElementById('connect-btn');
const boxes = document.querySelectorAll('.box');

connectBtn.onclick = async () => {
  await tonConnectUI.connectWallet();
};

tonConnectUI.onStatusChange(wallet => {
  if (!wallet) return;

  connectBtn.textContent = 'Wallet Connected';
  connectBtn.disabled = true;

  boxes.forEach(b => b.classList.add('active'));
});
