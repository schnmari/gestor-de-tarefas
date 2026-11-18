
const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// Caminhos dos arquivos reais do projeto
const caminhoRegras = path.join(__dirname, "../../javascript/regras.js");
const caminhoFormulario = path.join(__dirname, "../../javascript/formularioTarefa.js");
const caminhoAlterarTarefa = path.join(__dirname, "../../tarefas/javascript/alterarTarefa.js");

// Lê os arquivos de produção
const codigoRegras = fs.readFileSync(caminhoRegras, "utf8");
const codigoFormulario = fs.readFileSync(caminhoFormulario, "utf8");
const codigoAlterarTarefa = fs.readFileSync(caminhoAlterarTarefa, "utf8");

// Cria um contexto isolado para evitar conflitos com os testes dos colegas
const contextoTeste = {
    console,
    document: null,
    montarFormData: null,
    requisicao: null,
    alertaSucesso: null,
    alertaErro: null,
    URLSearchParams: require("url").URLSearchParams,
    window: null
};

vm.createContext(contextoTeste);

// Carrega as funções reais dentro do contexto isolado
vm.runInContext(
    codigoRegras + "\nglobalThis.Regras = Regras;",
    contextoTeste
);

vm.runInContext(
    codigoFormulario +
    "\nglobalThis.enviarFormularioTarefa = enviarFormularioTarefa;",
    contextoTeste
);

let camposDom;
let tarefa;
let requisicaoRealizada;
let mensagemSucesso;
let resultadoSalvamento;
let mensagemErro;
let enderecoRedirecionamento;

Before(function () {
    // Simula os campos da tela de edição
    camposDom = {
        titulo: { value: "Tarefa antiga" },
        descricao: { value: "Descrição antiga" },
        prioridade: { value: "media" },
        status: { value: "pendente" },
        categoria: { value: "" },
        data_expiracao: { value: "" },
        favorita: { checked: false },
        "btn-salvar": { disabled: false },
        "erro-titulo": {
            textContent: "",
            closest: function () {
                return null;
            }
        }
    };

    tarefa = {
        id: 1,
        titulo: "Tarefa antiga",
        descricao: "Descrição antiga",
        prioridade: "media",
        status: "pendente",
        categoria_id: null,
        data_expiracao: null,
        favorita: false
    };

    requisicaoRealizada = null;
    mensagemSucesso = null;
    resultadoSalvamento = null;
    mensagemErro = null;
    enderecoRedirecionamento = "";

    contextoTeste.document = {
        getElementById: function (id) {
            return camposDom[id] || null;
        },
        querySelectorAll: function () {
            return [];
        },
        addEventListener: function () {}
    };

    contextoTeste.window = {
        location: {
            search: "",
            href: ""
        }
    };

    contextoTeste.montarFormData = function (dados) {
        return dados;
    };

    contextoTeste.requisicao = async function (url, dados) {
        requisicaoRealizada = {
            url: url,
            dados: dados
        };

        return {
            status: "ok",
            mensagem: "Tarefa atualizada com sucesso!"
        };
    };

    contextoTeste.alertaSucesso = async function (mensagem) {
        mensagemSucesso = mensagem;
    };

    contextoTeste.alertaErro = async function (mensagem) {
        mensagemErro = mensagem;
    };
});

// CENÁRIO 1: Editar uma tarefa com sucesso

Given("que existe uma tarefa cadastrada", function () {
    assert.ok(tarefa);
    assert.strictEqual(tarefa.id, 1);
});

Given("estou na tela de edição dessa tarefa", function () {
    assert.strictEqual(camposDom.titulo.value, tarefa.titulo);
});

When('altero o título para {string}', function (titulo) {
    camposDom.titulo.value = titulo;
});

When('altero a descrição para {string}', function (descricao) {
    camposDom.descricao.value = descricao;
});

When('seleciono a prioridade {string}', function (prioridade) {
    camposDom.prioridade.value = prioridade;
});

When('clico em "Salvar alterações"', async function () {
    resultadoSalvamento = await contextoTeste.enviarFormularioTarefa(
        "../php/alterarTarefa.php?id=" + tarefa.id
    );
});

Then("o sistema deve salvar as alterações da tarefa", function () {
    assert.ok(
        requisicaoRealizada,
        "A requisição de salvamento não foi realizada."
    );

    assert.strictEqual(
        requisicaoRealizada.dados.titulo,
        "Estudar para a prova"
    );

    assert.strictEqual(
        requisicaoRealizada.dados.descricao,
        "Revisar os conteúdos da disciplina"
    );

    assert.strictEqual(
        requisicaoRealizada.dados.prioridade,
        "alta"
    );

    assert.strictEqual(resultadoSalvamento, true);
});

Then("deve apresentar uma confirmação de sucesso", function () {
    assert.strictEqual(
        mensagemSucesso,
        "Tarefa atualizada com sucesso!"
    );
});

// CENÁRIO 2: Tentar salvar uma tarefa sem título

When("apago o título da tarefa", function () {
    camposDom.titulo.value = "";
});

Then("o sistema deve impedir o salvamento", function () {
    assert.strictEqual(resultadoSalvamento, false);

    assert.strictEqual(
        requisicaoRealizada,
        null,
        "O sistema não deveria enviar uma tarefa inválida."
    );
});

Then('deve apresentar a mensagem {string}', function (mensagem) {
    assert.strictEqual(
        camposDom["erro-titulo"].textContent,
        mensagem
    );
});

// CENÁRIO 3: Tentar salvar um título com mais de 150 caracteres

When("informo um título com {int} caracteres", function (quantidade) {
    camposDom.titulo.value = "A".repeat(quantidade);
});

// CENÁRIO 4: Tentar editar uma tarefa inexistente

Given(
    "que acesso a tela de edição com um identificador inexistente",
    function () {
        contextoTeste.window.location.search = "?id=999";

        vm.runInContext(
            codigoAlterarTarefa +
            "\nglobalThis.carregarTarefa = carregarTarefa;",
            contextoTeste
        );
    }
);

When("o sistema tenta carregar a tarefa", async function () {
    contextoTeste.requisicao = async function (url) {
        requisicaoRealizada = { url: url };

        return {
            status: "erro",
            mensagem: "Tarefa não encontrada."
        };
    };

    await contextoTeste.carregarTarefa();

    enderecoRedirecionamento = contextoTeste.window.location.href;
});

Then("deve apresentar uma mensagem de erro", function () {
    assert.strictEqual(
        mensagemErro,
        "Tarefa não encontrada."
    );
});

Then("deve redirecionar para a lista de tarefas", function () {
    assert.strictEqual(
        enderecoRedirecionamento,
        "index.html"
    );
});
