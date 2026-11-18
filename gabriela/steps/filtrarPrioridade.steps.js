
const { Given, When, Then, Before } = require("@cucumber/cucumber");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

// Carrega o código real de regras.js
const caminhoRegras = path.resolve(
    __dirname,
    "../../javascript/regras.js"
);

const codigoRegras = fs.readFileSync(caminhoRegras, "utf8");

let contextoTeste;
let tarefas;
let resultado;

// Prepara um ambiente isolado para cada cenário
Before(function () {
    contextoTeste = {};

    vm.createContext(contextoTeste);

    vm.runInContext(
        codigoRegras + "\nglobalThis.Regras = Regras;",
        contextoTeste
    );

    tarefas = [];
    resultado = [];
});

// Cenários 1 e 2
Given("que existem tarefas cadastradas com diferentes prioridades", function () {
    tarefas = [
        { id: 1, titulo: "Estudar Python", prioridade: "alta" },
        { id: 2, titulo: "Fazer atividade", prioridade: "media" },
        { id: 3, titulo: "Organizar arquivos", prioridade: "baixa" },
        { id: 4, titulo: "Revisar conteúdo", prioridade: "alta" }
    ];
});

// Cenário 3
Given("que existem tarefas cadastradas apenas com prioridades média e baixa", function () {
    tarefas = [
        { id: 1, titulo: "Fazer atividade", prioridade: "media" },
        { id: 2, titulo: "Organizar arquivos", prioridade: "baixa" }
    ];
});

// Seleciona uma prioridade para filtrar
When("escolho a prioridade {string} para filtrar", function (prioridade) {
    resultado = contextoTeste.Regras.filtrarPorPrioridade(
        tarefas,
        prioridade
    );
});

// Seleciona todas as prioridades
When("seleciono a opção {string} as prioridades", function (opcao) {
    resultado = contextoTeste.Regras.filtrarPorPrioridade(
        tarefas,
        opcao
    );
});

// Verifica se aparecem somente tarefas da prioridade selecionada
Then("devem ser exibidas apenas as tarefas com prioridade {string}", function (prioridade) {
    assert.ok(resultado.length > 0);

    resultado.forEach(function (tarefa) {
        assert.strictEqual(tarefa.prioridade, prioridade);
    });

    const esperadas = tarefas.filter(function (tarefa) {
        return tarefa.prioridade === prioridade;
    });

    assert.deepStrictEqual(
        resultado.map(function (tarefa) {
            return tarefa.id;
        }),
        esperadas.map(function (tarefa) {
            return tarefa.id;
        })
    );
});

// Verifica se todas as tarefas foram retornadas
Then("devem ser exibidas todas as tarefas cadastradas", function () {
    assert.deepStrictEqual(
        resultado.map(function (tarefa) {
            return tarefa.id;
        }),
        tarefas.map(function (tarefa) {
            return tarefa.id;
        })
    );
});

// Verifica quando não existem tarefas com a prioridade selecionada
Then("nenhuma tarefa deve ser exibida", function () {
    assert.strictEqual(resultado.length, 0);
});
