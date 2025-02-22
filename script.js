const background = document.querySelector('.background');
const viewport = document.querySelector('.viewport');
const cursor = document.querySelector('.custom-cursor');

// Definimos el rango total de movimiento basado en el tamaño extra de la imagen
const totalWidth = background.offsetWidth - viewport.offsetWidth;
const totalHeight = background.offsetHeight - viewport.offsetHeight;

// Función para mover el cursor personalizado
function moveCursor(e) {
    cursor.style.left = `${e.clientX - cursor.offsetWidth/2}px`;
    cursor.style.top = `${e.clientY - cursor.offsetHeight/2}px`;
}

// Añadimos el evento mousemove al document en lugar del viewport
document.addEventListener('mousemove', (e) => {
    // Mover el cursor personalizado
    moveCursor(e);

    // Efecto parallax del fondo
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    // Calculamos el movimiento basado en el tamaño total disponible
    const moveX = -(mouseX * totalWidth);
    const moveY = -(mouseY * totalHeight);

    // Aplicar la transformación
    document.querySelector(".background").style.transform = `translate(${moveX}px, ${moveY}px)`;
});


const audioElement = `<audio id="chest-sound" src="assets/Sonidos/Cofre_Zelda_BOW.mp3"></audio>
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
        let hasBeenOpened = false; // Control para una sola apertura

        video.currentTime = 0;
        video.pause();

        chestWrapper.addEventListener('click', () => {
            if (chestWrapper.classList.contains('center') && (!leftOpened || !rightOpened)) {
                // Si intenta abrir el cofre central antes de los otros dos, sonar error
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
                }, 2000);

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

    // Evento para cerrar popups
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

// Asegurar que el código se ejecute cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupChestVideos);



document.getElementById("start-button").addEventListener("click", function () {
    let introSound = document.getElementById("intro-sound");
    let backgroundMusic = document.getElementById("background-music");

    // Intentamos reproducir el sonido de introducción
    introSound.play().then(() => {
        // Aplicar la animación de fade-in
        document.querySelector(".fade-screen").style.animation = "fadeIn 3s ease-out forwards";

        // Ocultamos el botón después de hacer clic
        this.style.display = "none";

        // Quitamos la pantalla negra al final del fade
        setTimeout(() => {
            document.querySelector(".fade-screen").style.display = "none";

            // Reproducir la música de fondo en bucle
            backgroundMusic.volume = 0.3; // Opcional: Ajusta el volumen
            backgroundMusic.play().catch(error => console.log("Error reproduciendo la música de fondo:", error));
        }, 1500);
    }).catch(error => {
        console.log("Error reproduciendo el sonido:", error);
    });
});