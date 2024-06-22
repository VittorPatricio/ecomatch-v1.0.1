const token = localStorage.getItem("token");
const apiUrlVerify = "http://26.111.147.122:4001/verifyToken/";

const confirmationModal = document.getElementById("areaModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmButton = document.getElementById("home");
const overlay = document.querySelector(".overlay");
const toggleMusicButton = document.getElementById("toggleMusicButton");
const audioPlayer = new Audio("../../audios/musica tema ecomatch.mp3");
const musicIcon = document.getElementById("musicIcon");

audioPlayer.loop = true;

const playMusic = () => {
  audioPlayer.play();
  localStorage.setItem("musicPlaying", "true");
  musicIcon.src = "../../assets/icones/som-off.svg";
};

const pauseMusic = () => {
  audioPlayer.pause();
  localStorage.setItem("musicPlaying", "false");
  musicIcon.src = "../../assets/icones/som-on.svg";
};

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("musicPlaying") === "true") {
    audioPlayer.currentTime =
      parseFloat(localStorage.getItem("currentTime")) || 0;
    playMusic();
  } else {
    pauseMusic();
  }
});

toggleMusicButton.addEventListener("click", () => {
  if (audioPlayer.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
});

audioPlayer.addEventListener("timeupdate", () => {
  localStorage.setItem("currentTime", audioPlayer.currentTime);
});

confirmButton.addEventListener("click", () => {
  confirmationModal.style.animation = "fadeIn 1s";
  overlay.style.animation = "fadeIn 1s";

  confirmationModal.style.display = "flex";
  overlay.style.display = "flex";
});

confirmYes.addEventListener("click", () => {
  window.location.href = "../../tela-inicial.html";
});

confirmNo.addEventListener("click", () => {
  confirmationModal.style.display = "none";
  overlay.style.display = "none";
});

overlay.addEventListener("click", () => {
  confirmationModal.style.display = "none";
  overlay.style.display = "none";
});

const verifyToken = async () => {
  if (
    token === null ||
    token === "" ||
    token === undefined ||
    token === "null"
  ) {
    mostrarModalAlerta("Usuário desconectado! Faça o login para continuar");
    window.location.href = "../../login.html";
    return false;
  }
  const urlWithTokenVerify = `${apiUrlVerify}${token}`;

  try {
    const response = await fetch(urlWithTokenVerify, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      return true;
    } else {
      mostrarModalAlerta("Usuário desconectado! Faça o login para continuar");
      window.location.href = "../../login.html";
      return false;
    }
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    window.location.href = "../../login.html";
    return false;
  }
};

function startFlorestGame() {
  window.location.href = "../../Jogo da Memoria/fase floresta/fase1.html";
}

function desafioAceito() {
  window.location.href = "../../../Minigames/Desafio das Letras/index.html";
}

function nextPage3() {
  window.location.href = "../desafio/desafio.html";
}

function nextPage2() {
  window.location.href = "../tutorial/tutorial.html";
}

function nextPage1() {
  window.location.href = "../apresentacao/apresentacao.html";
}

function backPage() {
  window.location.href = "../inicio/index.html";
}

function backPage2() {
  window.location.href = "../apresentacao/apresentacao.html";
}

function backPage3() {
  window.location.href = "../agradecimento/agradecimento.html";
}

window.onload = function () {
  const playerName = localStorage.getItem("player");
  if (playerName) {
    let firstName = playerName.split(" ")[0];
    firstName = firstName.toLowerCase();
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    document.getElementById("username").textContent = firstName;
  }
  ("");
};
