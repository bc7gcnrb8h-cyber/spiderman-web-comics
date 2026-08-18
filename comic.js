const pages = [...document.querySelectorAll('.comic-page')];
const pageBreaks = [...document.querySelectorAll('.page-break')];
const modeButton = document.querySelector('#reader-mode');
const previousButton = document.querySelector('#previous-page');
const nextButton = document.querySelector('#next-page');
const fullscreenButton = document.querySelector('#fullscreen-mode');
const pageLabel = document.querySelector('#page-label');
const pageProgress = document.querySelector('#page-progress');

let focusMode = false;
let currentPage = 0;

function updateReader() {
    pages.forEach((page, index) => {
        page.hidden = focusMode && index !== currentPage;
    });

    pageBreaks.forEach((breakElement, index) => {
        breakElement.hidden = focusMode && index !== currentPage;
    });

    previousButton.disabled = !focusMode || currentPage === 0;
    nextButton.disabled = !focusMode || currentPage === pages.length - 1;
    pageLabel.textContent = focusMode ? `Page ${currentPage + 1} of ${pages.length}` : 'All pages';
    pageProgress.value = focusMode ? currentPage + 1 : pages.length;
    modeButton.textContent = focusMode ? 'Exit Focus' : 'Focus Reader';
    modeButton.setAttribute('aria-pressed', String(focusMode));
}

function goToPage(pageIndex) {
    currentPage = Math.max(0, Math.min(pageIndex, pages.length - 1));
    updateReader();
    if (focusMode) {
        document.querySelector('.comic-header').scrollIntoView({ behavior: 'smooth' });
    }
}

modeButton.addEventListener('click', () => {
    focusMode = !focusMode;
    updateReader();
});

previousButton.addEventListener('click', () => goToPage(currentPage - 1));
nextButton.addEventListener('click', () => goToPage(currentPage + 1));

fullscreenButton.addEventListener('click', async () => {
    if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        fullscreenButton.textContent = 'Exit Fullscreen';
    } else {
        await document.exitFullscreen();
        fullscreenButton.textContent = 'Fullscreen';
    }
});

document.addEventListener('keydown', event => {
    if (!focusMode) {
        return;
    }

    if (event.key === 'ArrowLeft') {
        goToPage(currentPage - 1);
    }

    if (event.key === 'ArrowRight') {
        goToPage(currentPage + 1);
    }
});

document.querySelectorAll('.panel-scene img').forEach(image => {
    image.addEventListener('click', () => {
        image.closest('.panel-scene').classList.toggle('zoomed');
    });
});

document.addEventListener('fullscreenchange', () => {
    fullscreenButton.textContent = document.fullscreenElement ? 'Exit Fullscreen' : 'Fullscreen';
});

updateReader();