// Seleção de elementos
const tarefaForm = document.querySelector("#tarefa-form");
const tarefaInput = document.querySelector("#tarefa-input");
const tarefaList = document.querySelector("#tarefa-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelaEditBtn = document.querySelector("#cancela-edit-btn");
const pesquisaInput = document.querySelector("#pesquisa-input");
const eraseBtn = document.querySelector("#erase-button");
const filtroBtn = document.querySelector("#filtro-select");

let oldInputValue;

// Funções
const savetarefa = (text, done = 0, save = 1) => {
  const tarefa = document.createElement("div");
  tarefa.classList.add("tarefa");

  const tarefaTitle = document.createElement("h3");
  tarefaTitle.innerText = text;
  tarefa.appendChild(tarefaTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-tarefa");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  tarefa.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-tarefa");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  tarefa.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-tarefa");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  tarefa.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    tarefa.classList.add("done");
  }

  if (save) {
    savetarefaLocalStorage({ text, done: 0 });
  }

  tarefaList.appendChild(tarefa);

  tarefaInput.value = "";
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  tarefaForm.classList.toggle("hide");
  tarefaList.classList.toggle("hide");
};

const updatetarefa = (text) => {
  const tarefas = document.querySelectorAll(".tarefa");

  tarefas.forEach((tarefa) => {
    let tarefaTitle = tarefa.querySelector("h3");

    if (tarefaTitle.innerText === oldInputValue) {
      tarefaTitle.innerText = text;

      // Utilizando dados da localStorage
      updatetarefaLocalStorage(oldInputValue, text);
    }
  });
};

const getpesquisaedtarefas = (pesquisa) => {   //Atribuir atalho de busca
  const tarefas = document.querySelectorAll(".tarefa");

  tarefas.forEach((tarefa) => {
    const tarefaTitle = tarefa.querySelector("h3").innerText.toLowerCase();

    tarefa.style.display = "flex";

    console.log(tarefaTitle);

    if (!tarefaTitle.includes(pesquisa)) {
      tarefa.style.display = "none";
    }
  });
};

const filtrotarefas = (filtroValue) => {  //Filtro entre Todos, Em andamento e Terminada
  const tarefas = document.querySelectorAll(".tarefa");

  switch (filtroValue) {
    case "all":
      tarefas.forEach((tarefa) => (tarefa.style.display = "flex"));

      break;

    case "done":
      tarefas.forEach((tarefa) =>
        tarefa.classList.contains("done")
          ? (tarefa.style.display = "flex")
          : (tarefa.style.display = "none")
      );

      break;

    case "tarefa":
      tarefas.forEach((tarefa) =>
        !tarefa.classList.contains("done")
          ? (tarefa.style.display = "flex")
          : (tarefa.style.display = "none")
      );

      break;

    default:
      break;
  }
};

//Acoes dos botoes a partir daqui 
tarefaForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = tarefaInput.value;

  if (inputValue) {
    savetarefa(inputValue);
  }
});

document.addEventListener("click", (e) => {          //Clique dos botões
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let tarefaTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    tarefaTitle = parentEl.querySelector("h3").innerText || "";
  }

  if (targetEl.classList.contains("finish-tarefa")) {    //Toggle para poder mudar a tarefa para feita ou não
    parentEl.classList.toggle("done");

    updatetarefaStatusLocalStorage(tarefaTitle);
  }

  if (targetEl.classList.contains("remove-tarefa")) {
    parentEl.remove();

    // Utilizando dados da localStorage
    removetarefaLocalStorage(tarefaTitle);
  }

  if (targetEl.classList.contains("edit-tarefa")) {
    toggleForms();

    editInput.value = tarefaTitle;
    oldInputValue = tarefaTitle;
  }
});

cancelaEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;

  if (editInputValue) {
    updatetarefa(editInputValue);
  }

  toggleForms();
});

pesquisaInput.addEventListener("keyup", (e) => {
  const pesquisa = e.target.value;

  getpesquisaedtarefas(pesquisa);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  pesquisaInput.value = "";

  pesquisaInput.dispatchEvent(new Event("keyup"));
});

filtroBtn.addEventListener("change", (e) => {
  const filtroValue = e.target.value;

  filtrotarefas(filtroValue);
});

// Local Storage
const gettarefasLocalStorage = () => {
  const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

  return tarefas;
};

const loadtarefas = () => {
  const tarefas = gettarefasLocalStorage();

  tarefas.forEach((tarefa) => {
    savetarefa(tarefa.text, tarefa.done, 0);
  });
};

const savetarefaLocalStorage = (tarefa) => {
  const tarefas = gettarefasLocalStorage();

  tarefas.push(tarefa);

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
};

const removetarefaLocalStorage = (tarefaText) => {
  const tarefas = gettarefasLocalStorage();

  const filtroedtarefas = tarefas.filtro((tarefa) => tarefa.text != tarefaText);

  localStorage.setItem("tarefas", JSON.stringify(filtroedtarefas));
};

const updatetarefaStatusLocalStorage = (tarefaText) => {
  const tarefas = gettarefasLocalStorage();

  tarefas.map((tarefa) =>
    tarefa.text === tarefaText ? (tarefa.done = !tarefa.done) : null
  );

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
};

const updatetarefaLocalStorage = (tarefaOldText, tarefaNewText) => {
  const tarefas = gettarefasLocalStorage();

  tarefas.map((tarefa) =>
    tarefa.text === tarefaOldText ? (tarefa.text = tarefaNewText) : null
  );

  localStorage.setItem("tarefas", JSON.stringify(tarefas));
};

loadtarefas();