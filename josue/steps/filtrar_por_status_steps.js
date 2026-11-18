const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const suporte = require("./suporte");

Given(
  "que a lista contém a tarefa {string} com status {string}",
  function (titulo, status) {
    suporte.adicionarTarefa(titulo, status);
  },
);

When("eu aplicar o filtro de status {string}", async function (status) {
  const implementacao = suporte.obterImplementacao();

  suporte.estado.resposta = await implementacao.filtrarPorStatus(
    suporte.estado.listaTarefas,
    status,
  );
  suporte.estado.listaFiltrada = suporte.estado.resposta;
});

Then("a lista filtrada deve conter {int} tarefa(s)", function (quantidade) {
  assert.strictEqual(suporte.estado.listaFiltrada.length, quantidade);
});

Then("a lista filtrada deve conter a tarefa {string}", function (titulo) {
  const encontrou = suporte.estado.listaFiltrada.some(
    (t) => t.titulo === titulo,
  );
  assert.strictEqual(
    encontrou,
    true,
    `A tarefa "${titulo}" deveria aparecer no filtro.`,
  );
});

Then("a lista filtrada não deve conter a tarefa {string}", function (titulo) {
  const encontrou = suporte.estado.listaFiltrada.some(
    (t) => t.titulo === titulo,
  );
  assert.strictEqual(
    encontrou,
    false,
    `A tarefa "${titulo}" não deveria aparecer no filtro.`,
  );
});
