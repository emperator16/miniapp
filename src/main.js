import { TonConnectUI } from '@tonconnect/ui';

/* ===============================
   Run AFTER DOM is ready
================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     Telegram WebApp (safe)
  ================================ */
  const tg = window.Telegram?.WebApp;
  tg?.expand();

  /* ===============================
     TonConnect Init
  ================================ */
  const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://emperator16.github.io/miniapp/tonconnect-manifest.json'
  });

  tonConnectUI.uiOptions = {
    language: 'en'
  };

  /* ===============================
     DOM Elements
  ================================ */
  const connectBtn = document.getElementById('connect-btn');
  const disconnectBtn = document.getElementById('disconnect-btn');
  const slots = document.querySelectorAll('.slot');

  if (!connectBtn) {
    console.error('Connect button not found');
    return;
  }

  /* ===============================
     UI States
  ================================ */
  function setDisconnectedState() {
    connectBtn.textContent = 'Connect TON Wallet';
    connectBtn.disabled = false;

    disconnectBtn?.classList.add('hidden');

    slots.forEach(slot => {
      slot.classList.remove('active');
      slot.querySelector('.slot-status').textContent = 'Locked';
    });
  }

  function setConnectedState() {
    connectBtn.textContent = 'Wallet Connected';
    connectBtn.disabled = true;

    disconnectBtn?.classList.remove('hidden');

    slots.forEach(slot => {
      slot.classList.add('active');
      slot.querySelector('.slot-status').textContent = 'Ready';
    });
  }

  /* ===============================
     Initial Wallet Sync
     (NO force disconnect)
  ================================ */
  if (tonConnectUI.wallet?.account) {
    setConnectedState();
  } else {
    setDisconnectedState();
  }

  /* ===============================
     Connect Button
  ================================ */
  connectBtn.addEventListener('click', async () => {
    try {
      await tonConnectUI.openModal();
    } catch (e) {
      console.error('TonConnect openModal error:', e);
    }
  });

  /* ===============================
     Disconnect Button
  ================================ */
  disconnectBtn?.addEventListener('click', async () => {
    try {
      await tonConnectUI.disconnect();
      setDisconnectedState();
    } catch (e) {
      console.error('Disconnect error:', e);
    }
  });

  /* ===============================
     Wallet Status Listener
  ================================ */
  tonConnectUI.onStatusChange(wallet => {
    if (!wallet || !wallet.account) {
      setDisconnectedState();
      return;
    }
    setConnectedState();
  });

  /* ===============================
     Slot Interaction
  ================================ */
  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      if (!slot.classList.contains('active')) return;

      const rewards = ['5 TON', '10 TON', '25 TON', 'NFT'];
      const reward = rewards[Math.floor(Math.random() * rewards.length)];

      slot.querySelector('.slot-type').textContent = reward;
      slot.querySelector('.slot-status').textContent = 'Revealed';
      slot.classList.add('opened');
    });
  });

});
