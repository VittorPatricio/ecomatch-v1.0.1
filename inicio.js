// Inicializa o player de áudio e os elementos do DOM
const audioPlayer = new Audio("./audios/musica_tema_ecomatch.mp3");
const toggleMusicButton = document.getElementById("toggleMusicButton");
const musicIcon = document.getElementById("musicIcon");

// Função para tocar música
const playMusic = () => {
  audioPlayer.play();
  localStorage.setItem("musicPlaying", "true");
  musicIcon.src = "./assets/icones/som-off.svg";
};

// Função para pausar música
const pauseMusic = () => {
  audioPlayer.pause();
  localStorage.setItem("musicPlaying", "false");
  musicIcon.src = "./assets/icones/som-on.svg";
};

// Define o estado inicial da música com base no localStorage
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("musicPlaying") === "true") {
    audioPlayer.currentTime =
      parseFloat(localStorage.getItem("currentTime")) || 0;
    playMusic();
  } else {
    pauseMusic();
  }
});

// Adiciona evento para alternar a música
toggleMusicButton.addEventListener("click", () => {
  if (audioPlayer.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
});

// Atualiza o tempo atual da música no localStorage
audioPlayer.addEventListener("timeupdate", () => {
  localStorage.setItem("currentTime", audioPlayer.currentTime);
});

// Código existente para os outros componentes da página
const buttonUser = document.getElementById("buttonUser");
const token = localStorage.getItem("token");
const userId = localStorage.getItem("userId");
const apiUrlVerify = "http://26.111.147.122:4001/verifyToken/";
const confirmationModal = document.getElementById("areaModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmButton = document.getElementById("buttonExit");
const overlay = document.querySelector(".overlay");
const capivara = document.querySelector(".capivara");

function shake() {
  capivara.classList.add("shake");
  console.log("clicou");
}

capivara.addEventListener("click", shake);

const verifyToken = async () => {
  if (
    token === null ||
    token === "" ||
    token === undefined ||
    token === "null"
  ) {
    mostrarModalAlerta("Usuário desconectado! Faça o login para continuar");
    window.location.href = "./login.html";
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
      window.location.href = "./login.html";
      return false;
    }
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    window.location.href = "./login.html";
    return false;
  }
};

toggleMusicButton.addEventListener("click", () => {
  if (audioPlayer.paused) {
    audioPlayer.play();
    musicIcon.src = "./assets/icones/som-off.svg";
  } else {
    audioPlayer.pause();
    musicIcon.src = "./assets/icones/som-on.svg";
  }
});

if (window.location.pathname === "./tela-inicial.html") {
  confirmButton.addEventListener("click", () => {
    confirmationModal.style.animation = "fadeIn 1s";
    overlay.style.animation = "fadeIn 1s";

    confirmationModal.style.display = "flex";
    overlay.style.display = "flex";
  });

  confirmNo.addEventListener("click", () => {
    confirmationModal.style.display = "none";
    overlay.style.display = "none";
  });

  overlay.addEventListener("click", () => {
    confirmationModal.style.display = "none";
    overlay.style.display = "none";
  });

  confirmYes.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "./login.html";
  });

  function jogar() {
    if (
      token === null ||
      token === "" ||
      token === undefined ||
      token === "null"
    ) {
      mostrarModalAlerta("Faça o login para jogar");
      window.location.href = "./login.html";
    } else {
      window.location.href = "./telas dialogo/inicio/index.html";
    }
  }

  buttonUser.addEventListener("click", () => {
    if (
      token === null ||
      token === "" ||
      token === undefined ||
      token === "null"
    ) {
      mostrarModalAlerta("Faça o login para acessar o perfil!");
      window.location.href = "./login.html";
    } else {
      window.location.href = "./tela usuario/user.html";
    }
  });
}

if (
  window.location.pathname === "./index.html" ||
  window.location.pathname === "./"
) {
  document.body.classList.add("preloader");

  window.addEventListener("load", function () {
    setTimeout(function () {
      document.body.classList.add("loaded");

      document.body.classList.remove("preloader");
    }, 4000);
  });
}

const preloader = document.querySelector(".preloader");

if (preloader) {
  window.addEventListener("load", function () {
    preloader.classList.add("fadeOut");
    setTimeout(function () {
      preloader.style.display = "none";
    }, 4000);
  });
}

const button = document.getElementById("jogar");
const formLogin = document.getElementById("abrirmodalLogin");
const formRegistro = document.getElementById("abrirmodalRegistro");
const playerName = document.getElementById("PlayerName");
const NomeEscola = document.getElementById("escola");
const RAaluno = document.getElementById("ra");

const handleSubmit = (event) => {
  event.preventDefault();
  localStorage.setItem("player", playerName.value);
};

formLogin.addEventListener("submit", handleSubmit);

function iniciarJogo() {
  const playerName = document.getElementById("PlayerName").value.toUpperCase();
  const escola = document.getElementById("escola").value.toUpperCase();
  const ra = document.getElementById("ra").value;

  if (playerName.length > 3) {
    if (escola.length > 3) {
      if (ra.length > 3) {
        fetch("http://26.111.147.122:4001/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idEscola: ra,
            escola: escola,
            username: playerName,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.token) {
              console.log("Login bem-sucedido:", data);
              window.location.href = "./tela-inicial.html";

              // Salva o token e o userId no localStorage
              localStorage.setItem("token", data.token);
              localStorage.setItem("userId", data.userId);
            } else {
              console.log("Falha no login:", data);
              mostrarModalAlerta(
                "Informações de entrada incorretas! Corrija e tente novamente!"
              );
            }
          })
          .catch((error) => {
            console.error("Erro:", error);
            mostrarModalAlerta(
              "Informações de entrada incorretas! Corrija e tente novamente!"
            );
          });
      } else {
        mostrarModalAlerta("O RA deve ter no mínimo 4 caractéres!");
      }
    } else {
      mostrarModalAlerta("O nome da escola deve ter no mínimo 4 caractéres!");
    }
  } else {
    mostrarModalAlerta("O nome deve ter no mínimo 4 caractéres!");
  }
}

function validarRegistro() {
  const playerNameRegister = document
    .getElementById("PlayerNameRegister")
    .value.toUpperCase();
  const escolaRegister = document
    .getElementById("escolaRegister")
    .value.toUpperCase();
  const raRegister = document.getElementById("raRegister").value;
  const confirmRaRegister = document.getElementById("confirmRaRegister").value;

  if (playerNameRegister.length > 3) {
    if (escolaRegister.length > 3) {
      if (raRegister.length > 3) {
        if (raRegister !== confirmRaRegister) {
          mostrarModalAlerta("Os RAs/RMs devem ser iguais!");
        } else {
          fetch(
            `/checkUser?idEscola=${raRegister}&escola=${escolaRegister}&username=${playerNameRegister}`
          )
            .then((response) => response.text())
            .then((result) => {
              if (result === "Usuário encontrado") {
                // Exibe um modal informando que o usuário já existe
                mostrarModalAlerta("O usuário já existe!");
              } else {
                // Chama a função de registro
                registerUser(raRegister, escolaRegister, playerNameRegister);
              }
            })
            .catch((error) =>
              console.error("Erro ao verificar usuário:", error)
            );
        }
      } else {
        mostrarModalAlerta("O RA deve ter no mínimo 4 caractéres!");
      }
    } else {
      mostrarModalAlerta("O nome da escola deve ter no mínimo 4 caractéres!");
    }
  } else {
    mostrarModalAlerta("O nome deve ter no mínimo 4 caractéres!");
  }
}

function registerUser(idEscola, escola, username) {
  fetch("http://26.111.147.122:4001/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      idEscola: idEscola,
      escola: escola,
      username: username,
    }),
  })
    .then((response) => {
      if (response.status === 201) {
        console.log("Registro bem-sucedido:", response);
        mostrarModalAlerta("Usuário registrado com sucesso!");
      } else {
        console.log("Falha no registro:", response);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Erro:", error);
      mostrarModalAlerta("Erro ao registrar o usuário! Usuário já existe!");
    });
}

window.onload = function () {
  document.body.classList.add("loaded");

  if (window.location.pathname === "./login.html") {
    document
      .getElementById("botao-iniciar")
      .addEventListener("click", abrirModalRegistro);
  }

  if (window.location.pathname === "./tela-inicial.html") {
    verifyToken();
  }
};

function abrirModalLogin() {
  var modalLogin = new bootstrap.Modal(
    document.getElementById("abrirmodalLogin")
  );
  ocultarModalRegistro();
  modalLogin.show();
}

const fecharModalLogin = () => {
  var modalLogin = new bootstrap.Modal(
    document.getElementById("abrirmodalLogin")
  );
  modalLogin.style.display = "none";
  document.body.classList.remove("modal-open");
};

function ocultarModalRegistro() {
  var modalRegistro = document.getElementById("abrirmodalRegistro");
  if (modalRegistro) {
    modalRegistro.style.display = "none";
  }
  var modalBackDrop = document.querySelector(".modal-backdrop");
  if (modalBackDrop) {
    modalBackDrop.remove();
  }
}
