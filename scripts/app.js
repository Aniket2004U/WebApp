const moodCards = document.querySelectorAll('.mood-card');
const moodResponse = document.getElementById('mood-response');
const scrollButtons = document.querySelectorAll('[data-scroll]');
const messageBtn = document.getElementById('message-btn');
const wishBtn = document.getElementById('wish-btn');
const surpriseMessage = document.getElementById('surprise-message');
const loveButton = document.getElementById('love-button');
const loveCount = document.getElementById('love-count');
const burstLayer = document.getElementById('burst-layer');

let loveTotal = 0;
let surpriseTimeout;

const wishNotes = [
  'Wish granted: endless forehead kisses queued and on their way.',
  'The universe just texted back. It said you are its favorite daydream.',
  'Fate is busy arranging candlelight clouds for you right now.',
  'Consider this wish wrapped in velvet skies and shooting stars.'
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

moodCards.forEach((card) => {
  card.addEventListener('click', () => {
    moodCards.forEach((item) => item.classList.remove('active'));
    card.classList.add('active');
    const message = card.dataset.message;
    if (message && moodResponse) {
      moodResponse.textContent = message;
    }
    spawnBurst(card.getBoundingClientRect());
  });
});

messageBtn?.addEventListener('click', () => {
  revealSurprise('I hope you rested today. If not, you can rest inside my arms.');
});

wishBtn?.addEventListener('click', () => {
  const text = wishNotes[Math.floor(Math.random() * wishNotes.length)];
  revealSurprise(text);
});

loveButton?.addEventListener('click', (event) => {
  loveTotal += Math.floor(Math.random() * 7) + 3;
  if (loveCount) {
    loveCount.textContent = loveTotal.toString();
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

// Cursor-driven tilt for the hero card and general parallax mood.
document.addEventListener('pointermove', (event) => {
  const { clientX, clientY } = event;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const offsetX = ((clientX - centerX) / centerX) * 8;
  const offsetY = ((clientY - centerY) / centerY) * 8;
  document.documentElement.style.setProperty('--tilt-x', `${offsetY}deg`);
  document.documentElement.style.setProperty('--tilt-y', `${offsetX}deg`);
});

const polaroids = document.querySelectorAll('.polaroid-grid figure');
polaroids.forEach((figure) => {
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

const heroCard = document.querySelector('.hero-card');
if (heroCard) {
  setInterval(() => {
    heroCard.style.setProperty(
      'transform',
      'rotate3d(1, 0, 0, var(--tilt-x, 0deg)) rotate3d(0, 1, 0, var(--tilt-y, 0deg)) translateY(0)'
    );
  }, 120);
}
