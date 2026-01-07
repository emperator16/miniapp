import { TonConnectUI } from '@tonconnect/ui';

document.addEventListener('DOMContentLoaded', () => {

  const tg = window.Telegram?.WebApp;
  if (tg) tg.expand();

  const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://emperator16.github.io/miniapp/tonconnect-manifest.json'
  });

  const connectBtn = document.getElementById('connect-btn');
  const disconnectBtn = document.getElementById('disconnect-btn');
  const walletDisconnected = document.getElementById('wallet-disconnected');
  const walletConnected = document.getElementById('wallet-connected');
  const walletAddressEl = document.getElementById('wallet-address');
  const featuredSlot = document.getElementById('featured-slot');
  const rewardText = document.getElementById('reward-text');
  const rewardIcon = document.getElementById('reward-icon');
  const popup = document.getElementById('reward-popup');
  const popupReward = document.getElementById('popup-reward');
  const claimBtn = document.getElementById('claim');
  const activityList = document.querySelector('.activity-list');

  function setConnected(wallet) {
    walletDisconnected.classList.add('hidden');
    walletConnected.classList.remove('hidden');
    walletAddressEl.textContent = wallet.account.address;
    featuredSlot.classList.add('active');
  }

  function setDisconnected() {
    walletDisconnected.classList.remove('hidden');
    walletConnected.classList.add('hidden');
    featuredSlot.classList.remove('active','revealed');
  }

  tonConnectUI.onStatusChange(wallet => {
    wallet?.account ? setConnected(wallet) : setDisconnected();
  });

  connectBtn?.addEventListener('click', () => tonConnectUI.openModal());
  disconnectBtn?.addEventListener('click', () => tonConnectUI.disconnect());

  const featuredRewards = [
    { text: '+3 TON', icon: '◆' },
    { text: '+7 TON', icon: '◆' },
    { text: '+15 TON', icon: '◆' },
    { text: '+32 TON', icon: '◆' },
    { text: '+64 TON', icon: '◆' },
    { text: 'Exclusive NFT', icon: '▣' }
  ];

  featuredSlot?.addEventListener('click', () => {
    if (!featuredSlot.classList.contains('active')) return;
    const r = featuredRewards[Math.floor(Math.random()*featuredRewards.length)];
    rewardText.textContent = r.text;
    rewardIcon.textContent = r.icon;
    featuredSlot.classList.add('revealed');
    popupReward.textContent = r.text;
    popup.classList.remove('hidden');
  });

  claimBtn?.addEventListener('click', () => {
    popup.classList.add('hidden');
  });

  const rewardPool = [
    '◆ +2 TON','◆ +5 TON','◆ +9 TON','◆ +18 TON','◆ +36 TON',
    '▣ NFT Reward'
  ];

  function addActivity() {
    const li = document.createElement('li');
    li.innerHTML = `<span>EQ…${Math.random().toString(36).slice(-4)}</span>
                    <span>${rewardPool[Math.floor(Math.random()*rewardPool.length)]}</span>`;
    if (activityList.children.length >= 5)
      activityList.removeChild(activityList.firstChild);
    activityList.appendChild(li);
  }

  for (let i=0;i<5;i++) addActivity();
  setInterval(addActivity, 3000);

});
