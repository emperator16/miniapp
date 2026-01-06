import { TonConnectUI } from '@tonconnect/ui';

document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     Telegram WebApp
  ================================ */
  const tg = window.Telegram?.WebApp || null;
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

  const totalRewardsEl = document.getElementById('total-rewards');
  const tonEarnedEl = document.getElementById('ton-earned');
  const nftsEarnedEl = document.getElementById('nfts-earned');
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
    return addr.slice(0, 6) + '…' + addr.slice(-4);
  }

  /* ===============================
     UI States
  ================================ */
  function setDisconnected() {
    walletDisconnected?.classList.remove('hidden');
    walletConnected?.classList.add('hidden');

    connectBtn && (connectBtn.disabled = false);

    featuredSlot?.classList.remove('active', 'revealed');
  }

  function setConnected(wallet) {
    if (!wallet?.account) return;

    walletDisconnected?.classList.add('hidden');
    walletConnected?.classList.remove('hidden');

    if (walletAddressEl) {
      walletAddressEl.textContent = shortAddress(wallet.account.address);
    }

    featuredSlot?.classList.add('active');

    /* reset stats */
    if (totalRewardsEl) totalRewardsEl.textContent = '0';
    if (tonEarnedEl) tonEarnedEl.textContent = '0';
    if (nftsEarnedEl) nftsEarnedEl.textContent = '0';

    if (myRewardsEl) {
      myRewardsEl.innerHTML = `
        <li class="empty-rewards">
          No rewards yet<br>
          <span>Reveal your first reward from the Mystery Vault</span>
        </li>
      `;
    }
  }

  /* ===============================
     Initial Sync
  ================================ */
  tonConnectUI.wallet?.account
    ? setConnected(tonConnectUI.wallet)
    : setDisconnected();

  /* ===============================
     Wallet Listener
  ================================ */
  tonConnectUI.onStatusChange(wallet => {
    wallet?.account ? setConnected(wallet) : setDisconnected();
  });

  /* ===============================
     Buttons
  ================================ */
  connectBtn?.addEventListener('click', () => {
    tonConnectUI.openModal();
  });

  disconnectBtn?.addEventListener('click', () => {
    tonConnectUI.disconnect();
    setDisconnected();
  });

  /* ===============================
     Featured Slot
  ================================ */
  const featuredRewards = [
    { text: '+5 TON', icon: '💎', ton: 5 },
    { text: '+12 TON', icon: '💎', ton: 12 },
    { text: '+28 TON', icon: '💎', ton: 28 },
    { text: 'Rare NFT', icon: '⬡', nft: true }
  ];

  featuredSlot?.addEventListener('click', () => {
    if (
      !featuredSlot.classList.contains('active') ||
      featuredSlot.classList.contains('revealed')
    ) return;

    const reward =
      featuredRewards[Math.floor(Math.random() * featuredRewards.length)];

    rewardText.textContent = reward.text;
    rewardIcon.textContent = reward.icon;
    featuredSlot.classList.add('revealed');
  });

  /* ===============================
     🔴 Live Reward Stream (clean & pro)
  ================================ */
  const rewardPool = [
    { label: '+3 TON', type: 'ton' },
    { label: '+7 TON', type: 'ton' },
    { label: '+15 TON', type: 'ton' },
    { label: '+32 TON', type: 'ton' },
    { label: 'NFT Reward', type: 'nft' },
    { label: 'Rare NFT', type: 'nft-rare' }
  ];

  const wallets = Array.from({ length: 30 }, (_, i) =>
    `EQ${i}${Math.random().toString(36).slice(2, 6)}…${Math.random()
      .toString(36)
      .slice(-4)}`
  );

  function addActivity() {
    if (!activityList) return;

    const r = rewardPool[Math.floor(Math.random() * rewardPool.length)];
    const w = wallets[Math.floor(Math.random() * wallets.length)];

    let color = '#4da6ff';
    let icon = '💎';

    if (r.type.startsWith('nft')) {
      icon = '⬡';
      color = r.type === 'nft-rare' ? '#a58bff' : '#8b8f98';
    }

    const li = document.createElement('li');
    li.innerHTML = `
      <span>${w}</span>
      <span style="color:${color};font-weight:600">${icon} ${r.label}</span>
    `;

    if (activityList.children.length >= 5) {
      activityList.removeChild(activityList.firstChild);
    }

    activityList.appendChild(li);
  }

  for (let i = 0; i < 5; i++) addActivity();
  setInterval(addActivity, 3200);
});
