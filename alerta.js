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
