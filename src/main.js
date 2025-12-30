import { TonConnectUI } from '@tonconnect/ui';

// ایمن‌سازی WebApp تلگرام
const tg = window.Telegram && window.Telegram.WebApp;
if (tg) tg.expand();

// راه‌اندازی TON Connect
const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://emperator16.github.io/miniapp/tonconnect-manifest.json'
});

// دکمه اتصال
document.getElementById('connect').onclick = async () => {
  try {
    await tonConnectUI.connectWallet();
  } catch (err) {
    console.error("Wallet connection failed:", err);
  }
};

// دریافت وضعیت Wallet
tonConnectUI.onStatusChange(wallet => {
  if (wallet && tg) {
    tg.sendData(JSON.stringify({
      action: 'wallet_connected',
      address: wallet.account.address
    }));
  }
});
