const lista = document.querySelector(".lista");
const adicionar = document.querySelector("#addDebt");

function atualizarDados() {
    fetch("https://provadev.xlab.digital/api/v1/divida?uuid=660bed45-4aba-420b-b7b9-257abe1d896b", { method: "GET" })
    .then(res => {
        res.json().then(val => {
            fetch("https://jsonplaceholder.typicode.com/users", { method: "GET" })
                .then(resultado => {
                    resultado.json().then(valor => {
                        var users = valor;
                        var novoArray = [];
                        for (const divida of val.result) {
                            const nome = users.filter(index => {
                                return index.id == divida.idUsuario;
                            });
                            
                            novoArray.push({
                                nome: nome[0].name,
                                id: divida.idUsuario,
                                idDivida: divida._id,
                                preco: divida.valor,
                                data: new Date(divida.criado).toLocaleDateString("pt-BR"),
                                descricao: divida.motivo
                            });
                        }

                        renderizarDados(novoArray);
                    });
                });
        });
    });
}

atualizarDados();



function renderizarDados(data) {
    lista.innerHTML = "";
    for (var objeto of data) {
        lista.innerHTML +=
            `<div class="item">
            <div class="upper-container">
                <p>${XSSaquiNao(objeto.nome)}</p>
                <p>${XSSaquiNao(String(objeto.preco.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})))}</p>
                <p>${XSSaquiNao(objeto.data)}</p>
            </div>
            <div class="lower-container">
                <p>${XSSaquiNao(objeto.descricao)}</p>
                <div class="edit-buttons">
                    <button onclick="editarDivida('${objeto.idDivida}')">Editar</button>
                    <button onclick="excluir('${objeto.idDivida}')">Excluir</button>
                </div>
            </div>
        </div>`;
    }
}

function excluir(id) {
    axios.delete(`https://provadev.xlab.digital/api/v1/divida/${id}?uuid=660bed45-4aba-420b-b7b9-257abe1d896b`)
    .then(res => {
        alert(`Dívida deletada com sucesso!`);
        atualizarDados();
    });
}

function editarDivida(id) {
    axios.get(`https://provadev.xlab.digital/api/v1/divida/${id}?uuid=660bed45-4aba-420b-b7b9-257abe1d896b`)
    .then(res => {
        const data = res.data.result;

        const cliente = document.querySelector("#clienteEdit");
        const motivo = document.querySelector("#motivoEdit");
        const valor = document.querySelector("#valorEdit");
        const idUser = document.querySelector("#idUsuario");

        const modal = document.querySelector(".modal-edit");

        cliente.value = data.idUsuario;
        motivo.value = data.motivo;
        valor.value = data.valor;
        idUser.value = data._id

        modal.classList.remove("hidden");
    });

}

function salvar() {
    const cliente = document.querySelector("#clienteEdit").value;
    const motivo = document.querySelector("#motivoEdit").value;
    const valor = document.querySelector("#valorEdit").value;
    const idUser = document.querySelector("#idUsuario").value;

    const newData = {
        idUsuario: cliente,
        motivo,
        valor
    };
    
    axios.put(`https://provadev.xlab.digital/api/v1/divida/${idUser}?uuid=660bed45-4aba-420b-b7b9-257abe1d896b`, newData)
    .then(res => {
        console.log(res);
        const modal = document.querySelector(".modal-edit");
        modal.classList.add("hidden");
        atualizarDados();
    });
}

retornarNomes();

const cliente = document.querySelector("#cliente");
const clienteEdit = document.querySelector("#clienteEdit");

const closeAdd = document.querySelector("#closeAdd");
const closeEdit = document.querySelector("#closeEdit");

adicionar.addEventListener("click", event => {
    const modal = document.querySelector(".modal-add");
    modal.classList.remove("hidden");
});

closeAdd.addEventListener("click", event => {
    const modal = document.querySelector(".modal-add");
    modal.classList.add("hidden");
});

closeEdit.addEventListener("click", event => {
    const modal = document.querySelector(".modal-edit");
    modal.classList.add("hidden");
});

function retornarNomes() {
    fetch("https://jsonplaceholder.typicode.com/users", { method: "GET" })
    .then(res => {
        res.json().then(val => {
            for(var indice of val) {
                cliente.innerHTML += `<option value="${indice.id}">${XSSaquiNao(indice.name)}</option>`;
                clienteEdit.innerHTML += `<option value="${indice.id}">${XSSaquiNao(indice.name)}</option>`;
            }
        });
    });
}

function criarDivida() {
    const idUsuario = document.querySelector("#cliente").value;
    const motivo = document.querySelector("#motivo").value;
    const valor = document.querySelector("#valor").value;
    
    const objeto = {
        idUsuario: parseInt(idUsuario),
        motivo: motivo,
        valor: parseFloat(valor)
    };

    axios.post("https://provadev.xlab.digital/api/v1/divida?uuid=660bed45-4aba-420b-b7b9-257abe1d896b", objeto)
    .then(res => {
        const modal = document.querySelector(".modal-add");
        modal.classList.add("hidden");
        atualizarDados();
    });
}

function XSSaquiNao(texto) {
    return texto.replace(/&/g, "&amp").replace(/</g, "&lt").replace(/>/g, "&gt");
}