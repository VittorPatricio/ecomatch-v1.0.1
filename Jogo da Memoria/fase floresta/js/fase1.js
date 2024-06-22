const grid = document.querySelector(".grid");
const spanPlayer = document.querySelector(".player");
const timer = document.querySelector(".timer");
const matchSound = document.getElementById("matchSound");
const date = new Date();
const diaAtual = `${date.getDate()}/${
  date.getMonth() + 1
}/${date.getFullYear()}`;
const token = localStorage.getItem("token");

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

const apiUrlVerify = "http://26.111.147.122:4001/verifyToken/";
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

grid.addEventListener("click", () => {
  if (grid.classList.contains("reveal-card")) {
    grid.classList.remove("reveal-card");
  }
});

grid.addEventListener("click", () => {
  if (grid.classList.contains("reveal-card")) {
    grid.classList.toggle("reveal-card", false);
  }
});

const animals = [
  "capivara",
  "tucano",
  "arara",
  "onca",
  "mico-leao-dourado",
  "tatu",
  "camaleao",
  "cervo",
  "tamandua",
  "garca",
];

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

let firstCard = "";
let secondCard = "";

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll(".disabled-card");

  const fundo = document.getElementById("modal-finalizacao");

  const mensagemfinalizacao = document.getElementById(
    "modal-menor-finalizacao"
  );

  if (disabledCards.length == 20) {
    clearInterval(intervalId);
    const token = localStorage.getItem("token");

    // Prepara os dados para enviar à API
    const data = {
      token: token, // substitua pelo token de usuário correto
      action: "Tempo Floresta " + diaAtual,
      result: TimeFloresta,
    };

    // Faz a chamada à API
    fetch("http://26.111.147.122:4001/registerAction", {
      // substitua pela URL correta da sua API
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Ação registrada com sucesso:", data);
      })
      .catch((error) => {
        console.error("Erro:", error);
      });

    setTimeout(() => {
      mensagemfinalizacao.style.opacity = 0;
      fundo.style.display = "flex";
      mensagemfinalizacao.style.display = "flex";

      setTimeout(() => {
        mensagemfinalizacao.style.opacity = 1;
      }, 500);

      setTimeout(() => {
        window.location.href = "./quiz/index.html";
      }, 1500);
    }, 1000);
  }
};

const checkCards = () => {
  const firstAnimal = firstCard.getAttribute("data-animal");
  const secondAnimal = secondCard.getAttribute("data-animal");

  if (firstAnimal === secondAnimal) {
    if (localStorage.getItem("musicPlaying") === "true") {
      matchSound.play();
    } else {
      matchSound.pause();
    }

    firstCard.firstChild.classList.add("disabled-card");
    secondCard.firstChild.classList.add("disabled-card");

    firstCard = "";
    secondCard = "";

    checkEndGame();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("reveal-card");
      secondCard.classList.remove("reveal-card");

      firstCard = "";
      secondCard = "";
    }, 800);
  }
};

const revealCard = ({ target }) => {
  if (
    target.parentNode.classList.contains("reveal-card") ||
    target.parentNode.classList.contains("disabled-card")
  ) {
    return;
  }

  if (firstCard === "") {
    target.parentNode.classList.add("reveal-card");
    firstCard = target.parentNode;
  } else if (secondCard === "") {
    target.parentNode.classList.add("reveal-card");
    secondCard = target.parentNode;

    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      card.removeEventListener("click", revealCard);
    });
    //a
    checkCards();

    setTimeout(() => {
      cards.forEach((card) => {
        card.addEventListener("click", revealCard);
      });
    }, 1000);
  }
};

const fetchAnimalImages = async () => {
  try {
    const response = await fetch(
      "http://26.111.147.122:4001/getAnimalFlorestImages"
    );
    const images = await response.json();
    console.log(images);
    return images;
  } catch (error) {
    console.error("Erro ao buscar imagens da API:", error);
  }
};

const createCard = (animal, imageUrl) => {
  const card = createElement("div", "card");
  const front = createElement("div", "face front");
  const back = createElement("div", "face back");

  // Use a URL da imagem em vez do caminho local
  front.style.backgroundImage = `url('${imageUrl}')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener("click", revealCard);
  card.setAttribute("data-animal", animal);

  return card;
};

const loadGame = async () => {
  // Busque as imagens da API
  const images = await fetchAnimalImages();

  // Crie um array de animais com base nas imagens retornadas
  const animals = images.map((imageUrl) => {
    // Extraia o nome do animal da URL da imagem
    const animal = imageUrl.split("/").pop().split(".")[0].split("?")[0];
    return { animal, imageUrl };
  });

  const duplicatedAnimals = [...animals, ...animals];
  const shuffledArray = duplicatedAnimals.sort(() => Math.random() - 0.5);

  shuffledArray.forEach(({ animal, imageUrl }) => {
    const card = createCard(animal, imageUrl);
    grid.appendChild(card);
  });
};
const openModal = () => {
  const overlay = document.getElementById("fundo-inicio");
  const modal = document.getElementById("texto-fase-inicio");

  document.body.classList.add("loading");

  setTimeout(() => {
    modal.style.animation = "fadeOut 1s";
    overlay.style.animation = "fadeOut 1s";
    setTimeout(() => {
      overlay.style.display = "none";
      document.body.classList.remove("loading");
    }, 1000);
  }, 3000);
};

window.addEventListener("load", openModal);

var TimeFloresta = 0;
var intervalId;

function updateTimer() {
  const minutes = Math.floor(TimeFloresta / 60);
  const seconds = TimeFloresta % 60;

  timer.innerHTML = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;

  localStorage.setItem("TimeFloresta", window.TimeFloresta);
}

function startTimer() {
  setTimeout(() => {
    intervalId = setInterval(() => {
      TimeFloresta++;
      updateTimer();
    }, 1000);
  }, 3000);
}

window.onload = () => {
  const playerName = localStorage.getItem("player");
  const lowerCaseName = playerName.toLowerCase();
  const namesArray = lowerCaseName.split(" ");
  const formattedName = namesArray
    .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
    .join(" ");

  spanPlayer.innerHTML = formattedName;
  verifyToken();
  startTimer();
  loadGame();
};
