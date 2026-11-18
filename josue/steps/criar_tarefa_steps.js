const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const suporte = require("./suporte");

Given("que o formulário de nova tarefa está aberto", function () {
  suporte.resetarEstado();
});

When("eu preencho o título {string}", function (titulo) {
  suporte.definirCampo("titulo", titulo);
});

When("eu preencho a descrição {string}", function (descricao) {
  suporte.definirCampo("descricao", descricao);
});

When("eu preencho a prioridade {string} no formulário", function (prioridade) {
  suporte.definirCampo("prioridade", prioridade);
});

When("eu cadastro a tarefa", async function () {
  const implementacao = suporte.obterImplementacao();

  const dados = {
    titulo: suporte.estado.campos.titulo.value,
    descricao: suporte.estado.campos.descricao.value,
    prioridade: suporte.estado.campos.prioridade.value,
  };

  suporte.estado.resposta = await implementacao.cadastrarTarefa(
    dados,
    suporte.estado.listaTarefas,
  );
  suporte.estado.erros = suporte.estado.resposta.data || {};
});

Then(
  "a tarefa {string} deve estar cadastrada com prioridade {string}",
  function (titulo, prioridade) {
    const tarefa = suporte.estado.listaTarefas.find((t) => t.titulo === titulo);
    assert.ok(tarefa, `A tarefa "${titulo}" deveria ter sido cadastrada.`);
    assert.strictEqual(tarefa.prioridade, prioridade);
  },
);

Then("a lista de tarefas deve conter {int} tarefa(s)", function (quantidade) {
  assert.strictEqual(suporte.estado.listaTarefas.length, quantidade);
});

Then(
  "o campo {string} deve exibir o erro {string}",
  function (campo, mensagem) {
    assert.strictEqual(suporte.estado.erros[campo], mensagem);
  },
);
