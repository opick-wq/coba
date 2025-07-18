document.addEventListener('DOMContentLoaded', () => {
    // Elemen-elemen
    const welcomeScreen = document.getElementById('welcome-screen');
    const startBtn = document.getElementById('start-btn');
    const skyContainer = document.getElementById('sky-container');
    const cometTrail = document.getElementById('comet-trail');
    const instruction = document.getElementById('instruction');
    const svgLines = document.getElementById('constellation-lines');
    const stars = document.querySelectorAll('.star');
    const popups = document.querySelectorAll('.message-popup');
    const finalMessage = document.getElementById('final-message');
    const backgroundMusic = document.getElementById('background-music');

    // Status Permainan
    let currentConstellation = 1;
    let currentOrder = 1;
    let lastClickedStar = null;

    // 1. Logika Jejak Komet (Mouse Trail)
    document.addEventListener('mousemove', (e) => {
        cometTrail.style.left = e.clientX + 'px';
        cometTrail.style.top = e.clientY + 'px';
        document.body.style.cursor = 'none';
    });

    // 2. Memulai Petualangan
    startBtn.addEventListener('click', () => {
        backgroundMusic.play(); 

        welcomeScreen.classList.add('hidden');
        skyContainer.classList.add('visible');
        instruction.classList.add('show');
        setTimeout(highlightNextStar, 1500);
    });

    // 3. Logika Klik Bintang
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const starConst = parseInt(star.dataset.constellation);
            const starOrder = parseInt(star.dataset.order);

            if (starConst === currentConstellation && starOrder === currentOrder) {
                star.classList.remove('highlight');
                star.classList.add('connected');

                if (lastClickedStar) {
                    drawLine(lastClickedStar, star);
                }
                lastClickedStar = star;
                currentOrder++;

                const nextStar = findStar(currentConstellation, currentOrder);
                if (!nextStar) {
                    showPopup(currentConstellation);
                    lastClickedStar = null;
                } else {
                    highlightNextStar();
                }
            }
        });
    });
    
    // 4. Logika Tombol Tutup Popup
    document.querySelectorAll('.close-popup-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.parentElement.classList.remove('show');
            currentConstellation++;
            currentOrder = 1;

            if (findStar(currentConstellation, 1)) {
                 highlightNextStar();
            } else {
                instruction.classList.remove('show');
                triggerFinale();
            }
        });
    });

    // --- FUNGSI BARU UNTUK GRAND FINALE ---
    function triggerFinale() {
        setTimeout(() => finalMessage.classList.add('show'), 1000);
        skyContainer.classList.add('final-scene');

        setTimeout(() => {
            setInterval(createHeartParticle, 100);
        }, 1500);
    }

    function createHeartParticle() {
        const container = document.getElementById('hearts-finale-container');
        const particle = document.createElement('div');
        particle.classList.add('heart-particle');
        particle.innerHTML = '✨';
        
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.animationDuration = (Math.random() * 5 + 5) + 's';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.fontSize = (Math.random() * 1 + 0.5) + 'rem';
        
        container.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 10000);
    }

    // --- FUNGSI BANTUAN ---
    function highlightNextStar() {
        const nextStar = findStar(currentConstellation, currentOrder);
        if (nextStar) {
            nextStar.classList.add('highlight');
        }
    }

    function findStar(constellation, order) {
        return document.querySelector(`.star[data-constellation='${constellation}'][data-order='${order}']`);
    }

    function drawLine(fromStar, toStar) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const fromRect = fromStar.getBoundingClientRect();
        const toRect = toStar.getBoundingClientRect();

        line.setAttribute('x1', fromRect.left + fromRect.width / 2);
        line.setAttribute('y1', fromRect.top + fromRect.height / 2);
        line.setAttribute('x2', toRect.left + toRect.width / 2);
        line.setAttribute('y2', toRect.top + toRect.height / 2);
        
        svgLines.appendChild(line);
    }

    function showPopup(constellation) {
        const popup = document.getElementById(`message-popup-${constellation}`);
        if(popup) {
            setTimeout(() => popup.classList.add('show'), 500);
        }
    }
});