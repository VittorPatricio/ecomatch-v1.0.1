const columns = document.querySelectorAll(".options");
const targetAreasElements = document.querySelectorAll(".targetArea");
const matchSound = document.getElementById("matchSound");
const matchSound2 = document.getElementById("matchSound2");
const token = localStorage.getItem("token");
const apiUrlVerify = "http://26.111.147.122:4001/verifyToken/";
const apiUrl = "http://26.111.147.122:4001/registerAction";
const apiUrlSugestion = "http://26.111.147.122:4001/sugestion";
const urlSugestion = `${apiUrlSugestion}`;
const urlAction = `${apiUrl}`;
const date = new Date();
const diaAtual = `${date.getDate()}/${
  date.getMonth() + 1
}/${date.getFullYear()}`;
const stars = parseInt(localStorage.getItem("stars")) || 0;
const TempoFloresta = parseInt(localStorage.getItem("TimeFloresta")) || 0;
const TempoMar = parseInt(localStorage.getItem("TimeMar")) || 0;
const tempoJogo = (TempoFloresta + TempoMar) / 3;
const tempoJogoFinal = parseInt(Math.trunc(tempoJogo));
const minutes = Math.floor(tempoJogoFinal / 60);
const seconds = tempoJogoFinal % 60;
const modal = document.getElementById("myModal");
const acertosSpan = document.querySelector(".acertos");
const acertosPalavrasArea = document.querySelector(".palavras");
const acertosPalavras = parseInt(localStorage.getItem("acertosPalavra"), 10);
const temporizador = document.querySelector(".temporizador");
const acertosFaseFloresta = parseInt(
  localStorage.getItem("respostasCorretasFloresta"),
  10
);
const acertosFaseMar = parseInt(
  localStorage.getItem("respostasCorretasMar"),
  10
);
const respostasCorretas = acertosFaseFloresta + acertosFaseMar;
const estrela1 = document.getElementById("estrela1");
const estrela2 = document.getElementById("estrela2");
const estrela3 = document.getElementById("estrela3");
const acertosCategoriaSpan = document.querySelector(".acertosCategoria");

const confirmationModal = document.getElementById("areaModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmButton = document.getElementById("home");
const overlay = document.querySelector(".overlay");
const toggleMusicButton = document.getElementById("toggleMusicButton");
const audioPlayer = new Audio("../../audios/musica tema ecomatch.mp3");
const musicIcon = document.getElementById("musicIcon");

const modalAlerta = document.querySelector(".modal-alerta");
const modalAlertaTexto = modalAlerta.querySelector(".modal-alerta-texto");

const mostrarModalAlerta = (mensagem) => {
  modalAlertaTexto.textContent = mensagem;
  modalAlerta.classList.add("ativo");

  // Esconde o modal após 3 segundos
  setTimeout(() => {
    modalAlerta.classList.remove("ativo");
  }, 1300);
};

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

let acertos = localStorage.getItem("acertosCategoria")
  ? parseInt(localStorage.getItem("acertosCategoria"))
  : 0;

let round = 1;
const maxRounds = 2;
let usedAnimals = []; // Array para rastrear os animais usados

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

const dataResult = {
  token: token, // substitua pelo token de usuário correto
  action: "Acertos Categoria " + diaAtual,
  result: 0,
};

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

let startPos = null;
const targetAreas = {};

let attemptCount = 0;
const maxAttempts = 2;

let tentativas = 0;

let totalCategoriasGeradas = 0;

let categoriasCorretas = [];

const targetData = {
  targets: [
    {
      id: "target1",
      name: "Mamífero",
      description: "Possui pelos e amamenta o filhote.",
      category: "mammal",
    },
    {
      id: "target2",
      name: "Ave",
      description: "Possui penas e botam ovos.",
      category: "bird",
    },
    {
      id: "target3",
      name: "Réptil",
      description: "São marinhos, pele resistente e botam ovos.",
      category: "reptile",
    },
    /*     {
      id: "target4",
      name: "Peixe",
      description: "São marinhos e botam ovos.",
      category: "fish",
    }, */
  ],
};

const data = {
  categories: [
    {
      id: 1,
      name: "mammal",
      items: [
        { name: "CAPIVARA" },
        { name: "ARIRANHA" },
        { name: "CERVO" },
        { name: "MICO-LEÃO-DOURADO" },
        { name: "TAMANDUÁ" },
        { name: "TATU" },
      ],
    },
    {
      id: 2,
      name: "bird",
      items: [{ name: "ARARA" }, { name: "GARÇA" }],
    },
    {
      id: 3,
      name: "reptile",
      items: [{ name: "TARTARUGA" }, { name: "CAMALEÃO" }],
    },
    /*     {
      id: 4,
      name: "fish",
      items: [{ name: "Baleia" }],
    }, */
  ],
};

function normalizeString(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const fetchCategoryImages = async () => {
  try {
    const response = await fetch(
      "http://26.111.147.122:4001/getCategoryImages"
    );
    const images = await response.json();

    data.categories.forEach((category) => {
      category.items.forEach((item) => {
        const itemNameNormalized = normalizeString(item.name);
        const matchingImage = images.find((url) =>
          normalizeString(url).includes(itemNameNormalized)
        );
        if (matchingImage) {
          item.image = matchingImage;
        } else {
          console.warn(`Imagem não encontrada para o item: ${item.name}`);
        }
      });
    });

    console.log(data);

    return data;
  } catch (error) {
    console.error("Erro ao buscar imagens da API:", error);
    throw error;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  fetchCategoryImages();
  inicializarCategorias();
  inicializarOpcoes();
  inicializarArrasteESolta();
});

function embaralharArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function inicializarCategorias() {
  const categoriesContainer = document.querySelector(".categories");
  categoriesContainer.innerHTML = "";

  const shuffledTargets = embaralharArray([...targetData.targets]);

  shuffledTargets.forEach((target, index) => {
    const targetElement = document.createElement("div");
    targetElement.id = target.id;
    targetElement.classList.add("category", target.category, "targetArea");

    const targetName = document.createElement("p");
    targetName.innerHTML = `<span class="tipo-text">${target.name}</span>`;

    const targetDescription = document.createElement("p");
    targetDescription.textContent = target.description;

    targetElement.setAttribute("data-category", target.category);

    targetElement.appendChild(targetName);
    targetElement.appendChild(targetDescription);
    totalCategoriasGeradas = targetData.targets.length;
    targetData.targets.forEach((target) => {
      categoriasCorretas.push(target.category);
    });
    categoriesContainer.appendChild(targetElement);
  });

  inicializarArrasteESolta();
}

function proximaRodada() {
  if (round < maxRounds) {
    round++;
    document.getElementById("progress").textContent = `${round}/2`;
    tentativas = 0;
    inicializarCategorias();
    inicializarOpcoes();
  } else {
    console.log("Ultima rodada");
  }
}

const inicializarOpcoes = async () => {
  try {
    await fetchCategoryImages();

    const optionsContainer = document.querySelector(".options");
    optionsContainer.innerHTML = ""; // Limpar conteúdo existente

    const displayedCategories = Array.from(
      document.querySelectorAll(".targetArea")
    ).map((target) => target.getAttribute("data-category"));

    const selectedAnimals = [];

    displayedCategories.forEach((categoryName) => {
      const category = data.categories.find(
        (category) => category.name === categoryName
      );

      if (category) {
        const availableAnimals = category.items.filter(
          (item) => !usedAnimals.includes(item.name)
        );

        if (availableAnimals.length === 0) {
          // Se não houver animais disponíveis nessa categoria, escolha aleatoriamente de outra categoria
          const otherCategories = data.categories.filter(
            (cat) => cat.name !== categoryName
          );
          const otherCategory =
            otherCategories[Math.floor(Math.random() * otherCategories.length)];
          const randomAnimal =
            otherCategory.items[
              Math.floor(Math.random() * otherCategory.items.length)
            ];

          selectedAnimals.push(randomAnimal);
          usedAnimals.push(randomAnimal.name); // Adiciona o animal ao array de animais usados
        } else {
          const randomIndex = Math.floor(
            Math.random() * availableAnimals.length
          );
          const selectedAnimal = availableAnimals.splice(randomIndex, 1)[0];

          selectedAnimals.push(selectedAnimal);
          usedAnimals.push(selectedAnimal.name); // Adiciona o animal ao array de animais usados
        }
      }
    });

    embaralharArray(selectedAnimals).forEach((animal) => {
      const category = data.categories.find((category) =>
        category.items.includes(animal)
      );

      const itemElement = document.createElement("div");
      itemElement.classList.add("item", "option", "card");
      itemElement.setAttribute("draggable", "true");

      const itemName = document.createElement("p");
      itemName.textContent = animal.name;

      const itemImage = document.createElement("img");
      if (animal.image) {
        itemImage.src = animal.image;
        itemImage.alt = animal.name;
        itemImage.setAttribute("draggable", "false");
      } else {
        console.log(`Imagem não encontrada para o item: ${animal.name}`);
      }

      itemElement.setAttribute("data-target", category.name);

      itemElement.appendChild(itemImage);
      itemElement.appendChild(itemName);

      optionsContainer.appendChild(itemElement);
    });

    inicializarArrasteESolta();
  } catch (error) {
    console.error("Erro ao inicializar opções:", error);
  }
  inicializarArrasteESolta();
};

function inicializarArrasteESolta() {
  const items = document.querySelectorAll(".item");
  const targetAreasElements = document.querySelectorAll(".targetArea");

  items.forEach((item) => {
    item.addEventListener("dragstart", (e) => {
      if (e.target.classList.contains("item")) {
        e.target.classList.add("dragging");
        startPos = {
          parent: e.target.parentNode,
          nextSibling: e.target.nextSibling,
        };
      }
    });

    item.addEventListener("dragend", (e) => {
      if (e.target.classList.contains("item")) {
        e.target.classList.remove("dragging");
        verificarTodosCartoesPosicionados();
      }
    });
  });

  targetAreasElements.forEach((item) => {
    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      const dragging = document.querySelector(".dragging");
      if (!dragging) return;

      if (item.querySelector(".item")) {
        return;
      }
      item.appendChild(dragging);
    });
  });
}

function verificarTodosCartoesPosicionados() {
  const totalCartoes = document.querySelectorAll(".item").length;
  const totalCartoesPosicionados =
    document.querySelectorAll(".targetArea .item").length;

  if (totalCartoes === totalCartoesPosicionados) {
    verificarTodosCartoes();
  }
}

function verificarTodosCartoes() {
  const cartoes = document.querySelectorAll(".item");
  let todosCorretos = true;

  cartoes.forEach((cartao) => {
    const targetCategory = cartao.getAttribute("data-target");
    const areaAlvo = Array.from(document.querySelectorAll(".targetArea")).find(
      (area) => area.getAttribute("data-category") === targetCategory
    );

    if (areaAlvo && areaAlvo.contains(cartao)) {
      if (!cartao.classList.contains("correto")) {
        dataResult.result++;
        acertos++;
        cartao.classList.add("correto");
        if (localStorage.getItem("musicPlaying") === "true") {
          matchSound.play();
        } else {
          matchSound.pause();
        }
      }
      cartao.style.backgroundColor = "#97E73C";

      cartao.draggable = false;
    } else {
      todosCorretos = false;
      if (tentativas < maxAttempts - 1) {
        cartao.style.backgroundColor = "";
        cartao.classList.add("shake");
        setTimeout(() => cartao.classList.remove("shake"), 1000);
        if (startPos.nextSibling) {
          startPos.parent.insertBefore(cartao, startPos.nextSibling);
        } else {
          startPos.parent.appendChild(cartao);
        }
      } else {
        cartao.style.backgroundColor = "#CE1D1D";
        if (localStorage.getItem("musicPlaying") === "true") {
          matchSound2.play();
        } else {
          matchSound2.pause();
        }
        cartao.draggable = false;
      }
    }
  });

  tentativas++;

  setTimeout(() => {
    if (todosCorretos || tentativas >= maxAttempts) {
      if (round < maxRounds) {
        if (todosCorretos) {
          mostrarModalAlerta(
            "Parabéns! Você colocou todos os cartões nas áreas corretas!"
          );
        } else {
          mostrarModalAlerta(
            "Você errou algumas! Mas está tudo bem, tente novamente."
          );
        }
      } else {
        if (tentativas >= maxAttempts) {
          setTimeout(() => {
            modal.style.animation = "fadeIn 1s";
            overlay.style.animation = "fadeIn 1s";
            modal.style.display = "flex";
            overlay.style.display = "block";

            setTimeout(() => {
              estrela1.style.display = "flex";
            }, 500);

            setTimeout(() => {
              estrela2.style.display = "flex";
            }, 1500);

            setTimeout(() => {
              estrela3.style.display = "flex";
            }, 2500);

            acertosCategoriaSpan.textContent = `${acertos}/6`;
            temporizador.innerHTML = `${minutes < 10 ? "0" : ""}${minutes}:${
              seconds < 10 ? "0" : ""
            }${seconds}`;
            if (respostasCorretas == null) {
              acertosSpan.textContent = ``;
            } else {
              acertosSpan.textContent = `${respostasCorretas}/20`;
            }
            acertosPalavrasArea.textContent = `${acertosPalavras}/5`;
          }, 500);
          registerAction();
        } else {
          return false;
        }
      }
      proximaRodada();
    }
  }, 500);
}

document.addEventListener("DOMContentLoaded", () => {
  const estrelasContainer = document.querySelector(".estrelas");
  const sugestaoInput = document.getElementById("sugestaoInput");
  const enviarSugestaoBtn = document.getElementById("enviarSugestao");

  let avaliacao = 0;
  let sugestao = "";

  // Criar as estrelas dinamicamente
  for (let i = 1; i <= 5; i++) {
    const estrela = document.createElement("span");
    estrela.classList.add("estrela");
    estrela.dataset.value = i;
    estrela.innerHTML = "&#9733";
    estrela.addEventListener("click", () => {
      avaliacao = i;
      atualizarEstrelas();
    });
    estrelasContainer.appendChild(estrela);
  }

  function atualizarEstrelas() {
    const estrelas = document.querySelectorAll(".estrela");
    estrelas.forEach((estrela, index) => {
      if (index < avaliacao) {
        estrela.classList.add("checked");
      } else {
        estrela.classList.remove("checked");
      }
    });
  }

  enviarSugestaoBtn.addEventListener("click", () => {
    sugestao = sugestaoInput.value;

    const dataSugestion = {
      sugestion: sugestao || "Sem sugestão",
      stars: avaliacao || "Não avaliado",
    };

    registerSugestion(dataSugestion);
    setTimeout(() => {
      mostrarModalAlerta("Agradecemos sua ajuda!");
    }, 300);
    console.log("Avaliação:", avaliacao);
    console.log("Sugestão:", sugestao);
  });

  async function registerSugestion(dataSugestion) {
    try {
      const response = await fetch(urlSugestion, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataSugestion),
      });

      const data = await response.json();
      console.log("Sugestão registrada com sucesso:", data);
    } catch (error) {
      console.error("Erro ao registrar a sugestão:", error);
    }
  }
});

window.onload = function () {
  round = 1;
  verifyToken();
  if (localStorage.getItem("musicPlaying") === "true") {
    audioPlayer.currentTime =
      parseFloat(localStorage.getItem("currentTime")) || 0;
    playMusic();
  } else {
    pauseMusic();
  }
};

function goTo() {
  window.location.href = "../../tela-inicial.html";
}

function curiosidades() {
  window.location.href = "../../tela curiosidades/curiosidades.html";
}
