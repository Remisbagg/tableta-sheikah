const background = document.querySelector('.background');
const viewport = document.querySelector('.viewport');
const cursor = document.querySelector('.custom-cursor');

// Definimos el rango total de movimiento basado en el tamaño extra de la imagen
const totalWidth = background.offsetWidth - viewport.offsetWidth;
const totalHeight = background.offsetHeight - viewport.offsetHeight;

// Función para mover el cursor personalizado
function moveCursor(e) {
    cursor.style.left = `${e.clientX - cursor.offsetWidth / 2}px`;
    cursor.style.top = `${e.clientY - cursor.offsetHeight / 2}px`;
}

// Añadimos el evento mousemove al document en lugar del viewport
document.addEventListener('mousemove', (e) => {
    moveCursor(e);

    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    const moveX = -(mouseX * totalWidth);
    const moveY = -(mouseY * totalHeight);

    document.querySelector(".background").style.transform = `translate(${moveX}px, ${moveY}px)`;
});

const audioElement = `
    <audio id="chest-sound" src="assets/Sonidos/Cofre_Zelda_BOW.mp3"></audio>
    <audio id="error-sound" src="assets/Sonidos/error.mp3"></audio>`;
document.body.insertAdjacentHTML('beforeend', audioElement);

// Crear los popups con botones de cerrar
const popupHTML = `
    <div id="popup-left" class="reward-popup">
        <button class="close-btn">&times;</button>
        <img src="assets/Imagenes/Espada_maestraa.png" alt="Espada Maestra">
        <p>¡Felicidades!, has adquirido la espada maestra</p>
    </div>
    <div id="popup-center" class="reward-popup">
        <button class="close-btn">&times;</button>
        <img src="assets/Imagenes/Remis.png" alt="Canal de Twitch">
        <p>Te espero el 27/02/2025 a las 6:00 pm hora Colombia en Twitch</p>
    </div>
    <div id="popup-right" class="reward-popup">
        <button class="close-btn">&times;</button>
        <img src="assets/Imagenes/Escudo_Hyliano.png" alt="Escudo Hyliano">
        <p>¡Felicidades!, has adquirido el escudo hyliano</p>
    </div>
`;
document.body.insertAdjacentHTML('beforeend', popupHTML);

function setupChestVideos() {
    const chests = document.querySelectorAll('.chest-wrapper');
    const chestSound = document.getElementById('chest-sound');
    const errorSound = document.getElementById('error-sound');

    let leftOpened = false;
    let rightOpened = false;
    let centerOpened = false;

    chests.forEach(chestWrapper => {
        const video = chestWrapper.querySelector('video');
        let hasBeenOpened = false;

        video.currentTime = 0;
        video.pause();

        chestWrapper.addEventListener('click', () => {
            if (chestWrapper.classList.contains('center') && (!leftOpened || !rightOpened)) {
                errorSound.currentTime = 0;
                errorSound.play();
                return;
            }

            if (video.paused && !hasBeenOpened) {
                hasBeenOpened = true;

                chests.forEach(wrapper => {
                    const otherVideo = wrapper.querySelector('video');
                    if (otherVideo !== video) otherVideo.pause();
                });

                video.play().catch(error => console.log('Error playing video:', error));

                setTimeout(() => {
                    chestSound.currentTime = 0;
                    chestSound.play().catch(error => console.log('Error playing sound:', error));
                }, 3000);

                setTimeout(() => {
                    const popupId = chestWrapper.classList.contains('left') ? 'popup-left' :
                        chestWrapper.classList.contains('center') ? 'popup-center' : 'popup-right';
                    const popup = document.getElementById(popupId);
                    popup.classList.add('show');

                    if (popupId === 'popup-left') leftOpened = true;
                    if (popupId === 'popup-right') rightOpened = true;
                    if (popupId === 'popup-center') centerOpened = true;

                    if (popupId === 'popup-center') {
                        popup.style.cursor = 'pointer';
                        popup.addEventListener('click', () => {
                            window.location.href = 'https://www.twitch.tv/remisbagg';
                        });
                    }
                }, 2000);
            }
        });

        video.addEventListener('ended', () => {
            video.pause();
        });
    });

    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const popup = event.target.parentElement;
            popup.classList.remove('show');
            popup.classList.add('hide');

            setTimeout(() => {
                popup.style.display = 'none';
                popup.classList.remove('hide');
            }, 300);
        });
    });
}

document.addEventListener('DOMContentLoaded', setupChestVideos);

document.getElementById("start-button").addEventListener("click", function () {
    let introSound = document.getElementById("intro-sound");
    let backgroundMusic = document.getElementById("background-music");

    introSound.play().then(() => {
        document.querySelector(".fade-screen").style.animation = "fadeIn 3s ease-out forwards";
        this.style.display = "none";

        setTimeout(() => {
            document.querySelector(".fade-screen").style.display = "none";
            backgroundMusic.volume = 0.3;
            backgroundMusic.play().catch(error => console.log("Error reproduciendo la música de fondo:", error));
        }, 1500);
    }).catch(error => {
        console.log("Error reproduciendo el sonido:", error);
    });
});


// Script para móviles
let isDragging = false;
let startX, startY;
let scrollLeft, scrollTop;
let hasInitialScroll = false;

function isMobileDevice() {
    return (window.innerWidth <= 768 || ('ontouchstart' in window));
}

function showMobilePopup() {
    // Verificamos si ya mostramos el popup
    if (localStorage.getItem('popupShown')) {
        return;
    }

    // Verificamos si el popup ya existe
    let mobilePopup = document.getElementById('mobile-popup');
    
    if (!mobilePopup) {
        mobilePopup = document.createElement('div');
        mobilePopup.id = "mobile-popup";
        mobilePopup.innerHTML = `
            <div class="reward-popup show">
                <button class="close-btn">&times;</button>
                <p>¡Hola! Te habla remis, veo que estas en celular. Esta experiencia está pensada para PC, pero si sigues aquí, te recomiendo girar tu dispositivo a horizontal para disfrutar mejor del juego. ¡Encuentra los 3 cofres y preparate para nuestra aventura por hyrule!</p>
                <button class="close-btn">Entendido</button>
            </div>
        `;
        
        // Insertamos el popup antes de cualquier otro contenido
        document.body.insertBefore(mobilePopup, document.body.firstChild);
        
        // Marcamos que ya mostramos el popup
        localStorage.setItem('popupShown', 'true');
        
        // Agregamos el evento a todos los botones de cerrar
        mobilePopup.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener("click", () => {
                const popup = mobilePopup.querySelector('.reward-popup');
                popup.classList.remove('show');
                popup.classList.add('hide');
                
                // Removemos el popup después de la animación
                setTimeout(() => {
                    mobilePopup.remove();
                }, 300);
            });
        });
    }
}

if (isMobileDevice()) {
    // Intentar mostrar inmediatamente
    showMobilePopup();
}


function setupBackground() {
    const background = document.querySelector('.background');
    const viewport = document.querySelector('.viewport');

    if (isMobileDevice()) {
        let scrollContainer = document.querySelector('.scroll-container');
        if (!scrollContainer) {
            scrollContainer = document.createElement('div');
            scrollContainer.className = 'scroll-container';
            while (viewport.firstChild) {
                scrollContainer.appendChild(viewport.firstChild);
            }
            viewport.appendChild(scrollContainer);
        }

        if (!hasInitialScroll) {
            setTimeout(() => {
                viewport.scrollTo((3840 - window.innerWidth) / 2, (2160 - window.innerHeight) / 2);
                hasInitialScroll = true;
            }, 100);
        }

        background.style.transform = 'none';
    } else {
        hasInitialScroll = false;
        background.style.width = '200%';
        background.style.height = '200%';
        setupParallax();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (isMobileDevice()) {
        showMobilePopup();
    }
    hasInitialScroll = false;
    setupBackground();
});

window.addEventListener('resize', () => {
    if (isMobileDevice()) {
        showMobilePopup();
    }
    setupBackground();
});