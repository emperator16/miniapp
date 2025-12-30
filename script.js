const tg = window.Telegram.WebApp;
tg.expand();

const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
  manifestUrl: "https://emperator16.github.io/miniapp/tonconnect-manifest.json"
});

document.getElementById("connect").onclick = async () => {
  await tonConnectUI.connectWallet();
};

tonConnectUI.onStatusChange(wallet => {
  if (wallet) {
    tg.sendData(JSON.stringify({
      action: "wallet_connected",
      address: wallet.account.address
    }));
  }
});
