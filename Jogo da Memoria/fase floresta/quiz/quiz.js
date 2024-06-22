document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal-finalizacao");
  const acertosSpan = document.querySelector(".perguntas");
  const tempoFloresta = document.querySelector(".tempo");
  const token = localStorage.getItem("token");
  const apiUrlVerify = "http://26.111.147.122:4001/verifyToken/";
  const date = new Date();
  const diaAtual = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  const florestaSegundos = localStorage.getItem("TimeFloresta");

  const confirmationModal = document.getElementById("areaModal");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");
  const confirmButton = document.getElementById("home");
  const overlay = document.querySelector(".overlay");
  const toggleMusicButton = document.getElementById("toggleMusicButton");
  const audioPlayer = new Audio("../../../audios/musica tema ecomatch.mp3");
  const musicIcon = document.getElementById("sound");

  const playMusic = () => {
    audioPlayer.play();
    localStorage.setItem("musicPlaying", "true");
    musicIcon.src = "../../../assets/icones/som-off.svg";
  };

  audioPlayer.loop = true;

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

  confirmButton.addEventListener("click", () => {
    confirmationModal.style.animation = "fadeIn 1s";
    overlay.style.animation = "fadeIn 1s";

    confirmationModal.style.display = "flex";
    overlay.style.display = "flex";
  });

  confirmYes.addEventListener("click", () => {
    window.location.href = "../../../tela-inicial.html";
  });

  confirmNo.addEventListener("click", () => {
    confirmationModal.style.display = "none";
    overlay.style.display = "none";
  });

  overlay.addEventListener("click", () => {
    confirmationModal.style.display = "none";
    overlay.style.display = "none";
  });
  async function verifyToken() {
    if (
      token === null ||
      token === "" ||
      token === undefined ||
      token === "null"
    ) {
      mostrarModalAlerta("Usuário desconectado! Faça o login para continuar");
      window.location.href = "../../../login.html";
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
        window.location.href = "../../../login.html";
        return false;
      }
    } catch (error) {
      console.error("Erro ao verificar o token:", error);
      window.location.href = "../../../login.html";
      return false;
    }
  }

  let bloqueioClique = false;

  const animais = [
    {
      id: 2,
      nome: "ARARA",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["ARARA", "ABELHA", "ANTA", "AVESTRUZ"],
    },

    {
      id: 7,
      nome: "CAMALEÃO",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["CAMALEÃO", "GATO", "CAMELO", "CAVALO"],
    },

    {
      id: 8,
      nome: "CERVO",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["CERVO", "CORUJA", "COBRA", "CAMELO"],
    },

    {
      id: 9,
      nome: "CAPIVARA",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["CAPIVARA", "CACHORRO", "CAPIXABA", "CAPITUVAL"],
    },

    {
      id: 16,
      nome: "GARÇA",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["GARÇA", "GATO", "GALO", "GAIVOTA"],
    },

    {
      id: 18,
      nome: "ONÇA",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["ONÇA", "ORCA", "OURIÇO", "ONTEM"],
    },

    {
      id: 23,
      nome: "TUCANO",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["TUCANO", "TAMANDUÁ", "TIGRE", "TEXUGO"],
    },

    {
      id: 24,
      nome: "TATU",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["TATU", "TUCANO", "TARTARUGA", "TIGRE"],
    },

    {
      id: 25,
      nome: "TAMANDUÁ",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["TAMANDUÁ", "TARTARUGA", "TATU", "TUCANO"],
    },
    {
      id: 1,
      nome: "MICO-LEÃO-DOURADO",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["MICO-LEÃO-DOURADO", "MACACO", "LEÃO-DOURADO", "LEÃO"],
    },
  ];

  const imagensAnimais = {
    2: "./img/arara.svg",
    7: "./img/camaleão.svg",
    8: "./img/cervo.svg",
    9: "./img/capivara.svg",
    16: "./img/garça.svg",
    18: "./img/onça.svg",
    23: "./img/tucano.svg",
    24: "./img/tatu.svg",
    25: "./img/tamanduá.svg",
    1: "./img/mico-leão-dourado.svg",
  };

  const todasPerguntas = [...animais];
  shuffleArray(todasPerguntas);

  let perguntaAtual = 0;
  let respostasCorretasFloresta = 0;

  exibirPergunta();

  function exibirPergunta() {
    bloqueioClique = false;
    const animalAtual = todasPerguntas[perguntaAtual];
    const opcoesEmbaralhadas = [...animalAtual.opcoes];
    shuffleArray(opcoesEmbaralhadas);

    document.querySelector(".imagem img").src = imagensAnimais[animalAtual.id];
    document.querySelector(".quiz h1").innerHTML = `<span>${
      perguntaAtual + 1
    }/10</span> ${animalAtual.pergunta}`;

    const opcoes = document.querySelectorAll(".quiz p");
    opcoes.forEach((opcao, index) => {
      opcao.innerHTML = `<span>${String.fromCharCode(65 + index)}</span> ${
        opcoesEmbaralhadas[index]
      }`;
      opcao.classList.remove(
        "correta",
        "resposta-certa",
        "resposta-errada",
        "selecionada",
        "bloqueada"
      );
      if (opcoesEmbaralhadas[index] === animalAtual.opcoes[0]) {
        opcao.classList.add("correta");
      }
    });

    opcoes.forEach((opcao) => {
      opcao.addEventListener("click", verificarResposta);
    });
  }

  function verificarResposta() {
    if (bloqueioClique) return;

    bloqueioClique = true;
    const respostaCorreta = this.classList.contains("correta");

    if (respostaCorreta) {
      this.classList.add("resposta-certa");
      respostasCorretasFloresta++;
      if (localStorage.getItem("musicPlaying") === "true") {
        const matchSound = document.getElementById("matchSound");
        matchSound.play();
      }
    } else {
      this.classList.add("resposta-errada");
      if (localStorage.getItem("musicPlaying") === "true") {
        const matchSound2 = document.getElementById("matchSound2");
        matchSound2.play();
      }
    }

    perguntaAtual++;

    if (perguntaAtual < 10) {
      setTimeout(() => {
        exibirPergunta();
      }, 1500);
    } else {
      const token = localStorage.getItem("token");

      const data = {
        token: token,
        action: "Acertos Quiz Floresta " + diaAtual,
        result: `${respostasCorretasFloresta}/10`,
      };

      fetch("http://26.111.147.122:4001/registerAction", {
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
        modal.style.animation = "fadeIn 1s";
        overlay.style.animation = "fadeIn 1s";
        overlay.style.display = "flex";
        modal.style.display = "flex";

        if (respostasCorretasFloresta >= 9) {
          setTimeout(() => {
            estrela1.style.display = "flex";
          }, 500);

          setTimeout(() => {
            estrela2.style.display = "flex";
          }, 1500);

          setTimeout(() => {
            estrela3.style.display = "flex";
          }, 2500);
        } else if (respostasCorretasFloresta >= 4) {
          setTimeout(() => {
            estrela1.style.display = "flex";
          }, 500);

          setTimeout(() => {
            estrela3.style.display = "flex";
          }, 1500);
        } else {
          setTimeout(() => {
            estrela1.style.display = "flex";
          }, 500);
        }
        const minutes = Math.floor(florestaSegundos / 60);
        const seconds = florestaSegundos % 60;

        acertosSpan.textContent = ` ${respostasCorretasFloresta}/10`;
        tempoFloresta.textContent = ` ${minutes < 10 ? "0" : ""}${minutes}:${
          seconds < 10 ? "0" : ""
        }${seconds}`;
        localStorage.setItem(
          "respostasCorretasFloresta",
          respostasCorretasFloresta
        );

        setTimeout(() => {
          window.location.href = "../../fase mar/fase2.html";
        }, 4000);
      }, 1000);
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  window.onload = function () {
    if (localStorage.getItem("musicPlaying") === "true") {
      audioPlayer.currentTime =
        parseFloat(localStorage.getItem("currentTime")) || 0;
      playMusic();
    } else {
      pauseMusic();
    }
    verifyToken();
  };

  new window.VLibras.Widget("https://vlibras.gov.br/app");
});
