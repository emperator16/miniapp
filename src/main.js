import { TonConnectUI } from '@tonconnect/ui';

const tg = window.Telegram && window.Telegram.WebApp;
if (tg) tg.expand();

const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://emperator16.github.io/miniapp/tonconnect-manifest.json'
});

// عناصر
const walletPopup = document.getElementById('wallet-popup');
const connectBtn = document.getElementById('connect');
const boxes = document.querySelectorAll('.box');
const rewardPopup = document.getElementById('reward-popup');
const rewardText = document.getElementById('reward-text');
const timerEl = document.getElementById('timer');
const claimBtn = document.getElementById('claim');

let timerInterval;

// اتصال Wallet
connectBtn.onclick = async () => {
  try {
    await tonConnectUI.connectWallet();
  } catch(err) {
    console.error("Wallet connection failed:", err);
    return;
  }

  walletPopup.classList.add('hidden');
  boxes.forEach(b => b.classList.add('active'));
  // اینجا می‌توانید بالانس ژتون‌ها را بخوانید
};

// انتخاب باکس و نمایش جایزه رندوم
boxes.forEach(box => {
  box.addEventListener('click', () => {
    if (!box.classList.contains('active')) return;

    // انیمیشن ساده
    box.style.transform = 'scale(1.2)';
    setTimeout(() => box.style.transform = 'scale(1)', 500);

    // جایزه رندوم
    const prizes = [100, 70, 50];
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    rewardText.textContent = `🎉 Congratulations! You’ve won ${prize} TON!`;

    rewardPopup.classList.remove('hidden');

    // تایمر 15 دقیقه
    let time = 15 * 60;
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      const m = Math.floor(time / 60).toString().padStart(2,'0');
      const s = (time % 60).toString().padStart(2,'0');
      timerEl.textContent = `${m}:${s}`;
      time--;
      if (time < 0) clearInterval(timerInterval);
    }, 1000);
  });
});

// Claim Reward placeholder
claimBtn.onclick = () => {
  alert('This will trigger the transaction to claim your reward.');
  // تراکنش واقعی بعد از ساخت قرارداد اضافه خواهد شد
};
