const starfield = document.querySelector('#starfield');
const context = starfield.getContext('2d');
const stars = Array.from({ length: 150 }, () => ({ x: Math.random(), y: Math.random(), radius: Math.random() * 1.5 + 0.2, opacity: Math.random() * 0.7 + 0.2 }));

function drawStars() {
    starfield.width = window.innerWidth;
    starfield.height = window.innerHeight;
    context.clearRect(0, 0, starfield.width, starfield.height);
    stars.forEach(star => {
        context.beginPath();
        context.fillStyle = `rgba(190, 215, 255, ${star.opacity})`;
        context.arc(star.x * starfield.width, star.y * starfield.height, star.radius, 0, Math.PI * 2);
        context.fill();
    });
}

window.addEventListener('resize', drawStars);
drawStars();

const filters = document.querySelectorAll('.filter');
const missionCards = document.querySelectorAll('.mission-card');
filters.forEach(filter => filter.addEventListener('click', () => {
    filters.forEach(item => item.classList.remove('active'));
    filter.classList.add('active');
    const selected = filter.dataset.filter;
    missionCards.forEach(card => {
        card.hidden = selected !== 'all' && card.dataset.status !== selected;
    });
}));

const worldData = {
    mars: { title: 'Mars', coordinate: "18° 39' N / 226° 12' E", description: 'A rust-colored archive of ancient water, dramatic dust fronts, and the clearest sunset in the system.', temp: '−63°C', gravity: '3.71 m/s²', delay: '04:32 min', className: 'mars-image' },
    europa: { title: 'Europa', coordinate: "23° 41' S / 14° 08' W", description: 'A frozen ocean world where a saltwater sea may be moving beneath the brightest ice in space.', temp: '−160°C', gravity: '1.31 m/s²', delay: '33:14 min', className: 'europa-image' },
    titan: { title: 'Titan', coordinate: "07° 12' N / 198° 43' E", description: 'Amber haze, methane rain, and coastlines carved by chemistry unlike anything on Earth.', temp: '−179°C', gravity: '1.35 m/s²', delay: '01:23 hr', className: 'titan-image' }
};

const worldDetail = document.querySelector('#world-detail');
document.querySelectorAll('.world-tab').forEach(tab => tab.addEventListener('click', () => {
    const world = worldData[tab.dataset.world];
    document.querySelectorAll('.world-tab').forEach(item => {
        item.classList.toggle('active', item === tab);
        item.setAttribute('aria-selected', String(item === tab));
    });
    worldDetail.querySelector('.world-image').className = `world-image ${world.className}`;
    worldDetail.querySelector('.world-coordinate').textContent = world.coordinate;
    worldDetail.querySelector('h3').innerHTML = `${world.title} <em>/ Sol IV</em>`;
    document.querySelector('#world-description').textContent = world.description;
    document.querySelector('#world-temp').textContent = world.temp;
    document.querySelector('#world-gravity').textContent = world.gravity;
    document.querySelector('#world-delay').textContent = world.delay;
}));

let secondsRemaining = 4 * 60 * 60 + 18 * 60 + 32;
const countdown = document.querySelector('#countdown');
setInterval(() => {
    secondsRemaining = Math.max(0, secondsRemaining - 1);
    const hours = String(Math.floor(secondsRemaining / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((secondsRemaining % 3600) / 60)).padStart(2, '0');
    const seconds = String(secondsRemaining % 60).padStart(2, '0');
    countdown.textContent = `${hours}:${minutes}:${seconds}`;
}, 1000);

const signalMessages = [
    'Asteria IX just crossed the Helios relay.',
    'Europa probe returned a clean subsurface scan.',
    'Solace Array mirrors are holding formation.',
    'Lumen Drift sample capsule is on a stable trajectory.'
];
const signalStrip = document.querySelector('.signal-strip');
const signalMessage = document.querySelector('#signal-message');
const scanButton = document.querySelector('#scan-button');
let signalIndex = 0;

setInterval(() => {
    signalIndex = (signalIndex + 1) % signalMessages.length;
    signalMessage.textContent = signalMessages[signalIndex];
}, 6000);

scanButton.addEventListener('click', () => {
    signalStrip.classList.add('scanning');
    scanButton.disabled = true;
    scanButton.innerHTML = 'Scanning sector... <span>◌</span>';
    signalMessage.textContent = 'Sweeping the dark side of the system for new signals.';
    setTimeout(() => {
        signalStrip.classList.remove('scanning');
        signalMessage.textContent = 'New signal acquired: Titan relay is online.';
        scanButton.disabled = false;
        scanButton.innerHTML = 'Run sensor sweep <span>↗</span>';
    }, 1800);
});

const modal = document.querySelector('#mission-modal');
const modalCopy = document.querySelector('#modal-copy');
document.querySelectorAll('.mission-open').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.mission-card');
    const mission = card.dataset.mission;
    document.querySelector('#modal-title').textContent = mission;
    modalCopy.textContent = `${mission} is transmitting clean telemetry. Navigation, life support, and scientific payload are all within expected parameters.`;
    modal.hidden = false;
}));

document.querySelector('#modal-close').addEventListener('click', () => { modal.hidden = true; });
modal.addEventListener('click', event => { if (event.target === modal) modal.hidden = true; });
document.addEventListener('keydown', event => { if (event.key === 'Escape') modal.hidden = true; });

document.querySelector('#briefing-button').addEventListener('click', () => document.querySelector('#briefing').scrollIntoView({ behavior: 'smooth' }));
document.querySelector('#briefing-form').addEventListener('submit', event => {
    event.preventDefault();
    document.querySelector('#form-message').textContent = 'Transmission received. Watch your inbox for the next signal.';
    event.target.reset();
});
