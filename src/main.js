import { TonConnectUI } from '@tonconnect/ui';

// Telegram WebApp
const tg = window.Telegram && window.Telegram.WebApp;
if (tg) tg.expand();

// TonConnect UI
const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://emperator16.github.io/miniapp/tonconnect-manifest.json'
});

// 🔹 رندر دکمه رسمی TonConnect
tonConnectUI.render({
  buttonRootId: 'connect-root'
});

// عناصر UI
const walletPopup = document.getElementById('wallet-popup');
const boxes = document.querySelectorAll('.box');
const rewardPopup = document.getElementById('reward-popup');
const rewardText = document.getElementById('reward-text');
const timerEl = document.getElementById('timer');
const claimBtn = document.getElementById('claim');

let timerInterval;

// وضعیت اتصال ولت (استاندارد TonConnect)
tonConnectUI.onStatusChange(wallet => {
  if (!wallet) return;

  // ولت وصل شد
  walletPopup.classList.add('hidden');
  boxes.forEach(b => b.classList.add('active'));

  // در آینده:
  // wallet.account.address
  // wallet.account.chain
  // خواندن بالانس ژتون‌ها
});

// انتخاب باکس و نمایش جایزه رندوم
boxes.forEach(box => {
  box.addEventListener('click', () => {
    if (!box.classList.contains('active')) return;

    // انیمیشن ساده
    box.style.transform = 'scale(1.15)';
    setTimeout(() => box.style.transform = 'scale(1)', 400);

    // جایزه رندوم (placeholder)
    const prizes = [100, 70, 50];
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    rewardText.textContent = `🎉 Congratulations! You’ve won ${prize} TON`;

    rewardPopup.classList.remove('hidden');

    // تایمر 15 دقیقه
    let time = 15 * 60;
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      const m = Math.floor(time / 60).toString().padStart(2, '0');
      const s = (time % 60).toString().padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
      time--;

      if (time < 0) {
        clearInterval(timerInterval);
      }
    }, 1000);
  });
});
setInterval(() => {
  const list = document.querySelector('.activity-list');
  if (!list) return;

  const first = list.firstElementChild;
  list.appendChild(first.cloneNode(true));
  first.remove();
}, 5000);

// Claim Reward (placeholder – بعداً تراکنش واقعی)
claimBtn.onclick = () => {
  alert('Claim flow will be connected to the smart contract.');
};
