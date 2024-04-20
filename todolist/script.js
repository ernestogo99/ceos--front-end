//seleção de elementos
const todoform = document.querySelector("#todo-form");
const todoinput = document.querySelector("#todo-input");
const todolist = document.querySelector("#todo-list");
const editform = document.querySelector("#edit-form");
const editinput = document.querySelector("#edit-input");
const canceleditbtn = document.querySelector("#cancel-edit-btn");
const searchinput = document.querySelector("#search-input");

let oldinputvalue;
//funções
const savetodo = (text) => {
  const todo = document.createElement("div"); //cria uma div onde vai ficar a tarefa
  todo.classList.add("todo"); //adicionando uma classe a essa div

  const todotitle = document.createElement("h3"); //criando o titulo
  todotitle.innerText = text; //colocando o texto criado no elemento que eu criei
  todo.appendChild(todotitle); //colocando o h3 no todo

  const donebtn = document.createElement("button"); //criando o botão de feito
  donebtn.classList.add("finish-todo");
  donebtn.innerHTML = '<i class="fa-solid fa-check" ></i>'; //colocar o icone no botão
  todo.appendChild(donebtn); //colocando o botão feito no todo

  const editbtn = document.createElement("button"); //criando o botão de editar
  editbtn.classList.add("edit-todo");
  editbtn.innerHTML = '<i class="fa-solid fa-pen" ></i>'; //colocar o icone no botão
  todo.appendChild(editbtn); //colocando o botão feito no todo

  const deletebtn = document.createElement("button"); //criando o botão de deletar
  deletebtn.classList.add("remove-todo");
  deletebtn.innerHTML = '<i class="fa-solid fa-xmark" ></i>'; //colocar o icone no botão
  todo.appendChild(deletebtn); //colocando o botão feito no todo

  todolist.appendChild(todo); //colocando o todo na lista geral

  todoinput.value = ""; //apagar o que foi escrito após adicionar
  todoinput.focus(); //focar no input que adiciona tarefas
};

const toggleforms = () => {
  editform.classList.toggle("hide"); //adiciona e tira a classe hide
  todoform.classList.toggle("hide");
  todolist.classList.toggle("hide");
  //quando o usuario clicar,só ira aparecer o editar
};

const updatetodo = (text) => {
  const todos = document.querySelectorAll(".todo");
  //percorrer o array de todos e selecionar o que eu quero
  todos.forEach((todo) => {
    let todotitle = todo.querySelector("h3"); //pegando o titulo
    if (todotitle.innerText === oldinputvalue) {
      todotitle.innerText = text;
    }
  });
};

const getsearhchedtodos = (search) => {
  const todos = document.querySelectorAll(".todo");
  todos.forEach((todo) => {
    const todotitle = todo.querySelector("h3").innerText.toLowerCase();
    todo.style.display = "flex";
    console.log(todotitle);
    if (!todotitle.includes(search)) {
      todo.style.display = "none";
    }
  });
};

//eventos
todoform.addEventListener("submit", (e) => {
  e.preventDefault(); // faz  com que o formulario não seja enviado diretamente
  const inputvalue = todoinput.value; //pegar o value do input para poder criar a tarefa nova

  //garantir que o usuario não crie tarefas sem titulo
  if (inputvalue) {
    savetodo(inputvalue);
  }
});

//identificar o clique nos botões
document.addEventListener("click", (e) => {
  const targetel = e.target;
  const parentel = targetel.closest("div"); // como o evento é aplicado no elemento pai,nós precisamos dele
  let todotitle;

  if (parentel && parentel.querySelector("h3")) {
    todotitle = parentel.querySelector("h3").innerText;
  }
  if (targetel.classList.contains("finish-todo")) {
    parentel.classList.toggle("done"); //adiciona e tira a classe
  }

  if (targetel.classList.contains("remove-todo")) {
    parentel.remove();
  }
  if (targetel.classList.contains("edit-todo")) {
    toggleforms();
    editinput.value = todotitle;
    oldinputvalue = todotitle;
  }
});

canceleditbtn.addEventListener("click", (e) => {
  e.preventDefault(); //para não enviar o formulario

  toggleforms();
});

editform.addEventListener("submit", (e) => {
  e.preventDefault();

  const editinputvalue = editinput.value;

  if (editinputvalue) {
    updatetodo(editinputvalue);
  }

  toggleforms();
});

searchinput.addEventListener("keyup", (e) => {
  const search = e.target.value;
  getsearhchedtodos(search);
});
