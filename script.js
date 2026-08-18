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
    mars: { title: 'Mars', coordinate: "18° 39' N / 226° 12' E", description: 'A rust-colored archive of ancient water, dramatic dust fronts, and the clearest sunset in the system.', temp: '−63°C', gravity: '3.71 m/s²', delay: '04:32 min', image: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg' },
    europa: { title: 'Europa', coordinate: "23° 41' S / 14° 08' W", description: 'A frozen ocean world where a saltwater sea may be moving beneath the brightest ice in space.', temp: '−160°C', gravity: '1.31 m/s²', delay: '33:14 min', image: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Europa-moon.jpg' },
    titan: { title: 'Titan', coordinate: "07° 12' N / 198° 43' E", description: 'Amber haze, methane rain, and coastlines carved by chemistry unlike anything on Earth.', temp: '−179°C', gravity: '1.35 m/s²', delay: '01:23 hr', image: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Titan_in_true_color.jpg' }
};

const worldDetail = document.querySelector('#world-detail');
document.querySelectorAll('.world-tab').forEach(tab => tab.addEventListener('click', () => {
    const world = worldData[tab.dataset.world];
    document.querySelectorAll('.world-tab').forEach(item => {
        item.classList.toggle('active', item === tab);
        item.setAttribute('aria-selected', String(item === tab));
    });
    const worldImage = worldDetail.querySelector('#world-image');
    worldImage.src = world.image;
    worldImage.alt = `${world.title} photographed in natural color`;
    worldDetail.querySelector('.world-coordinate').textContent = world.coordinate;
    worldDetail.querySelector('h3').innerHTML = `${world.title} <em>/ Sol IV</em>`;
    document.querySelector('#world-description').textContent = world.description;
    document.querySelector('#world-temp').textContent = world.temp;
    document.querySelector('#world-gravity').textContent = world.gravity;
    document.querySelector('#world-delay').textContent = world.delay;
}));

const routeData = {
    mars: { title: 'Mars', code: 'SOL IV', copy: 'Asteria IX is receiving a clean relay from the red planet survey corridor.', distance: '225M km', status: '● Active' },
    europa: { title: 'Europa', code: 'JUPITER II', copy: 'The Europa probe is preparing a low-altitude pass over the fractured ice fields.', distance: '628M km', status: '● Active' },
    titan: { title: 'Titan', code: 'SATURN VI', copy: 'A deep-space relay has just come online beyond Saturn\'s rings.', distance: '1.4B km', status: '● Signal acquired' },
    asteria: { title: 'Asteria IX', code: 'AX-09', copy: 'Blue-moon survey craft currently crossing the Helios relay on a high-inclination route.', distance: '384M km', status: '● Active' },
    solace: { title: 'Solace Array', code: 'SA-03', copy: 'Solar mirror deployment is holding formation at the edge of Mercury\'s shadow.', distance: '72M km', status: '● Active' }
};
const routeDetail = document.querySelector('#route-detail');
document.querySelectorAll('.map-node, .ship-node').forEach(node => node.addEventListener('click', () => {
    const route = routeData[node.dataset.route];
    document.querySelectorAll('.map-node, .ship-node').forEach(item => item.classList.toggle('selected', item === node));
    document.querySelector('#route-title').innerHTML = `${route.title} <em>/ ${route.code}</em>`;
    document.querySelector('#route-copy').textContent = route.copy;
    document.querySelector('#route-distance').textContent = route.distance;
    document.querySelector('#route-status').textContent = route.status;
    routeDetail.classList.remove('route-flash');
    void routeDetail.offsetWidth;
    routeDetail.classList.add('route-flash');
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
const missionDetails = {
    'Asteria IX': { code: 'AX-09 / ACTIVE', objective: 'Ice canyon mapping', position: 'Helios relay 04', crew: 'Autonomous probe' },
    'Solace Array': { code: 'SA-03 / ACTIVE', objective: 'Solar mirror deployment', position: "Mercury shadow line", crew: '12 orbital units' },
    'Lumen Drift': { code: 'LD-21 / COMPLETE', objective: 'Deep-space sample return', position: 'Earth recovery orbit', crew: 'Lumen capsule' }
};
document.querySelectorAll('.mission-open').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.mission-card');
    const mission = card.dataset.mission;
    const detail = missionDetails[mission];
    document.querySelector('#modal-title').textContent = mission;
    document.querySelector('#modal-code').textContent = detail.code;
    document.querySelector('#modal-objective').textContent = detail.objective;
    document.querySelector('#modal-position').textContent = detail.position;
    document.querySelector('#modal-crew').textContent = detail.crew;
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
