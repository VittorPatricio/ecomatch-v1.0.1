const voltar = document.getElementById("voltar");
const modalImages = document.getElementById("modalImages");
const imageUser = document.getElementById("imageUser");
const user = document.getElementById("user");
const dataUser = document.getElementById("dataUser");
const faseMar = document.getElementById("faseMar");
const faseFloresta = document.getElementById("faseFloresta");
const faseCidade = document.getElementById("faseCidade");
const acertosQuiz = document.getElementById("acertosQuiz");
const acertosPalavra = document.getElementById("acertosPalavra");
const acertosCategorias = document.getElementById("acertosCategorias");
const name = document.getElementById("name");
const escola = document.getElementById("escola");
const token = localStorage.getItem("token");
const spanPlayer = document.querySelector(".player");
const playerName = localStorage.getItem("player");
const lowerCaseName = playerName.toLowerCase();
const namesArray = lowerCaseName.split(" ");
const body = document.querySelector("body");
const overlay = document.querySelector(".overlay");
const xModal = document.querySelector(".fechar-modal");
const apiUrl = "http://26.111.147.122:4001/user";
const apiUrlImage = "http://26.111.147.122:4001/getUserImages";
const apiSetUrlImage = "http://26.111.147.122:4001/setProfilePicture";
const toggleMusicButton = document.getElementById("sound");
const audioPlayer = new Audio("../audios/musica tema ecomatch.mp3");
const musicIcon = document.getElementById("musicIcon");
const modalImagesDiv = document.getElementById("images");
const imageUserButton = document.getElementById("salvarFoto");
const modalAlerta = document.querySelector(".modal-alert");
const modalAlertaTexto = modalAlerta.querySelector(".modal-alert-texto");

const mostrarModalAlerta = (mensagem) => {
  modalAlertaTexto.textContent = mensagem;
  modalAlerta.classList.add("ativo");

  // Esconde o modal após 3 segundos
  setTimeout(() => {
    modalAlerta.classList.remove("ativo");
  }, 2600);
};

audioPlayer.loop = true;

const playMusic = () => {
  audioPlayer.play();
  localStorage.setItem("musicPlaying", "true");
  musicIcon.src = "../../../assets/icones/som-off.svg";
};

const pauseMusic = () => {
  audioPlayer.pause();
  localStorage.setItem("musicPlaying", "false");
  musicIcon.src = "../../../assets/icones/som-on.svg";
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

let selectedImageElement = null;
let selectImage = null;

const fetchAndDisplayUserImages = async () => {
  await fetch(apiUrlImage, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((images) => {
      modalImagesDiv.innerHTML = "";

      images.forEach((imageUrl, index) => {
        const imageElement = document.createElement("img");
        imageElement.src = imageUrl;
        imageElement.id = "user-image-" + index;
        imageElement.classList.add("modal-image");
        modalImagesDiv.appendChild(imageElement);

        imageElement.addEventListener("click", () => {
          if (selectedImageElement) {
            selectedImageElement.classList.remove("imageSelected");
          }
          imageElement.classList.add("imageSelected");
          selectedImageElement = imageElement;
          selectImage = imageUrl;
        });
      });
    })
    .catch((error) => console.error("Erro ao buscar imagens", error));
};

function saveSelectedImage() {
  if (!selectImage || selectImage == null) {
    mostrarModalAlerta("Para enviar uma imagem, selecione uma primeiro!");
    return;
  }
  if (!token) {
    window.location.href = "../login.html";
    return;
  }

  fetch(apiSetUrlImage, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, profilePicture: selectImage }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro ao salvar foto de perfil");
      }
      return response.text();
    })
    .then((result) => {
      window.location.reload();
      console.log(result);
    })
    .catch((error) => {
      console.error("Erro ao salvar foto de perfil", error);
      mostrarModalAlerta("Erro ao salvar foto de perfil");
    });
}

imageUserButton.addEventListener("click", saveSelectedImage);

function enableSaveButton() {
  imageUserButton.disabled = false;
}

function abrirModal() {
  modalImages.classList.add("ativo");
  modalImagesDiv.style.display = "flex";
  modalImages.style.animation = "fadeIn 1s";
  overlay.style.display = "block";
}

function fecharModal() {
  modalImages.classList.remove("ativo");
  overlay.style.display = "none";
  selectedImageElement.classList.remove("imageSelected");
  selectedImageElement = null;
  selectImage = null;
}

user.addEventListener("click", abrirModal);
xModal.addEventListener("click", fecharModal);
overlay.addEventListener("click", fecharModal);

voltar.addEventListener("click", () => {
  if (
    token === null ||
    token === "" ||
    token === undefined ||
    token === "null"
  ) {
    mostrarModalAlerta("Faça o login para continuar");
    window.location.href = "../../login.html";
  } else {
    window.location.href = "../../tela-inicial.html";
  }
});

const formattedName = namesArray
  .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
  .join(" ");

spanPlayer.innerHTML = formattedName;

const fetchImages = async () => {
  const token = localStorage.getItem("token");
  console.log("Token recuperado:", token);

  if (!token) {
    console.error("Token não encontrado. Faça o login para continuar.");
    window.location.href = "../../login.html";
    return;
  }

  const urlWithToken = `${apiUrl}?token=${token}`;
  console.log("URL com token:", urlWithToken);

  try {
    const response = await fetch(urlWithToken, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Resposta recebida:", response);

    if (!response.ok) {
      console.error(
        "Erro ao buscar dados do usuário:",
        response.status,
        response.statusText
      );
      if (response.status === 401 || response.status === 403) {
        console.error("Token inválido ou expirado. Faça o login novamente.");
        window.location.href = "../../login.html";
      }
      return;
    }

    const userData = await response.json();
    console.log("Dados do usuário:", userData);

    displayUserData(userData);
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
  }
};

const displayUserData = (userData) => {
  document.getElementById("name").textContent = "Nome: " + userData.username;
  document.getElementById("escola").textContent = "Escola: " + userData.escola;

  if (userData.pictureUrl) {
    document.getElementById("user").src = userData.pictureUrl;
  } else {
    document.getElementById("user").src = "./camera_default.svg";
  }

  const recentActions = getRecentActions(
    Array.isArray(userData.actions) ? userData.actions : []
  );

  displayRecentActions(recentActions);
};

const getRecentActions = (actions) => {
  const actionTypes = {
    "Tempo Floresta": "faseFloresta",
    "Tempo Mar": "faseMar",
    "Acertos Quiz Floresta": "acertosQuizFloresta",
    "Acertos Quiz Mar": "acertosQuizMar",
    "Acertos Palavra": "acertosPalavra",
    "Acertos Categoria": "acertosCategorias", // Corrigido o nome aqui
  };

  const recentActions = {
    "Tempo Floresta": [],
    "Tempo Mar": [],
    "Acertos Quiz Floresta": [],
    "Acertos Quiz Mar": [],
    "Acertos Palavra": [],
    "Acertos Categoria": [], // Corrigido o nome aqui
  };

  console.log("Ações recebidas:", actions);

  actions.forEach((action) => {
    const dateMatch = action.action.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
    if (!dateMatch) return;
    const dateParts = dateMatch[0].split("/");
    const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);

    Object.keys(actionTypes).forEach((type) => {
      if (action.action.includes(type)) {
        recentActions[type].push({
          ...action,
          date: dateMatch[0],
          dateObj: date,
        });
      }
    });
  });

  console.log("Ações agrupadas antes da ordenação:", recentActions);

  Object.keys(recentActions).forEach((type) => {
    recentActions[type].sort((a, b) => b.dateObj - a.dateObj);
    recentActions[type] = recentActions[type].slice(0, 2);
  });

  console.log("Ações mais recentes:", recentActions);

  return recentActions;
};

const displayRecentActions = (recentActions) => {
  const updateActionElement = (elementId, action) => {
    const element = document.querySelector(`#${elementId}`);
    if (element) {
      if (action) {
        element.textContent = `${action.action}: ${action.result}`;
      } else if (!elementId.startsWith("last")) {
        element.textContent = "Partida ainda não realizada";
      } else {
        element.textContent = "";
      }
    } else {
      console.error(`Elemento com o ID ${elementId} não encontrado.`);
    }
  };

  updateActionElement("faseFloresta", recentActions["Tempo Floresta"][0]);
  updateActionElement("lastFaseFloresta", recentActions["Tempo Floresta"][1]);
  updateActionElement("faseMar", recentActions["Tempo Mar"][0]);
  updateActionElement("lastFaseMar", recentActions["Tempo Mar"][1]);
  updateActionElement(
    "acertosQuizFloresta",
    recentActions["Acertos Quiz Floresta"][0]
  );
  updateActionElement(
    "lastAcertosQuizFloresta",
    recentActions["Acertos Quiz Floresta"][1]
  );
  updateActionElement("acertosQuizMar", recentActions["Acertos Quiz Mar"][0]);
  updateActionElement(
    "lastAcertosQuizMar",
    recentActions["Acertos Quiz Mar"][1]
  );
  updateActionElement("acertosPalavra", recentActions["Acertos Palavra"][0]);
  updateActionElement(
    "lastAcertosPalavra",
    recentActions["Acertos Palavra"][1]
  );
  updateActionElement(
    "acertosCategorias",
    recentActions["Acertos Categoria"][0]
  );
  updateActionElement(
    "lastAcertosCategorias",
    recentActions["Acertos Categoria"][1]
  );
};

fetchImages();
fetchAndDisplayUserImages();
