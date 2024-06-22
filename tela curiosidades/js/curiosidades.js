const indiceInicial = 0;
let indiceAtual = indiceInicial;
const numAnimaisVisiveis = 5;

const confirmationModal = document.getElementById("areaModal");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
const confirmButton = document.getElementById("home");
const overlay = document.querySelector(".overlay");
const toggleMusicButton = document.getElementById("toggleMusicButton");
const audioPlayer = new Audio("../audios/musica tema ecomatch.mp3");
const musicIcon = document.getElementById("musicIcon");
const originalVolume = 1; // Volume original da música de fundo
const reduzidoVolume = 0.3; // Volume reduzido da música de fundo

const playMusic = () => {
  audioPlayer.play();
  localStorage.setItem("musicPlaying", "true");
  musicIcon.src = "../assets/icones/som-off.svg";
};

const pauseMusic = () => {
  audioPlayer.pause();
  localStorage.setItem("musicPlaying", "false");
  musicIcon.src = "../assets/icones/som-on.svg";
};

const diminuirVolumeMusica = () => {
  audioPlayer.volume = reduzidoVolume;
};

const restaurarVolumeMusica = () => {
  audioPlayer.volume = originalVolume;
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
  window.location.href = "../tela-inicial.html";
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
    nome: "ONÇA",
    imagem: "../assets/onça.svg",
    som: "../audios/onça.mp3",
    habitat:
      "HABITAT DA ONÇA: Florestas tropicais, savanas, e áreas pantanosas.",
    curiosidades:
      "CURIOSIDADES SOBRE A ONÇA: A onça é o maior felino das Américas e é conhecida pela sua força.",
  },
  {
    nome: "ARARA",
    imagem: "../assets/arara.svg",
    som: "../audios/arara.mp3",
    habitat: "HABITAT DA ARARA: Florestas tropicais, especialmente a Amazônia.",
    curiosidades:
      "CURIOSIDADES SOBRE A ARARA: As araras são conhecidas por suas penas coloridas e habilidades vocais.",
  },
  {
    nome: "BICHO-PREGUIÇA",
    imagem: "../assets/bicho-preguica.svg",
    som: "../assets/sounds/bicho-preguica.mp3",
    habitat:
      "HABITAT DO BICHO-PREGUIÇA: Florestas tropicais da América Central e do Sul.",
    curiosidades:
      "CURIOSIDADES SOBRE O BICHO-PREGUIÇA: Eles passam a maior parte do tempo pendurados de cabeça para baixo nas árvores.",
  },
  {
    nome: "CAPIVARA",
    imagem: "../assets/capivara.svg",
    som: "../assets/sounds/capivara.mp3",
    habitat:
      "HABITAT DAS CAPIVARAS: Manquezaes, savanas, lagos, rios e pântanos, habitando toda a América do Sul e Central.",
    curiosidades:
      "CURIOSIDADES SOBRE A CAPIVARA: Elas são os maiores roedores do mundo.",
  },
];

const imagensContainer = document.getElementById("imagens");
const nomeAnimalElemento = document.getElementById("nome-animal");
const habitatTextoElemento = document.getElementById("habitat-texto");
const curiosidadesTextoElemento = document.getElementById("curiosidades-texto");
const imagemPrincipalElemento = document.getElementById("imagem-principal");

let somAtual = null;

function adicionarAnimais() {
  imagensContainer.innerHTML = "";
  for (let i = 0; i < numAnimaisVisiveis; i++) {
    const indice = (indiceAtual + i) % animais.length;
    const animal = animais[indice];
    const divAnimal = document.createElement("div");
    divAnimal.classList.add("animal");

    const img = document.createElement("img");
    img.src = animal.imagem;
    img.alt = animal.nome;
    img.addEventListener("click", () => {
      atualizarInformacoes(animal, divAnimal);
    });
    divAnimal.appendChild(img);
    imagensContainer.appendChild(divAnimal);
  }
  atualizarTransicao();
}

function atualizarInformacoes(animal, divAnimal) {
  nomeAnimalElemento.textContent = animal.nome;
  habitatTextoElemento.textContent = animal.habitat;
  curiosidadesTextoElemento.textContent = animal.curiosidades;
  imagemPrincipalElemento.src = animal.imagem;
  imagemPrincipalElemento.alt = animal.nome;
  if (somAtual) {
    somAtual.pause();
    somAtual.currentTime = 0;
    restaurarVolumeMusica();
  }
  somAtual = new Audio(animal.som);
  somAtual.addEventListener("timeupdate", () => {
    if (somAtual.currentTime >= 4) {
      somAtual.pause();
      somAtual.currentTime = 0;
      restaurarVolumeMusica();
    }
  });
  somAtual.addEventListener("play", diminuirVolumeMusica);
  somAtual.addEventListener("ended", restaurarVolumeMusica);
  removerSelecao();
  divAnimal.classList.add("animal-selecionado");
}

function removerSelecao() {
  const animaisElementos = document.querySelectorAll(".animal");
  animaisElementos.forEach((animal) => {
    animal.classList.remove("animal-selecionado");
  });
}

function OuvirSom() {
  if (somAtual) {
    somAtual.play();
  }
}

function moverCarrossel(direcao) {
  const animaisElementos = document.querySelectorAll(".animal");
  animaisElementos.forEach((animal) => {
    animal.classList.remove("animal-visible");
  });

  setTimeout(() => {
    indiceAtual = (indiceAtual + direcao + animais.length) % animais.length;
    adicionarAnimais();
  }, 500); // Tempo igual ao da transição CSS
}

function atualizarTransicao() {
  const animaisElementos = document.querySelectorAll(".animal");
  setTimeout(() => {
    animaisElementos.forEach((animal) => {
      animal.classList.add("animal-visible");
    });
  }, 10); // Pequeno atraso para permitir que o CSS aplique as classes
}

// Adicionar os primeiros animais e exibir o primeiro animal automaticamente
adicionarAnimais();
atualizarInformacoes(
  animais[indiceAtual],
  imagensContainer.children[indiceAtual]
);
