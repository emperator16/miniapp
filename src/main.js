import { TonConnectUI } from '@tonconnect/ui';

document.addEventListener('DOMContentLoaded', () => {

  /* Telegram */
  const tg = window.Telegram?.WebApp;
  tg?.expand();

  /* TonConnect */
  const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://emperator16.github.io/miniapp/tonconnect-manifest.json'
  });

  tonConnectUI.uiOptions = { language: 'en' };

  /* DOM */
  const connectBtn = document.getElementById('connect-btn');
  const disconnectBtn = document.getElementById('disconnect-btn');
  const featuredSlot = document.getElementById('featured-slot');
  const rewardText = document.getElementById('reward-text');
  const rewardIcon = document.getElementById('reward-icon');
  const activityList = document.querySelector('.activity-list');

  /* UI State */
  function setDisconnected() {
    connectBtn.textContent = 'Connect TON Wallet';
    connectBtn.disabled = false;
    disconnectBtn?.classList.add('hidden');
    featuredSlot.classList.remove('active', 'revealed');
  }

  function setConnected() {
    connectBtn.textContent = 'Wallet Connected';
    connectBtn.disabled = true;
    disconnectBtn?.classList.remove('hidden');
    featuredSlot.classList.add('active');
  }

  if (tonConnectUI.wallet?.account) setConnected();
  else setDisconnected();

  tonConnectUI.onStatusChange(w =>
    w?.account ? setConnected() : setDisconnected()
  );

  connectBtn.onclick = () => {
  tonConnectUI.openModal();
};

if (disconnectBtn) {
  disconnectBtn.onclick = () => {
    tonConnectUI.disconnect();
    setDisconnected();
  };
}

  /* Featured Slot Logic */
  const rewards = [
    { text: '+5 TON', icon: '💎' },
    { text: '+12 TON', icon: '💎' },
    { text: '+55 TON', icon: '💎' },
    { text: '+112 TON', icon: '💎' },
    { text: '+28 TON', icon: '💎' },
    { text: 'Rare NFT', icon: '🎨' },
    { text: 'Epic NFT', icon: '🎨' }
  ];

  featuredSlot.addEventListener('click', () => {
    if (!featuredSlot.classList.contains('active') ||
        featuredSlot.classList.contains('revealed')) return;

    const reward = rewards[Math.floor(Math.random() * rewards.length)];
    rewardText.textContent = reward.text;
    rewardIcon.textContent = reward.icon;
    featuredSlot.classList.add('revealed');
  });

  /* 🔴 Live Reward Stream */
  const rewardPool = [
    { label: '💎 +35 TON', color: '#4da6ff' },
    { label: '💎 +3 TON', color: '#4da6ff' },
    { label: '💎 +7 TON', color: '#4da6ff' },
    { label: '💎 +15 TON', color: '#4da6ff' },
    { label: '💎 +32 TON', color: '#4da6ff' },
    { label: '🎨 Rare NFT', color: '#b084ff' },
    { label: '🎨 Epic NFT', color: '#ff7ad9' },
    { label: '🎨 Genesis NFT', color: '#ffd36b' },
    { label: '🎨 Legendary NFT', color: '#ff6b6b' }
  ];

  const wallets = Array.from({ length: 30 }, (_, i) =>
    `EQ${i}…${Math.random().toString(36).slice(5,9)}`
  );

  function addActivity() {
    const li = document.createElement('li');
    const r = rewardPool[Math.floor(Math.random() * rewardPool.length)];
    const w = wallets[Math.floor(Math.random() * wallets.length)];

    li.innerHTML = `
      <span>${w}</span>
      <span style="color:${r.color};font-weight:700">${r.label}</span>
    `;

    if (activityList.children.length >= 5)
      activityList.removeChild(activityList.firstChild);

    activityList.appendChild(li);
  }

  for (let i = 0; i < 5; i++) addActivity();
  setInterval(addActivity, 3200);

});
