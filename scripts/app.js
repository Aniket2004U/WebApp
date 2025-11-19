const capabilityCards = document.querySelectorAll('.mood-card');
const capabilityResponse = document.getElementById('skill-response');
const scrollButtons = document.querySelectorAll('[data-scroll]');
const statusBtn = document.getElementById('message-btn');
const chatBtn = document.getElementById('wish-btn');
const surpriseMessage = document.getElementById('surprise-message');
const metricButton = document.getElementById('metric-button');
const metricCount = document.getElementById('metric-count');
const burstLayer = document.getElementById('burst-layer');

let metricTotal = 0;
let surpriseTimeout;

const chatNotes = [
  'Shipping a SmartNIC prototype that parses FIX in programmable logic.',
  'Currently profiling BRAM usage on a 25G feed handler demo.',
  'Sketching a multi-clock design for a risk-check FPGA service.',
  'Running regression sims with cocotb + Questa this evening.'
];

const availabilityNotes = [
  'Spinning up lab time and available for collaborations next week.',
  'In research mode but open for exploratory chats after 6pm GMT.',
  'Bench is warm and I can take on part-time design reviews now.',
  'Lab booked for latency benchmarks; happy to sync between runs.'
];

const revealSurprise = (text) => {
  if (!surpriseMessage) return;
  surpriseMessage.textContent = text;
  surpriseMessage.classList.add('is-visible');
  clearTimeout(surpriseTimeout);
  surpriseTimeout = setTimeout(() => {
    surpriseMessage.classList.remove('is-visible');
  }, 5200);
};

scrollButtons.forEach((btn) => {
  btn.addEventListener('click', (event) => {
    const target = btn.getAttribute('data-scroll');
    if (!target) return;
    event.preventDefault();
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

capabilityCards.forEach((card) => {
  card.addEventListener('click', () => {
    capabilityCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
    const message = card.dataset.message;
    if (message && capabilityResponse) {
      capabilityResponse.textContent = message;
    }
    spawnBurst(card.getBoundingClientRect());
  });
});

statusBtn?.addEventListener('click', () => {
  const text = availabilityNotes[Math.floor(Math.random() * availabilityNotes.length)];
  revealSurprise(text);
});

chatBtn?.addEventListener('click', () => {
  const text = chatNotes[Math.floor(Math.random() * chatNotes.length)];
  revealSurprise(text);
});

metricButton?.addEventListener('click', (event) => {
  metricTotal += Math.floor(Math.random() * 7) + 3;
  if (metricCount) {
    metricCount.textContent = metricTotal.toString();
  }
  const bounds = event.currentTarget.getBoundingClientRect();
  spawnBurst(bounds);
});

function spawnBurst(bounds) {
  if (!burstLayer || !bounds) return;
  const count = 10;
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement('span');
    const x = bounds.left + bounds.width / 2 + randomBetween(-60, 60);
    const y = bounds.top + bounds.height / 2 + randomBetween(-40, 40);
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.animationDuration = `${randomBetween(1500, 2400)}ms`;
    heart.style.transform = `translate(-50%, -50%) scale(${randomBetween(80, 140) / 100})`;
    burstLayer.appendChild(heart);
    setTimeout(() => heart.remove(), 2200);
  }
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Cursor-driven tilt for devices with fine pointers, disabled on touch screens.
const heroCard = document.querySelector('.hero-card');
const pointerFineQuery = window.matchMedia('(pointer: fine)');
let tiltEnabled = false;
let heroCardInterval;

const handlePointerMove = (event) => {
  const { clientX, clientY } = event;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const offsetX = ((clientX - centerX) / centerX) * 8;
  const offsetY = ((clientY - centerY) / centerY) * 8;
  document.documentElement.style.setProperty('--tilt-x', `${offsetY}deg`);
  document.documentElement.style.setProperty('--tilt-y', `${offsetX}deg`);
};

const enableTiltEffects = () => {
  if (tiltEnabled) return;
  tiltEnabled = true;
  document.addEventListener('pointermove', handlePointerMove);
  if (heroCard && !heroCardInterval) {
    heroCardInterval = setInterval(() => {
      heroCard.style.setProperty(
        'transform',
        'rotate3d(1, 0, 0, var(--tilt-x, 0deg)) rotate3d(0, 1, 0, var(--tilt-y, 0deg)) translateY(0)'
      );
    }, 120);
  }
};

const disableTiltEffects = () => {
  if (!tiltEnabled) return;
  tiltEnabled = false;
  document.removeEventListener('pointermove', handlePointerMove);
  if (heroCardInterval) {
    clearInterval(heroCardInterval);
    heroCardInterval = null;
  }
  if (heroCard) {
    heroCard.style.removeProperty('transform');
  }
};

const handlePointerPreferenceChange = (event) => {
  if (event.matches) {
    enableTiltEffects();
  } else {
    disableTiltEffects();
  }
};

if (pointerFineQuery.matches) {
  enableTiltEffects();
} else {
  disableTiltEffects();
}

if (typeof pointerFineQuery.addEventListener === 'function') {
  pointerFineQuery.addEventListener('change', handlePointerPreferenceChange);
} else if (typeof pointerFineQuery.addListener === 'function') {
  pointerFineQuery.addListener(handlePointerPreferenceChange);
}

const projectShots = document.querySelectorAll('.polaroid-grid figure');
projectShots.forEach((figure) => {
  const computed = window.getComputedStyle(figure).transform;
  figure.dataset.initial = computed === 'none' ? '' : computed;
  figure.addEventListener('mouseenter', () => {
    figure.style.transition = 'transform 0.4s ease';
    const base = figure.dataset.initial && figure.dataset.initial !== 'none' ? figure.dataset.initial : '';
    figure.style.transform = `${base} translateY(-8px)`;
  });
  figure.addEventListener('mouseleave', () => {
    figure.style.transition = 'transform 0.4s ease';
    figure.style.transform = figure.dataset.initial && figure.dataset.initial !== 'none' ? figure.dataset.initial : '';
  });
});
