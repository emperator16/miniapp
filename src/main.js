import { TonConnectUI } from '@tonconnect/ui';

document.addEventListener('DOMContentLoaded', () => {

  const tg = window.Telegram?.WebApp;
  tg?.expand();

  const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://emperator16.github.io/miniapp/tonconnect-manifest.json'
  });

  const connectBtn = document.getElementById('connect-btn');
  const disconnectBtn = document.getElementById('disconnect-btn');
  const walletDisconnected = document.getElementById('wallet-disconnected');
  const walletConnected = document.getElementById('wallet-connected');
  const walletAddressEl = document.getElementById('wallet-address');
  const myRewardsEl = document.getElementById('my-rewards');

  const featuredSlot = document.getElementById('featured-slot');
  const rewardText = document.getElementById('reward-text');
  const rewardIcon = document.getElementById('reward-icon');

  const rewardPopup = document.getElementById('reward-popup');
  const rewardAmount = document.getElementById('reward-amount');
  const rewardIconPopup = document.getElementById('reward-icon-popup');
  const claimRewardBtn = document.getElementById('claim-reward');

  const activityList = document.querySelector('.activity-list');

  const totalRewardsEl = document.getElementById('total-rewards');
  const tonEarnedEl = document.getElementById('ton-earned');
  const nftEarnedEl = document.getElementById('nfts-earned');

  function shortAddress(addr) {
    return addr.slice(0, 4) + '…' + addr.slice(-4);
  }

  function setDisconnected() {
    walletDisconnected.classList.remove('hidden');
    walletConnected.classList.add('hidden');
    connectBtn.disabled = false;
    featuredSlot.classList.remove('active', 'revealed');
  }

  function setConnected(wallet) {
    walletDisconnected.classList.add('hidden');
    walletConnected.classList.remove('hidden');
    walletAddressEl.textContent = shortAddress(wallet.account.address);
    connectBtn.disabled = true;
    featuredSlot.classList.add('active');

    myRewardsEl.innerHTML =
      `<li class="empty-rewards">No rewards yet<br><span>Reveal your first reward</span></li>`;
    totalRewardsEl.textContent = '0';
    tonEarnedEl.textContent = '0';
    nftEarnedEl.textContent = '0';
  }

  tonConnectUI.onStatusChange(w => w?.account ? setConnected(w) : setDisconnected());
  if (tonConnectUI.wallet?.account) setConnected(tonConnectUI.wallet);

  connectBtn.onclick = () => tonConnectUI.openModal();
  disconnectBtn.onclick = () => { tonConnectUI.disconnect(); setDisconnected(); };

  const rewards = [
    { label: '+5 TON', type: 'ton' },
    { label: '+12 TON', type: 'ton' },
    { label: '+28 TON', type: 'ton' },
    { label: '+55 TON', type: 'ton' },
    { label: 'Rare NFT', type: 'nft' },
    { label: 'Epic NFT', type: 'nft' }
  ];

  let currentReward = null;

  featuredSlot.addEventListener('click', () => {
    if (!featuredSlot.classList.contains('active') ||
        featuredSlot.classList.contains('revealed')) return;

    currentReward = rewards[Math.floor(Math.random() * rewards.length)];
    rewardText.textContent = currentReward.label;
    rewardIcon.textContent = currentReward.type === 'ton' ? '💎' : '◆';
    rewardIconPopup.textContent = rewardIcon.textContent;
    rewardAmount.textContent = currentReward.label;

    featuredSlot.classList.add('revealed');
    rewardPopup.classList.add('show');
  });

  claimRewardBtn.onclick = () => {
    rewardPopup.classList.remove('show');

    if (myRewardsEl.querySelector('.empty-rewards')) myRewardsEl.innerHTML = '';

    const li = document.createElement('li');
    li.innerHTML = `<span>${currentReward.label}</span><span>✔</span>`;
    myRewardsEl.appendChild(li);

    totalRewardsEl.textContent = +totalRewardsEl.textContent + 1;

    if (currentReward.type === 'ton') {
      tonEarnedEl.textContent =
        +tonEarnedEl.textContent + parseInt(currentReward.label);
    } else {
      nftEarnedEl.textContent = +nftEarnedEl.textContent + 1;
    }
  };

  const activityRewards = [
    '+3 TON','+7 TON','+15 TON','+32 TON','Rare NFT','Epic NFT'
  ];

  const wallets = Array.from({length:30},(_,i)=>`EQ${i}${Math.random().toString(36).slice(2,6)}…${Math.random().toString(36).slice(-4)}`);

  function addActivity() {
    const li = document.createElement('li');
    const r = activityRewards[Math.floor(Math.random()*activityRewards.length)];
    const w = wallets[Math.floor(Math.random()*wallets.length)];
    const type = r.includes('TON') ? 'ton' : 'nft';

    li.innerHTML = `<span>${w}</span><span class="reward ${type}">${r}</span>`;
    if (activityList.children.length >= 5) activityList.firstChild.remove();
    activityList.appendChild(li);
  }

  for (let i=0;i<5;i++) addActivity();
  setInterval(addActivity, 3000);

});
