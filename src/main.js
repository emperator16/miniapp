import { TonConnectUI } from '@tonconnect/ui';

document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     Telegram WebApp
  ================================ */
  const tg =
    window.Telegram && window.Telegram.WebApp
      ? window.Telegram.WebApp
      : null;
  if (tg) tg.expand();

  /* ===============================
     TonConnect Init
  ================================ */
  const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://emperator16.github.io/miniapp/tonconnect-manifest.json'
  });

  tonConnectUI.uiOptions = { language: 'en' };

  /* ===============================
     DOM Elements
  ================================ */
  const connectBtn = document.getElementById('connect-btn');
  const disconnectBtn = document.getElementById('disconnect-btn');

  const walletDisconnected = document.getElementById('wallet-disconnected');
  const walletConnected = document.getElementById('wallet-connected');
  const walletAddressEl = document.getElementById('wallet-address');
  const myRewardsEl = document.getElementById('my-rewards');

  const featuredSlot = document.getElementById('featured-slot');
  const rewardText = document.getElementById('reward-text');
  const rewardIcon = document.getElementById('reward-icon');

  const activityList = document.querySelector('.activity-list');

  /* ===============================
     Helpers
  ================================ */
  function shortAddress(addr) {
    if (!addr) return '';
    return addr.slice(0, 4) + '…' + addr.slice(-4);
  }

  /* ===============================
     UI States
  ================================ */
  function setDisconnected() {
    if (walletDisconnected) walletDisconnected.classList.remove('hidden');
    if (walletConnected) walletConnected.classList.add('hidden');

    if (connectBtn) {
      connectBtn.disabled = false;
      connectBtn.textContent = 'Connect TON Wallet';
    }

    if (featuredSlot) {
      featuredSlot.classList.remove('active', 'revealed');
    }
  }

  function setConnected(wallet) {
    if (!wallet || !wallet.account) return;

    if (walletDisconnected) walletDisconnected.classList.add('hidden');
    if (walletConnected) walletConnected.classList.remove('hidden');

    if (walletAddressEl) {
      walletAddressEl.textContent = shortAddress(wallet.account.address);
    }

    if (connectBtn) {
      connectBtn.disabled = true;
      connectBtn.textContent = 'Wallet Connected';
    }

    if (featuredSlot) {
      featuredSlot.classList.add('active');
    }

    /* Fake but believable reward history (local only) */
    if (myRewardsEl) {
      myRewardsEl.innerHTML = '';
      ['+5 TON', '+12 TON', 'Rare NFT'].forEach(r => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${r}</span><span>✔</span>`;
        myRewardsEl.appendChild(li);
      });
    }
  }

  /* ===============================
     Initial Sync
  ================================ */
  if (tonConnectUI.wallet && tonConnectUI.wallet.account) {
    setConnected(tonConnectUI.wallet);
  } else {
    setDisconnected();
  }

  /* ===============================
     Wallet Listener
  ================================ */
  tonConnectUI.onStatusChange(wallet => {
    if (!wallet || !wallet.account) {
      setDisconnected();
    } else {
      setConnected(wallet);
    }
  });

  /* ===============================
     Buttons
  ================================ */
  if (connectBtn) {
    connectBtn.addEventListener('click', () => {
      tonConnectUI.openModal();
    });
  }

  if (disconnectBtn) {
    disconnectBtn.addEventListener('click', () => {
      tonConnectUI.disconnect();
      setDisconnected();
    });
  }

  /* ===============================
     Featured Slot (Option 2)
  ================================ */
  const featuredRewards = [
    { text: '+5 TON', icon: '💎' },
    { text: '+12 TON', icon: '💎' },
    { text: '+28 TON', icon: '💎' },
    { text: '+55 TON', icon: '💎' },
    { text: '+112 TON', icon: '💎' },
    { text: 'Rare NFT', icon: '🎨' },
    { text: 'Epic NFT', icon: '🎨' }
  ];

  if (featuredSlot) {
    featuredSlot.addEventListener('click', () => {
      if (
        !featuredSlot.classList.contains('active') ||
        featuredSlot.classList.contains('revealed')
      ) return;

      const reward =
        featuredRewards[Math.floor(Math.random() * featuredRewards.length)];

      if (rewardText) rewardText.textContent = reward.text;
      if (rewardIcon) rewardIcon.textContent = reward.icon;

      featuredSlot.classList.add('revealed');
    });
  }

  /* ===============================
     🔴 Live Reward Stream
  ================================ */
  const rewardPool = [
    { label: '💎 +3 TON', color: '#4da6ff' },
    { label: '💎 +7 TON', color: '#4da6ff' },
    { label: '💎 +15 TON', color: '#4da6ff' },
    { label: '💎 +32 TON', color: '#4da6ff' },
    { label: '💎 +55 TON', color: '#4da6ff' },
    { label: '🎨 Rare NFT', color: '#b084ff' },
    { label: '🎨 Epic NFT', color: '#ff7ad9' },
    { label: '🎨 Genesis NFT', color: '#ffd36b' },
    { label: '🎨 Legendary NFT', color: '#ff6b6b' }
  ];

  const wallets = Array.from({ length: 30 }, (_, i) =>
    `EQ${i}${Math.random().toString(36).slice(2, 6)}…${Math.random()
      .toString(36)
      .slice(-4)}`
  );

  function addActivity() {
    if (!activityList) return;

    const li = document.createElement('li');
    const r = rewardPool[Math.floor(Math.random() * rewardPool.length)];
    const w = wallets[Math.floor(Math.random() * wallets.length)];

    li.innerHTML = `
      <span>${w}</span>
      <span style="color:${r.color};font-weight:700">${r.label}</span>
    `;

    if (activityList.children.length >= 5) {
      activityList.removeChild(activityList.firstChild);
    }

    activityList.appendChild(li);
  }

  for (let i = 0; i < 5; i++) addActivity();
  setInterval(addActivity, 3200);

});
