// musicPlayer.js
document.addEventListener("DOMContentLoaded", () => {
    const audioPlayer = new Audio('./audios/musica tema ecomatch.mp3');
    const toggleMusicButton = document.getElementById("toggleMusicButton");
    const musicIcon = document.getElementById("musicIcon");

    audioPlayer.play();
    localStorage.setItem("musicPlaying", "true");
    musicIcon.src = "./assets/icones/som-off.svg";

    audioPlayer.loop = true;

    // Define o estado inicial da música com base no localStorage
    if (localStorage.getItem("musicPlaying") === "true") {
        audioPlayer.currentTime = parseFloat(localStorage.getItem("currentTime")) || 0;
        audioPlayer.play();
        musicIcon.src = "./assets/icones/som-off.svg";
    } else {
        musicIcon.src = "./assets/icones/som-on.svg";
    }

    // Adiciona evento para alternar a música
    toggleMusicButton.addEventListener("click", () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            localStorage.setItem("musicPlaying", "true");
            musicIcon.src = "./assets/icones/som-off.svg";
        } else {
            audioPlayer.pause();
            localStorage.setItem("musicPlaying", "false");
            musicIcon.src = "./assets/icones/som-on.svg";
        }
    });

    // Atualiza o tempo atual da música no localStorage
    audioPlayer.addEventListener("timeupdate", () => {
        localStorage.setItem("currentTime", audioPlayer.currentTime);
    });
});

// Atualiza o estado da música ao sair da página
window.addEventListener("beforeunload", () => {
    localStorage.setItem("musicPaused", audioPlayer.paused);
});

// Verifica se a música estava tocando ao retornar para a tela inicial
window.addEventListener("pageshow", (event) => {
    if (event.persisted && localStorage.getItem("musicPlaying") === "true" && audioPlayer.paused) {
        audioPlayer.play();
    }
});
