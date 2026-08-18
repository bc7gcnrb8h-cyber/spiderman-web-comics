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
let selectedRoute = 'asteria';
document.querySelectorAll('.map-node, .ship-node').forEach(node => node.addEventListener('click', () => {
    const route = routeData[node.dataset.route];
    selectedRoute = node.dataset.route;
    document.querySelectorAll('.map-node, .ship-node').forEach(item => item.classList.toggle('selected', item === node));
    document.querySelector('#route-title').innerHTML = `${route.title} <em>/ ${route.code}</em>`;
    document.querySelector('#route-copy').textContent = route.copy;
    document.querySelector('#route-distance').textContent = route.distance;
    document.querySelector('#route-status').textContent = route.status;
    routeDetail.classList.remove('route-flash');
    void routeDetail.offsetWidth;
    routeDetail.classList.add('route-flash');
}));
document.querySelector('#route-action').addEventListener('click', () => {
    const missionName = { solace: 'Solace Array', asteria: 'Asteria IX' }[selectedRoute] || 'Asteria IX';
    openMissionDetails(missionName);
});

const planetData = {
    mercury: { name: 'Mercury', description: 'A fast, cratered world where daylight burns and shadow freezes.', time: '3 months', risk: 'High', window: 'Open in 18 days', temp: '167°C' },
    mars: { name: 'Mars', description: 'A red-world expedition through ancient riverbeds and towering dust fronts.', time: '7 months', risk: 'Moderate', window: 'Open now', temp: '−63°C' },
    europa: { name: 'Europa', description: 'A frozen ocean world with a hidden sea beneath fractured ice.', time: '6 years', risk: 'High', window: 'Open in 4 months', temp: '−160°C' },
    titan: { name: 'Titan', description: 'Amber haze, methane rain, and shorelines carved by alien chemistry.', time: '7 years', risk: 'Extreme', window: 'Open in 2 years', temp: '−179°C' }
};
const planetScores = { mercury: 42, mars: 68, europa: 54, titan: 31 };
let selectedPlanet = 'mars';
let savedDestinations = JSON.parse(localStorage.getItem('orbital-destinations') || '[]');
const commandTitle = document.querySelector('#command-title');
const commandDescription = document.querySelector('#command-description');
const commandTime = document.querySelector('#command-time');
const commandRisk = document.querySelector('#command-risk');
const commandWindow = document.querySelector('#command-window');
const favoriteButton = document.querySelector('#favorite-button');

function updateCommandPanel() {
    const planet = planetData[selectedPlanet];
    commandTitle.textContent = planet.name;
    commandDescription.textContent = planet.description;
    commandTime.textContent = planet.time;
    commandRisk.textContent = planet.risk;
    commandWindow.textContent = planet.window;
    favoriteButton.innerHTML = `${savedDestinations.includes(selectedPlanet) ? 'Saved destination' : 'Save destination'} <span>${savedDestinations.includes(selectedPlanet) ? '★' : '☆'}</span>`;
    document.querySelectorAll('.system-planet').forEach(item => item.classList.toggle('selected', item.dataset.planet === selectedPlanet));
}

document.querySelectorAll('.system-planet').forEach(planet => planet.addEventListener('click', () => {
    selectedPlanet = planet.dataset.planet;
    updateCommandPanel();
}));
favoriteButton.addEventListener('click', () => {
    savedDestinations = savedDestinations.includes(selectedPlanet) ? savedDestinations.filter(item => item !== selectedPlanet) : [...savedDestinations, selectedPlanet];
    localStorage.setItem('orbital-destinations', JSON.stringify(savedDestinations));
    updateCommandPanel();
});

function updateComparison() {
    const first = planetData[document.querySelector('#compare-one').value];
    const second = planetData[document.querySelector('#compare-two').value];
    const firstKey = document.querySelector('#compare-one').value;
    const secondKey = document.querySelector('#compare-two').value;
    document.querySelector('#comparison-result').innerHTML = `<div><span>Travel time</span><b style="--score:${planetScores[firstKey]}%">${first.name}: ${first.time}</b><b style="--score:${planetScores[secondKey]}%">${second.name}: ${second.time}</b></div><div><span>Surface temperature</span><b>${first.name}: ${first.temp}</b><b>${second.name}: ${second.temp}</b></div><div><span>Risk profile</span><b>${first.name}: ${first.risk}</b><b>${second.name}: ${second.risk}</b></div>`;
    const winner = planetScores[firstKey] >= planetScores[secondKey] ? first.name : second.name;
    document.querySelector('#comparison-verdict').textContent = `${winner} has the stronger survey profile for a first expedition.`;
}
document.querySelectorAll('#compare-one, #compare-two').forEach(select => select.addEventListener('change', updateComparison));
updateComparison();

const budgetInput = document.querySelector('#planner-budget');
const budgetValue = document.querySelector('#budget-value');
budgetInput.addEventListener('input', () => { budgetValue.value = `${budgetInput.value}%`; budgetValue.textContent = `${budgetInput.value}%`; });

document.querySelector('#planner-form').addEventListener('submit', event => {
    event.preventDefault();
    const destination = document.querySelector('#planner-destination').value;
    const payload = document.querySelector('#planner-payload').value.toLowerCase();
    const planet = Object.values(planetData).find(item => item.name === destination);
    const missionId = `OR-${Math.floor(Math.random() * 80 + 20)}`;
    const ambition = Number(budgetInput.value);
    const readiness = ambition >= 75 ? 'Bold expedition' : ambition >= 45 ? 'Balanced expedition' : 'Reconnaissance flight';
    document.querySelector('#planner-result').innerHTML = `<span class="eyebrow">PROFILE ${missionId} / READY TO REVIEW</span><strong>${readiness}: ${destination}</strong><span>${payload} · ${planet.time} transit · ${planet.risk} risk · ${ambition}% ambition</span>`;
});

let soundEnabled = false;
let audioContext;
document.querySelector('#sound-toggle').addEventListener('click', event => {
    soundEnabled = !soundEnabled;
    event.currentTarget.setAttribute('aria-pressed', String(soundEnabled));
    event.currentTarget.innerHTML = `${soundEnabled ? 'Sound on' : 'Sound off'} <span>${soundEnabled ? '◉' : '◌'}</span>`;
    if (soundEnabled) {
        audioContext = audioContext || new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.frequency.value = 480;
        gain.gain.setValueAtTime(.04, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .22);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + .22);
    }
});
updateCommandPanel();

const crewForm = document.querySelector('#crew-form');
const callSignInput = document.querySelector('#call-sign');
const crewWelcome = document.querySelector('#crew-welcome');
const launchCard = document.querySelector('.launch-card');
const launchButton = document.querySelector('#launch-button');
const launchCopy = document.querySelector('#launch-copy');
const challengeStatus = document.querySelector('#challenge-status');
const alertList = document.querySelector('#alert-list');
const achievementState = JSON.parse(localStorage.getItem('orbital-achievements') || '[]');
const badgeLabels = ['crew', 'launch', 'save', 'compare'];

function unlockAchievement(name) {
    if (!achievementState.includes(name)) achievementState.push(name);
    localStorage.setItem('orbital-achievements', JSON.stringify(achievementState));
    document.querySelectorAll('#badges span').forEach((badge, index) => badge.classList.toggle('unlocked', achievementState.includes(badgeLabels[index])));
    document.querySelector('#achievement-count').textContent = `${achievementState.length} / 4 unlocked`;
    const rank = achievementState.length >= 4 ? 'Legendary mission commander' : achievementState.length >= 2 ? 'Flight lead' : achievementState.length >= 1 ? 'Cadet explorer' : 'Unassigned crew';
    document.querySelector('#rank-label').textContent = rank;
}

function addAlert(message) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    alertList.innerHTML = `<p class="alert-line"><span>${time}</span> ${message}</p>` + alertList.innerHTML;
}

crewForm.addEventListener('submit', event => {
    event.preventDefault();
    const callSign = callSignInput.value.trim();
    localStorage.setItem('orbital-call-sign', callSign);
    crewWelcome.textContent = `Welcome aboard, Commander ${callSign}. Your station is ready.`;
    challengeStatus.textContent = `Commander ${callSign} assigned`;
    launchCopy.textContent = 'Crew confirmed. The launch window is yours.';
    unlockAchievement('crew');
    addAlert(`Commander ${callSign} has joined the Asteria IX crew.`);
});

const savedCallSign = localStorage.getItem('orbital-call-sign');
if (savedCallSign) { callSignInput.value = savedCallSign; crewWelcome.textContent = `Welcome back, Commander ${savedCallSign}.`; challengeStatus.textContent = `Commander ${savedCallSign} assigned`; }

launchButton.addEventListener('click', () => {
    launchCard.classList.remove('launching');
    void launchCard.offsetWidth;
    launchCard.classList.add('launching');
    launchButton.disabled = true;
    launchButton.innerHTML = 'Launching... <span>↗</span>';
    challengeStatus.textContent = 'Launch sequence active';
    addAlert('Asteria IX launch sequence has begun.');
    setTimeout(() => { launchCopy.textContent = 'Asteria IX is away. Telemetry is clean.'; launchButton.disabled = false; launchButton.innerHTML = 'Launch again <span>↗</span>'; challengeStatus.textContent = 'Mission in progress'; unlockAchievement('launch'); addAlert('Asteria IX has cleared the atmosphere.'); }, 1800);
});

const anomalies = ['A repeating pulse is hiding inside the Titan relay.', 'Asteria IX detected a temporary gravity wave.', 'Unknown ice geometry found beneath Europa sector 7.', 'A soft blue signal is echoing beyond the mapped system.'];
document.querySelector('#anomaly-button').addEventListener('click', event => {
    event.currentTarget.textContent = 'Scanning...';
    event.currentTarget.disabled = true;
    setTimeout(() => { addAlert(anomalies[Math.floor(Math.random() * anomalies.length)]); event.currentTarget.textContent = 'Scan anomaly'; event.currentTarget.disabled = false; unlockAchievement('compare'); }, 900);
});

if (savedDestinations.length) unlockAchievement('save');
document.querySelectorAll('#compare-one, #compare-two').forEach(select => select.addEventListener('change', () => unlockAchievement('compare')));
document.querySelectorAll('#badges span').forEach((badge, index) => badge.classList.toggle('unlocked', achievementState.includes(badgeLabels[index])));
document.querySelector('#achievement-count').textContent = `${achievementState.length} / 4 unlocked`;
const initialRank = achievementState.length >= 4 ? 'Legendary mission commander' : achievementState.length >= 2 ? 'Flight lead' : achievementState.length >= 1 ? 'Cadet explorer' : 'Unassigned crew';
document.querySelector('#rank-label').textContent = initialRank;

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
const academyContent = {
    rockets: [
        { icon: 'SV', code: 'SATURN V', title: 'Saturn V', text: 'The giant launch vehicle that carried Apollo astronauts toward the Moon. Its three stages built the speed needed to leave Earth.', label: 'Heavy-lift launch vehicle' },
        { icon: 'F9', code: 'FALCON 9', title: 'Falcon 9', text: 'A partially reusable rocket designed to carry satellites and crew. Its first stage can return and land for another flight.', label: 'Reusable orbital rocket' },
        { icon: 'JW', code: 'ARIANE 5', title: 'Ariane 5', text: 'A powerful European launcher that placed many scientific spacecraft into orbit, including the James Webb Space Telescope.', label: 'Science mission launcher' }
    ],
    missions: [
        { icon: 'AP', code: 'APOLLO 11', title: 'Apollo 11', text: 'In 1969, humans landed on the Moon for the first time. The mission combined a Saturn V, lunar module, and precise navigation.', label: 'First crewed lunar landing' },
        { icon: 'JW', code: 'JWST', title: 'James Webb', text: 'The James Webb Space Telescope studies distant galaxies and exoplanet atmospheres using infrared light beyond Earth\'s atmosphere.', label: 'Deep-space observatory' },
        { icon: 'VG', code: 'VOYAGER 1', title: 'Voyager 1', text: 'Launched in 1977, Voyager 1 visited the outer planets and continues sending faint signals from interstellar space.', label: 'Longest-distance explorer' }
    ],
    facts: [
        { icon: '01', code: 'ORBIT', title: 'Falling forever', text: 'An orbiting spacecraft is constantly falling toward a planet, but it moves sideways fast enough to keep missing it.', label: 'Orbital mechanics' },
        { icon: '02', code: 'LIGHT', title: 'Looking back in time', text: 'Light takes time to travel. When we see a distant galaxy, we are seeing it as it was millions or billions of years ago.', label: 'Cosmic perspective' },
        { icon: '03', code: 'SOUND', title: 'Silent space', text: 'Sound needs matter to travel, so explosions in the vacuum of space would be visually dramatic but completely silent.', label: 'The vacuum' }
    ]
};
const factMessages = ['A rocket accelerates by throwing mass in the opposite direction.', 'One day on Venus is longer than one Venusian year.', 'Mars sunsets can appear blue because of the way dust scatters light.', 'The International Space Station circles Earth roughly every 90 minutes.'];
function renderAcademy(topic) {
    document.querySelector('#academy-grid').innerHTML = academyContent[topic].map(card => `<article class="academy-card" data-code="${card.code}"><div class="academy-icon">${card.icon}</div><h3>${card.title}</h3><p>${card.text}</p><small>${card.label}</small></article>`).join('');
}
document.querySelectorAll('.academy-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.academy-tab').forEach(item => { item.classList.toggle('active', item === tab); item.setAttribute('aria-selected', String(item === tab)); });
    renderAcademy(tab.dataset.academy);
}));
let factIndex = 0;
document.querySelector('#next-fact').addEventListener('click', () => { factIndex = (factIndex + 1) % factMessages.length; document.querySelector('#academy-fact strong').textContent = factMessages[factIndex]; });
renderAcademy('rockets');
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
function openMissionDetails(mission) {
    const detail = missionDetails[mission];
    if (!detail) return;
    document.querySelector('#modal-title').textContent = mission;
    document.querySelector('#modal-code').textContent = detail.code;
    document.querySelector('#modal-objective').textContent = detail.objective;
    document.querySelector('#modal-position').textContent = detail.position;
    document.querySelector('#modal-crew').textContent = detail.crew;
    modalCopy.textContent = `${mission} is transmitting clean telemetry. Navigation, life support, and scientific payload are all within expected parameters.`;
    modal.hidden = false;
}
document.querySelectorAll('.mission-open').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.mission-card');
    const mission = card.dataset.mission;
    openMissionDetails(mission);
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
