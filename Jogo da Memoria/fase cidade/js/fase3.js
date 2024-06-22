const grid = document.querySelector(".grid");
const spanPlayer = document.querySelector(".player");
const matchSound = document.getElementById("matchSound");
const timer = document.querySelector(".timer");
const date = new Date();
const diaAtual = `${date.getDate()}/${
  date.getMonth() + 1
}/${date.getFullYear()}`;
const token = localStorage.getItem("token");

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

const cities = [
  "biblioteca",
  "bombeiro",
  "casa",
  "cinema",
  "escola",
  "fazendeira",
  "medica",
  "parquinho",
  "policial",
  "piscina",
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
      action: "Tempo Cidade " + diaAtual,
      result: TimeCidade,
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
        window.location.href =
          "../../telas dialogo/agradecimento/agradecimento.html";
      }, 1500);
    }, 1000);
  }
};

const checkCards = () => {
  const firstAnimal = firstCard.getAttribute("data-city");
  const secondAnimal = secondCard.getAttribute("data-city");

  if (firstAnimal === secondAnimal) {
    matchSound.play();

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

const fetchCitiesImages = async () => {
  try {
    const response = await fetch(
      "http://26.111.147.122:4001/getAnimalCidadeImages"
    );
    const images = await response.json();
    console.log(images);
    return images;
  } catch (error) {
    console.error("Erro ao buscar imagens da API:", error);
  }
};

const createCard = (city, imageUrl) => {
  const card = createElement("div", "card");
  const front = createElement("div", "face front");
  const back = createElement("div", "face back");

  // Use a URL da imagem em vez do caminho local
  front.style.backgroundImage = `url('${imageUrl}')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener("click", revealCard);
  card.setAttribute("data-city", city);

  return card;
};

const loadGame = async () => {
  // Busque as imagens da API
  const images = await fetchCitiesImages();

  // Crie um array de animais com base nas imagens retornadas
  const cities = images.map((imageUrl) => {
    // Extraia o nome do city da URL da imagem
    const city = imageUrl.split("/").pop().split(".")[0].split("?")[0];
    return { city, imageUrl };
  });

  const duplicatedCities = [...cities, ...cities];
  const shuffledArray = duplicatedCities.sort(() => Math.random() - 0.5);

  shuffledArray.forEach(({ city, imageUrl }) => {
    const card = createCard(city, imageUrl);
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

var TimeCidade = 0;
var intervalId;

function updateTimer() {
  const minutes = Math.floor(TimeCidade / 60);
  const seconds = TimeCidade % 60;

  timer.innerHTML = `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;

  if (TimeCidade !== undefined && TimeCidade !== null) {
    localStorage.setItem("TimeCidade", TimeCidade);
  }
}

function startTimer() {
  setTimeout(() => {
    intervalId = setInterval(() => {
      TimeCidade++;
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
