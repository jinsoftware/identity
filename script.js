let balance = 1000;
let multiplier = 1.00;
let inFlight = false;
let interval, planeInterval;
let planePos = 0;
let bets = { A: null, B: null };
const plane = document.getElementById('plane');

function updateUI() {
  document.getElementById('balance').innerText = `Wallet: ₹${balance.toFixed(2)}`;
  document.getElementById('multiplier').innerText = `x${multiplier.toFixed(2)}`;
}

function updateHistory(value) {
  const history = document.getElementById('history');
  const dot = document.createElement('div');
  dot.className = 'dot';
  dot.style.background = value >= 2 ? '#00ff90' : '#ff5050';
  if (history.children.length >= 10) history.removeChild(history.firstChild);
  history.appendChild(dot);
}

function placeBet(type) {
  if (!inFlight && bets[type] === null) {
    const input = document.getElementById(`betAmount${type}`);
    const amount = parseFloat(input.value);
    if (isNaN(amount) || amount < 1 || amount > balance) return alert("Invalid amount");
    balance -= amount;
    bets[type] = { amount: amount, active: true };
    document.getElementById('log').innerText = `✅ Bet ${type} placed: ₹${amount}`;
    updateUI();
  }
}

function cashOut(type) {
  if (inFlight && bets[type]?.active) {
    const win = bets[type].amount * multiplier;
    balance += win;
    document.getElementById('log').innerText = `🏆 Bet ${type} cashed at x${multiplier.toFixed(2)} → ₹${win.toFixed(2)}`;
    bets[type].active = false;
    updateUI();
  }
}

function startPlane() {
  planePos = 0;
  plane.style.left = '0px';
  planeInterval = setInterval(() => {
    planePos += 5;
    plane.style.left = planePos + 'px';
  }, 100);
}

function startFlight() {
  multiplier = 1.0;
  inFlight = true;
  updateUI();
  startPlane();
  interval = setInterval(() => {
    multiplier += 0.05;
    updateUI();
    if (multiplier >= Math.random() * 10 + 1.5) crash();
  }, 100);
}

function crash() {
  clearInterval(interval);
  clearInterval(planeInterval);
  document.getElementById('blastSound').play();
  Object.keys(bets).forEach(key => {
    if (bets[key]?.active) {
      document.getElementById('log').innerText = `💥 Bet ${key} lost at x${multiplier.toFixed(2)}. Amount: ₹${bets[key].amount}`;
    }
    bets[key] = null;
  });
  updateHistory(multiplier);
  inFlight = false;
  plane.style.left = '0px';
  countdownStart();
}

function countdownStart() {
  let counter = 5;
  const cd = document.getElementById('countdown');
  cd.innerText = `Next flight in ${counter}s`;
  const timer = setInterval(() => {
    counter--;
    if (counter > 0) cd.innerText = `Next flight in ${counter}s`;
    else {
      clearInterval(timer);
      cd.innerText = '';
      startFlight();
    }
  }, 1000);
}

window.countdownStart = countdownStart; // allow call from index.html
window.placeBet = placeBet;
window.cashOut = cashOut;
