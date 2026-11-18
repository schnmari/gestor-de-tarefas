const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { Before } = require("@cucumber/cucumber");

const estado = {
  campos: {},
  listaTarefas: [],
  listaFiltrada: null,
  erros: {},
  resposta: null,
  alertas: [],
};

const campoVazio = () => ({
  value: "",
  classList: { add() {}, remove() {} },
});

function montarCampos() {
  return {
    titulo: campoVazio(),
    descricao: campoVazio(),
    prioridade: campoVazio(),
    status: { value: "pendente", classList: { add() {}, remove() {} } },
    categoria: { value: "" },
    data_expiracao: { value: "" },
    favorita: { checked: false },
    "btn-salvar": { disabled: false, classList: { add() {}, remove() {} } },
    "erro-titulo": { textContent: "" },
    "erro-descricao": { textContent: "" },
    "erro-prioridade": { textContent: "" },
  };
}

// Zera o estado e instala os mocks usados pelo código sob teste.
function resetarEstado() {
  estado.campos = montarCampos();
  estado.listaTarefas = [];
  estado.listaFiltrada = null;
  estado.erros = {};
  estado.resposta = null;
  estado.alertas = [];

  global.document = {
    getElementById: (id) =>
      estado.campos[id] || {
        value: "",
        textContent: "",
        classList: { add() {}, remove() {} },
      },
    querySelectorAll: () => [],
    querySelector: () => null,
  };

  global.montarFormData = (dados) => dados;
  global.requisicao = async () => ({
    status: "ok",
    mensagem: "Tarefa criada com sucesso!",
    data: {},
  });
  global.alertaSucesso = async (mensagem) => {
    estado.alertas.push(mensagem);
  };
  global.alertaErro = async (mensagem) => {
    estado.alertas.push(mensagem);
  };
}

// Só os cenários marcados com @josue usam este hook
Before({ tags: "@josue" }, function () {
  resetarEstado();
});

// Carrega as regras reais do front (javascript/regras.js).
function carregarRegras() {
  if (typeof Regras === "undefined") {
    const caminho = path.resolve(__dirname, "../../javascript/regras.js");
    vm.runInThisContext(fs.readFileSync(caminho, "utf8"), {
      filename: caminho,
    });
  }
  return Regras;
}

// Ponte entre os steps e o código de regras.js.
const implementacao = {
  async cadastrarTarefa(dados, listaTarefas) {
    const regras = carregarRegras();
    const erros = regras.validarTarefa(dados);

    if (Object.keys(erros).length > 0) {
      return {
        status: "nok",
        mensagem: "Verifique os campos destacados.",
        data: erros,
      };
    }

    const tarefa = {
      id: listaTarefas.length + 1,
      titulo: dados.titulo,
      descricao: dados.descricao || null,
      status: dados.status || "pendente",
      prioridade: dados.prioridade,
      categoria_id: null,
      data_expiracao: null,
      favorita: false,
    };
    listaTarefas.push(tarefa);

    return {
      status: "ok",
      mensagem: "Tarefa criada com sucesso!",
      data: tarefa,
    };
  },

  async filtrarPorStatus(tarefas, status) {
    const regras = carregarRegras();
    return regras.filtrarPorStatus(tarefas, status);
  },
};

function obterImplementacao() {
  return implementacao;
}

function definirCampo(id, valor) {
  if (!estado.campos[id]) estado.campos[id] = campoVazio();
  estado.campos[id].value = valor;
}

function adicionarTarefa(titulo, status) {
  estado.listaTarefas.push({
    id: estado.listaTarefas.length + 1,
    titulo: titulo,
    status: status,
    prioridade: "media",
  });
}

module.exports = {
  estado,
  resetarEstado,
  obterImplementacao,
  definirCampo,
  adicionarTarefa,
};
