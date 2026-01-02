import { TonConnectUI } from '@tonconnect/ui';

// Telegram WebApp
const tg = window.Telegram && window.Telegram.WebApp;
if (tg) tg.expand();

// TonConnect UI
const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://emperator16.github.io/miniapp/tonconnect-manifest.json'
});

// عناصر UI
const walletPopup = document.getElementById('wallet-popup');
const boxes = document.querySelectorAll('.box');
const rewardPopup = document.getElementById('reward-popup');
const rewardText = document.getElementById('reward-text');
const timerEl = document.getElementById('timer');
const claimBtn = document.getElementById('claim');

let timerInterval;

// وضعیت اتصال ولت
tonConnectUI.onStatusChange(wallet => {
  if (!wallet) return;

  walletPopup.classList.add('hidden');
  boxes.forEach(b => b.classList.add('active'));
});

// انتخاب باکس
boxes.forEach(box => {
  box.addEventListener('click', () => {
    if (!box.classList.contains('active')) return;

    box.style.transform = 'scale(1.15)';
    setTimeout(() => box.style.transform = 'scale(1)', 400);

    const prizes = [100, 70, 50];
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    rewardText.textContent = `🎉 Congratulations! You’ve won ${prize} TON`;

    rewardPopup.classList.remove('hidden');

    let time = 15 * 60;
    clearInterval(timerInterval);

    timerInterval = setInterval(() => {
      const m = Math.floor(time / 60).toString().padStart(2, '0');
      const s = (time % 60).toString().padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
      time--;
      if (time < 0) clearInterval(timerInterval);
    }, 1000);
  });
});

// Activity rotation (preview)
const activityPool = [
  { addr: 'EQC…91a', type: 'ton', value: '25 TON' },
  { addr: 'EQB…72f', type: 'ton', value: '10 TON' },
  { addr: 'EQA…c31', type: 'ton', value: '7 TON' },
  { addr: 'EQD…8f2', type: 'nft', value: 'Rare NFT' },
  { addr: 'EQE…aa4', type: 'ton', value: '50 TON' },
  { addr: 'EQF…19b', type: 'ton', value: '3 TON' },
  { addr: 'EQ9…fe1', type: 'nft', value: 'Mystery NFT' },
  { addr: 'EQ1…b72', type: 'ton', value: '70 TON' },
  { addr: 'EQ4…ca9', type: 'ton', value: '5 TON' },
  { addr: 'EQ7…8aa', type: 'nft', value: 'Epic NFT' },
  { addr: 'EQ8…001', type: 'ton', value: '12 TON' },
  { addr: 'EQ2…d91', type: 'ton', value: '18 TON' },
  { addr: 'EQ5…c3e', type: 'nft', value: 'Legendary NFT' },
  { addr: 'EQ6…e42', type: 'ton', value: '9 TON' },
  { addr: 'EQa…f18', type: 'ton', value: '30 TON' },
  { addr: 'EQb…771', type: 'ton', value: '4 TON' },
  { addr: 'EQc…9f0', type: 'nft', value: 'Genesis NFT' },
  { addr: 'EQd…a21', type: 'ton', value: '22 TON' },
  { addr: 'EQe…8d4', type: 'ton', value: '15 TON' },
  { addr: 'EQf…111', type: 'nft', value: 'Ultra NFT' }
];

const activityList = document.querySelector('.activity-list');

let poolIndex = 0;
const VISIBLE_ITEMS = 3;

// ساخت li
function createActivityItem(item) {
  const li = document.createElement('li');

  const addr = document.createElement('span');
  addr.className = 'addr';
  addr.textContent = item.addr;

  const value = document.createElement('span');
  value.className = item.type === 'nft' ? 'nft' : 'amount';
  value.textContent = item.type === 'nft' ? item.value : `+${item.value}`;

  li.appendChild(addr);
  li.appendChild(value);

  return li;
}

// مقداردهی اولیه (۳ آیتم اول)
for (let i = 0; i < VISIBLE_ITEMS; i++) {
  const item = activityPool[poolIndex % activityPool.length];
  activityList.appendChild(createActivityItem(item));
  poolIndex++;
}

// چرخش آیتم‌ها
setInterval(() => {
  // حذف اولی
  if (activityList.firstElementChild) {
    activityList.removeChild(activityList.firstElementChild);
  }

  // اضافه‌کردن آیتم جدید از پایین
  const nextItem = activityPool[poolIndex % activityPool.length];
  activityList.appendChild(createActivityItem(nextItem));
  poolIndex++;

}, 4200);

// Claim placeholder
claimBtn.onclick = () => {
  alert('Claim flow will be connected to the smart contract.');
};
