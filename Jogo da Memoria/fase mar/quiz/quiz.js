document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("modal-finalizacao");
  const acertosSpan = document.querySelector(".perguntas");
  const tempoMar = document.querySelector(".tempo");
  const token = localStorage.getItem("token");
  const apiUrlVerify = "http://26.111.147.122:4001/verifyToken/";
  const date = new Date();
  const diaAtual = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;

  const marSegundos = localStorage.getItem("TimeMar");

  const confirmationModal = document.getElementById("areaModal");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");
  const confirmButton = document.getElementById("home");
  const overlay = document.querySelector(".overlay");
  const toggleMusicButton = document.getElementById("toggleMusicButton");
  const audioPlayer = new Audio("../../../audios/musica tema ecomatch.mp3");
  const musicIcon = document.getElementById("musicIcon");

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

  confirmButton.addEventListener("click", () => {
    confirmationModal.style.animation = "fadeIn 1s";
    overlay.style.animation = "fadeIn 1s";

    confirmationModal.style.display = "flex";
    overlay.style.display = "flex";
  });

  confirmYes.addEventListener("click", () => {
    window.location.href =
      "../../../telas dialogo/agradecimento/agradecimento.html";
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
      id: 3,
      nome: "ARIRANHA",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["ARIRANHA", "ÁGUIA", "ARANHA", "AVESTRUZ"],
    },

    {
      id: 4,
      nome: "BALEIA",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["BALEIA", "BODE", "BESOURO", "BORBOLETA"],
    },
    {
      id: 5,
      nome: "BOTO-COR-DE-ROSA",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["BOTO-COR-DE-ROSA", "COR-DE-ROSA", "BOTA-COR-DE-ROSA", "BOTO"],
    },
    {
      id: 6,
      nome: "CARANGUEJO",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["CARANGUEJO", "CARAMUJO", "CARRAPICHO", "CARANPEJO"],
    },
    {
      id: 7,
      nome: "CAVALO-MARINHO",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["CAVALO-MARINHO", "CAVALO", "CAVALO-AQUATICO", "PEIXE-CAVALO"],
    },
    {
      id: 8,
      nome: "ESTRELA-DO-MAR",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["ESTRELA-DO-MAR", "ESTRELA", "ESTRELA-CADENTE", "PEIXE-ESTRELA"],
    },

    {
      id: 9,
      nome: "PEIXE-BOI",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["PEIXE-BOI", "BOI", "HIPOPÓTAMO", "PEIXE-PORCO"],
    },

    {
      id: 13,
      nome: "CONCHA",
      pergunta: "QUAL É O NOME DESSE OBJETO?",
      opcoes: ["CONCHA", "CORAL", "CARDUME", "CAMARÃO"],
    },

    {
      id: 21,
      nome: "POLVO",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["POLVO", "PEIXE", "PINGUIM", "PIRANHA"],
    },

    {
      id: 26,
      nome: "TARTARUGA",
      pergunta: "QUAL É O NOME DESSE ANIMAL?",
      opcoes: ["TARTARUGA", "TUBARÃO", "TATU", "TUCANO"],
    },
  ];

  const imagensAnimais = {
    3: "./img/ariranha.svg",
    4: "./img/baleia.svg",
    5: "./img/boto-cor-de-rosa.svg",
    6: "./img/caranguejo.svg",
    7: "./img/cavalo-marinho.svg",
    8: "./img/estrela-do-mar.svg",
    9: "./img/peixe-boi.svg",
    13: "./img/concha.svg",
    21: "./img/polvo.svg",
    26: "./img/tartaruga.svg",
  };

  const todasPerguntas = [...animais];
  shuffleArray(todasPerguntas);

  let perguntaAtual = 0;
  let respostasCorretasMar = 0;

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
      respostasCorretasMar++;
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
        action: "Acertos Quiz Mar " + diaAtual,
        result: `${respostasCorretasMar}/10`,
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

        if (respostasCorretasMar >= 9) {
          setTimeout(() => {
            estrela1.style.display = "flex";
          }, 500);

          setTimeout(() => {
            estrela2.style.display = "flex";
          }, 1500);

          setTimeout(() => {
            estrela3.style.display = "flex";
          }, 2500);
        } else if (respostasCorretasMar >= 4) {
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
        const minutes = Math.floor(marSegundos / 60);
        const seconds = marSegundos % 60;
        acertosSpan.textContent = `${respostasCorretasMar}/10`;
        tempoMar.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${
          seconds < 10 ? "0" : ""
        }${seconds}`;
        localStorage.setItem("respostasCorretasMar", respostasCorretasMar);

        setTimeout(() => {
          window.location.href =
            "../../../telas dialogo/agradecimento/agradecimento.html";
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
