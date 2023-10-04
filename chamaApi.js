document.addEventListener("DOMContentLoaded", function () {
    buscarDadosEPreencherTabela();
});

const corpoTabelaPersonagens = document.getElementById(
    "corpoTabelaPersonagens"
);

function buscarDadosEPreencherTabela() {
    axios
        .get("http://localhost:3000/listarTodosUsuarios")
        .then((response) => {
            const usuarios = response.data.usuarios;
            preencherTabela(usuarios);
        })
        .catch((error) => {
            console.error("Error fetching character data:", error);
        });
}

function preencherTabela(usuarios) {

    // clear table
    while (corpoTabelaPersonagens.firstChild) {
        corpoTabelaPersonagens.removeChild(corpoTabelaPersonagens.firstChild);
    }
    
    usuarios.forEach((usuario) => {
        // Cria uma nova linha na tabela.
        const linha = document.createElement("tr");

        // Cria células para cada dado do usuário e insere o texto.
        const idCelula = document.createElement("td");
        idCelula.textContent = usuario.id;
        linha.appendChild(idCelula);

        // Cria células para cada dado do usuário e insere o texto.
        const nomeCelula = document.createElement("td");
        nomeCelula.textContent = usuario.nome;
        linha.appendChild(nomeCelula);

        const emailCelula = document.createElement("td");
        emailCelula.textContent = usuario.email;
        linha.appendChild(emailCelula);

        const disciplinaCelula = document.createElement("td");
        disciplinaCelula.textContent = usuario.disciplina;
        linha.appendChild(disciplinaCelula);

        // Cria células para os botões de editar e excluir.
        const acoesCelula = document.createElement("td");
        const editarBotao = document.createElement("a");
        editarBotao.href = "#";
        editarBotao.className = "btn btn-primary btn-edit";
        editarBotao.textContent = "Editar";
        editarBotao.dataset.id = usuario.id;
        acoesCelula.appendChild(editarBotao);

        const excluirBotao = document.createElement("a");
        excluirBotao.href = "#";
        excluirBotao.className = "btn btn-danger btn-delete";
        excluirBotao.textContent = "Excluir";
        excluirBotao.dataset.id = usuario.id;
        acoesCelula.appendChild(excluirBotao);

        linha.appendChild(acoesCelula);

        corpoTabelaPersonagens.appendChild(linha);
    });
}

// const botaoChamarAPI = document.getElementById("botaoChamarAPI");
// botaoChamarAPI.addEventListener("click", () => {
//     buscarDadosEPreencherTabela();
// });


// CREATE ---------------------------------------------------------------------

document
    .querySelector("#btnCadastrarUsuario")
    .addEventListener("click", function () {
        const nome = document.querySelector("#nome").value;
        const email = document.querySelector("#email").value;
        const disciplina = document.querySelector("#disciplina").value;
        const senha = document.querySelector("#senha").value;

        create(nome, email, disciplina, senha);
    });

function create(nome, email, disciplina, senha) {
    console.log("Dados capturados para cadastro:");
    console.log("Nome:", nome);
    console.log("Email:", email);
    console.log("Disciplina:", disciplina);
    console.log("Senha:", senha);

    const novoUsuario = {
        nome: nome,
        email: email,
        disciplina: disciplina,
        senha: senha,
    };

    axios
        .post("http://localhost:3000/cadastrarUsuario", novoUsuario, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            console.log("Usuário cadastrado com sucesso:", response.data);
            $("#cadastrarUsuario").modal("hide");
            alert("Usuário cadastrado com sucesso");
            buscarDadosEPreencherTabela();
        })
        .catch((error) => {
            alert("Error ao cadastrar usuário:", error);
        });
}

// DELETE ---------------------------------------------------------------------

document.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("btn-delete")) {
        const id = event.target.dataset.id;
        deleteUser(id);
    }
});

function deleteUser(id) {
    const confirmacao = confirm("Tem certeza que deseja excluir este usuário?");
    if (confirmacao) {
        axios
            .delete(`http://localhost:3000/deletarUsuario/${id}`)
            .then((response) => {
                console.log("Usuário deletado com sucesso!");
                buscarDadosEPreencherTabela();
            })
            .catch((error) => {
                console.error("Ocoreu um erro ao deletar usuário: ", error);
            });
    } else {
        console.log("Exclusão cancelada pelo usuário");
    }
}


// UPDATE ---------------------------------------------------------------------

document.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("btn-edit")) {
        const id = event.target.dataset.id;
        document.documentElement.dataset.idUsuario = id;
        findById(id);
    }
});

function findById(id) {
    axios
        .get(`http://localhost:3000/pegarUsuarioPeloId/${id}`)
        .then((response) => {
            const usuario = response.data.usuario;

            document.querySelector('#editarUsuario input[type="text"]').value =
                usuario.nome;
            document.querySelector('#editarUsuario input[type="email"]').value =
                usuario.email;
            document.querySelector("#editarUsuario textarea").value =
                usuario.disciplina;

            $("#editarUsuario").modal("show");
        })
        .catch((error) => {
            alert("Ocorreu um erro ao recuperar usuário: ", error);
        });
}
