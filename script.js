let balance = 1000;
let multiplier = 1.00;
let interval;
let planeInterval;
let inFlight = false;
let betPlaced = false;
let betAmount = 0;
let planePosition = 0;

const plane = document.getElementById('plane');

function updateUI() {
  document.getElementById('balance').innerText = `Wallet: ₹${balance.toFixed(2)}`;
  document.getElementById('multiplier').innerText = `x${multiplier.toFixed(2)}`;
}

function animatePlane() {
  planePosition = 0;
  plane.style.left = '0px';
  planeInterval = setInterval(() => {
    planePosition += 5;
    plane.style.left = planePosition + 'px';
  }, 100);
}

function startFlight() {
  multiplier = 1.00;
  inFlight = true;
  updateUI();
  animatePlane();
  interval = setInterval(() => {
    multiplier += 0.05;
    updateUI();
    if (multiplier >= Math.random() * 10 + 1.5) {
      crash();
    }
  }, 100);
}

function crash() {
  clearInterval(interval);
  clearInterval(planeInterval);
  inFlight = false;
  document.getElementById('blastSound').play();
  if (betPlaced) {
    document.getElementById('log').innerText = `💥 Plane crashed at x${multiplier.toFixed(2)}. You lost ₹${betAmount}`;
    betPlaced = false;
    betAmount = 0;
    updateUI();
  } else {
    document.getElementById('log').innerText = `💥 Plane crashed at x${multiplier.toFixed(2)}`;
  }
  plane.style.left = '0px';
  setTimeout(startFlight, 3000);
}

function placeBet() {
  if (!inFlight && !betPlaced) {
    betAmount = parseFloat(document.getElementById('betAmount').value);
    if (isNaN(betAmount) || betAmount < 1 || betAmount > balance) {
      alert("Invalid bet amount");
      return;
    }
    balance -= betAmount;
    betPlaced = true;
    document.getElementById('log').innerText = `✅ Bet placed: ₹${betAmount}`;
    updateUI();
  } else {
    alert("Can't bet during flight or duplicate bet");
  }
}

function cashOut() {
  if (inFlight && betPlaced) {
    const winAmount = betAmount * multiplier;
    balance += winAmount;
    document.getElementById('log').innerText = `🏆 Cashed out at x${multiplier.toFixed(2)}. You won ₹${winAmount.toFixed(2)}`;
    betPlaced = false;
    betAmount = 0;
    updateUI();
  } else {
    alert("No active bet to cash out");
  }
}

window.onload = startFlight;
