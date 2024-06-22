const token = localStorage.getItem("token");
const apiUrlVerify = "http://26.111.147.122:4001/verifyToken/";
const apiUrl = "http://26.111.147.122:4001/registerAction";
const urlAction = `${apiUrl}`;
const date = new Date();
const diaAtual = `${date.getDate()}/${
  date.getMonth() + 1
}/${date.getFullYear()}`;
const SoundCorrect = document.getElementById("matchSound1");
const SoundError = document.getElementById("matchSound2");
const modalAlerta = document.querySelector(".modal-alert");
const modalAlertaTexto = modalAlerta.querySelector(".modal-alert-texto");

const mostrarModalAlerta = (mensagem) => {
  modalAlertaTexto.textContent = mensagem;
  modalAlerta.classList.add("ativo");

  // Esconde o modal após 3 segundos
  setTimeout(() => {
    modalAlerta.classList.remove("ativo");
  }, 1000);
};

const redirectToLogin = () => {
  mostrarModalAlerta("Usuário desconectado! Faça o login para continuar");
  window.location.href = "../../login.html";
};

const verifyToken = async () => {
  if (!token) {
    redirectToLogin();
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
      redirectToLogin();
      return false;
    }
  } catch (error) {
    console.error("Erro ao verificar o token:", error);
    redirectToLogin();
    return false;
  }
};

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

const animais = [
  {
    id: 1,
    nome: "capivara",
    pergunta: "ORGANIZE AS LETRAS PARA FORMAR O NOME DO ANIMAL",
  },
  {
    id: 2,
    nome: "onça",
    pergunta: "ORGANIZE AS LETRAS PARA FORMAR O NOME DO ANIMAL",
  },
  {
    id: 3,
    nome: "arara",
    pergunta: "ORGANIZE AS LETRAS PARA FORMAR O NOME DO ANIMAL",
  },
  {
    id: 4,
    nome: "baleia",
    pergunta: "ORGANIZE AS LETRAS PARA FORMAR O NOME DO ANIMAL",
  },
  {
    id: 5,
    nome: "camaleão",
    pergunta: "ORGANIZE AS LETRAS PARA FORMAR O NOME DO ANIMAL",
  },
  {
    id: 6,
    nome: "caranguejo",
    pergunta: "ORGANIZE AS LETRAS PARA FORMAR O NOME DO ANIMAL",
  },
  {
    id: 7,
    nome: "polvo",
    pergunta: "ORGANIZE AS LETRAS PARA FORMAR O NOME DO ANIMAL",
  },
  {
    id: 8,
    nome: "tatu",
    pergunta: "ORGANIZE AS LETRAS PARA FORMAR O NOME DO ANIMAL",
  },
  {
    id: 9,
    nome: "tartaruga",
    pergunta: "ORGANIZE AS LETRAS PARA FORMAR O NOME DO ANIMAL",
  },
  {
    id: 10,
    nome: "tucano",
    pergunta: "ORGANIZE AS LETRAS PARA FORMAR O NOME DO ANIMAL",
  },
  {
    id: 11,
    nome: "cervo",
    pergunta: "ORGANIZE AS LETRAS PARA FORMAR O NOME DO ANIMAL",
  },
  {
    id: 12,
    nome: "garça",
    pergunta: "ORGANIZE AS LETRAS PARA FORMAR O NOME DO ANIMAL",
  },
];

const imagensAnimais = {
  Capivara: "./capivara.svg",
  Onça: "./onça.svg",
  Arara: "./arara.svg",
  Baleia: "./baleia.svg",
  Camaleão: "./camaleão.svg",
  Caranguejo: "./caranguejo.svg",
  Polvo: "./polvo.svg",
  Tatu: "./tatu.svg",
  Tartaruga: "./tartaruga.svg",
  Tucano: "./tucano.svg",
  Cervo: "./cervo.svg",
  Garça: "./garça.svg",
};

let correctWord;
let selectedLetters = [];
let totalTentativas = 2;
let tentativaAtual = 0;
let questoesRespondidas = 0;
let acertos = 0;
let historicoAnimais = [];

const dataResult = {
  token: token, // substitua pelo token de usuário correto
  action: "Acertos Palavra " + diaAtual,
  result: 0,
};

function generateRandomLetters(word) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomLetters = [];
  const usedLetters = new Set(word);

  while (randomLetters.length < 14 - word.length) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    const randomLetter = alphabet[randomIndex];
    if (!usedLetters.has(randomLetter)) {
      randomLetters.push(randomLetter);
      usedLetters.add(randomLetter);
    }
  }

  randomLetters.sort(() => Math.random() - 0.5);
  return randomLetters.join("");
}

async function registerAction() {
  await fetch(urlAction, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataResult),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Ação registrada com sucesso:", data);
    })
    .catch((error) => {
      return error;
    });
}

function setupGame() {
  if (questoesRespondidas == 5) {
    registerAction();
    mostrarModalAlerta("Parabéns! Você completou todas as rodadas.");
    setTimeout(() => {
      window.location.href = "../Desafio das Categorias/index.html";
    }, 1200);
    return;
  }

  // Reiniciar o controle de tentativas para cada nova rodada
  tentativaAtual = 0;
  totalTentativas = 2;

  let animal;
  do {
    animal = animais[Math.floor(Math.random() * animais.length)];
  } while (historicoAnimais.includes(animal.id));

  historicoAnimais.push(animal.id);
  if (historicoAnimais.length > 5) {
    historicoAnimais.shift();
  }

  const animalNameCapitalized =
    animal.nome.charAt(0).toUpperCase() + animal.nome.slice(1).toLowerCase();

  document.querySelector(".animal-img img").src =
    imagensAnimais[animalNameCapitalized];
  document.querySelector("h1").textContent = animal.pergunta;

  const caixaResposta = document.querySelector(".caixa-resposta");
  caixaResposta.innerHTML = "";

  correctWord = animal.nome.toUpperCase();
  const randomLetters = generateRandomLetters(correctWord);
  const shuffledLetters = correctWord
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  for (let i = 0; i < correctWord.length; i++) {
    const span = document.createElement("span");
    span.classList.add("letras");
    span.setAttribute("ondrop", "drop(event)");
    span.setAttribute("ondragover", "allowDrop(event)");
    caixaResposta.appendChild(span);
  }

  const letrasAleatorias = document.querySelectorAll(".letras-aleatorias span");

  letrasAleatorias.forEach((letra, index) => {
    if (index < correctWord.length) {
      letra.textContent = shuffledLetters[index];
    } else {
      letra.textContent = randomLetters[index - correctWord.length];
    }
    letra.style.opacity = "1";
    letra.setAttribute("draggable", true);
    letra.addEventListener("dragstart", drag);
  });

  document.getElementById("contador-questao").textContent =
    questoesRespondidas + 1 + "/5";
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.textContent);
}

function drop(event) {
  event.preventDefault();
  const letra = event.dataTransfer.getData("text");
  const caixaResposta = event.target;

  if (caixaResposta && caixaResposta.textContent === "") {
    caixaResposta.textContent = letra;
    caixaResposta.style.opacity = "100%";

    const letraSelecionada = Array.from(
      document.querySelectorAll(".letras-aleatorias span")
    ).find((l) => l.textContent === letra && l.style.opacity !== "0.5");
    if (letraSelecionada) {
      letraSelecionada.style.opacity = "0.5";
      letraSelecionada.setAttribute("draggable", false);
      selectedLetters.push(letra);
    }

    const todasPreenchidas = Array.from(
      document.querySelectorAll(".caixa-resposta .letras")
    ).every((letra) => letra.textContent !== "");
    if (todasPreenchidas) {
      checkAllLetters();
    }
  }
}

function checkAllLetters() {
  const letrasCaixaResposta = document.querySelectorAll(
    ".caixa-resposta .letras"
  );
  const letrasAleatorias = document.querySelectorAll(".letras-aleatorias span");

  const userWord = Array.from(letrasCaixaResposta)
    .map((letra) => letra.textContent.toUpperCase())
    .join("");

  const letrasCertas = [];
  const letrasErradas = [];

  for (let i = 0; i < userWord.length; i++) {
    if (userWord[i] === correctWord[i]) {
      letrasCertas.push(userWord[i]);
    } else {
      letrasErradas.push(userWord[i]);
    }
  }

  letrasCaixaResposta.forEach((letra, index) => {
    if (userWord[index] === correctWord[index]) {
      letra.textContent = correctWord[index];
      letra.style.opacity = "100%";
      letra.classList.add("correta");
    } else {
      setTimeout(() => {
        letra.textContent = "";
        letra.classList.add("shake");
        setTimeout(() => {
          letra.classList.remove("shake");
        }, 500); // Tempo da animação
        const letraErrada = Array.from(
          document.querySelectorAll(".letras-aleatorias span")
        ).find(
          (l) => l.textContent === userWord[index] && l.style.opacity === "0.5"
        );
        if (letraErrada) {
          letraErrada.style.opacity = "1";
          letraErrada.setAttribute("draggable", true);
        }
      }, 500);
    }
  });

  letrasAleatorias.forEach((letra) => {
    if (letrasErradas.includes(letra.textContent.toUpperCase())) {
      letra.style.opacity = "1";
      letra.setAttribute("draggable", true);
      letra.addEventListener("dragstart", drag);
    }
  });

  selectedLetters = [];

  if (userWord === correctWord) {
    acertos++;
    localStorage.setItem("acertosPalavra", acertos);
    dataResult.result++;
    console.log(dataResult.result);
    questoesRespondidas++;
    if (localStorage.getItem("musicPlaying") === "true") {
      SoundCorrect.play();
    }

    mostrarModalAlerta("Parabéns! Você acertou o animal.");
    setTimeout(() => {
      setupGame();
    }, 1000);
  } else {
    tentativaAtual++;
    if (tentativaAtual === totalTentativas) {
      letrasCaixaResposta.forEach((letra, index) => {
        if (userWord[index] !== correctWord[index]) {
          letra.style.backgroundColor = "#CE1D1D";
        }
      });
      questoesRespondidas++;
      mostrarModalAlerta("Suas tentativas acabaram! Próxima rodada.");
      if (localStorage.getItem("musicPlaying") === "true") {
        SoundError.play();
      }
      setTimeout(() => {
        setupGame();
        tentativaAtual = 0;
      }, 1000);
    }
  }
}

function init() {
  verifyToken().then((tokenValid) => {
    if (tokenValid) {
      setupGame();
    }
  });
}

window.onload = init;
