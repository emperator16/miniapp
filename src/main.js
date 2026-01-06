import { TonConnectUI } from '@tonconnect/ui';

document.addEventListener('DOMContentLoaded', () => {

  const tg = window.Telegram?.WebApp; tg?.expand();
  const tonConnectUI = new TonConnectUI({ manifestUrl:'https://emperator16.github.io/miniapp/tonconnect-manifest.json' });
  tonConnectUI.uiOptions = { language: 'en' };

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
  const rewardPopup = document.getElementById('reward-popup');
  const rewardAmount = document.getElementById('reward-amount');
  const rewardIconPopup = document.getElementById('reward-icon-popup');
  const claimRewardBtn = document.getElementById('claim-reward');

  function shortAddress(addr) { return addr ? addr.slice(0,4)+'…'+addr.slice(-4):''; }

  function setDisconnected() {
    walletDisconnected.classList.remove('hidden');
    walletConnected.classList.add('hidden');
    connectBtn.disabled = false;
    connectBtn.textContent = 'Connect TON Wallet';
    featuredSlot.classList.remove('active','revealed');
  }

  function setConnected(wallet) {
    if(!wallet?.account) return;
    walletDisconnected.classList.add('hidden');
    walletConnected.classList.remove('hidden');
    walletAddressEl.textContent = shortAddress(wallet.account.address);
    connectBtn.disabled = true;
    connectBtn.textContent = 'Wallet Connected';
    featuredSlot.classList.add('active');

    // initial reward history
    myRewardsEl.innerHTML = `<li class="empty-rewards">No rewards yet<br><span>Reveal your first reward from the Mystery Vault</span></li>`;
    document.getElementById('total-rewards').textContent = '0';
    document.getElementById('ton-earned').textContent = '0';
    document.getElementById('nfts-earned').textContent = '0';
  }

  if(tonConnectUI.wallet?.account) setConnected(tonConnectUI.wallet);
  else setDisconnected();
  tonConnectUI.onStatusChange(w => !w?.account ? setDisconnected() : setConnected(w));

  connectBtn.addEventListener('click',()=>tonConnectUI.openModal());
  disconnectBtn.addEventListener('click',()=>{tonConnectUI.disconnect(); setDisconnected();});

  const featuredRewards = [
    { text: '+5 TON', icon:'💎' },
    { text: '+12 TON', icon:'💎' },
    { text: '+28 TON', icon:'💎' },
    { text: '+55 TON', icon:'💎' },
    { text: '+112 TON', icon:'💎' },
    { text: 'Rare NFT', icon:'🖼️' },
    { text: 'Epic NFT', icon:'🖼️' }
  ];

  let currentReward = null;
  featuredSlot.addEventListener('click',()=>{
    if(!featuredSlot.classList.contains('active')||featuredSlot.classList.contains('revealed')) return;
    currentReward = featuredRewards[Math.floor(Math.random()*featuredRewards.length)];
    rewardText.textContent = currentReward.text;
    rewardIcon.textContent = currentReward.icon;
    featuredSlot.classList.add('revealed');

    rewardAmount.textContent = currentReward.text;
    rewardIconPopup.textContent = currentReward.icon;
    rewardPopup.classList.add('show');
  });

  claimRewardBtn.addEventListener('click',()=>{
    rewardPopup.classList.remove('show');
    if(!currentReward) return;

    // add to history
    const li = document.createElement('li');
    li.innerHTML = `<span>${currentReward.text}</span><span>✔</span>`;
    if(myRewardsEl.querySelector('.empty-rewards')) myRewardsEl.innerHTML='';
    myRewardsEl.appendChild(li);

    // update counters
    const totalEl = document.getElementById('total-rewards');
    const tonEl = document.getElementById('ton-earned');
    const nftEl = document.getElementById('nfts-earned');

    totalEl.textContent = parseInt(totalEl.textContent||'0')+1;
    if(currentReward.text.includes('TON')) tonEl.textContent = parseInt(tonEl.textContent||'0') + parseInt(currentReward.text.replace(/\D/g,''));
    if(currentReward.text.includes('NFT')) nftEl.textContent = parseInt(nftEl.textContent||'0') +1;
  });

  const rewardPool = [
    { label:'💎 +3 TON', color:'#4da6ff' },
    { label:'💎 +7 TON', color:'#4da6ff' },
    { label:'💎 +15 TON', color:'#4da6ff' },
    { label:'💎 +32 TON', color:'#4da6ff' },
    { label:'💎 +55 TON', color:'#4da6ff' },
    { label:'🖼️ Rare NFT', color:'#b084ff' },
    { label:'🖼️ Epic NFT', color:'#ff7ad9' },
    { label:'🖼️ Genesis NFT', color:'#ffd36b' },
    { label:'🖼️ Legendary NFT', color:'#ff6b6b' }
  ];
  const wallets = Array.from({length:30},(_,i)=>`EQ${i}${Math.random().toString(36).slice(2,6)}…${Math.random().toString(36).slice(-4)}`);

  function addActivity(){
    const li = document.createElement('li');
    const r = rewardPool[Math.floor(Math.random()*rewardPool.length)];
    const w = wallets[Math.floor(Math.random()*wallets.length)];
    li.innerHTML = `<span>${w}</span><span style="color:${r.color};font-weight:700">${r.label}</span>`;
    if(activityList.children.length>=5) activityList.removeChild(activityList.firstChild);
    activityList.appendChild(li);
  }
  for(let i=0;i<5;i++) addActivity();
  setInterval(addActivity,3200);

});
