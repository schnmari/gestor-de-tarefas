const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Carrega o código real do projeto no mesmo contexto do teste:
// regras.js (cálculo), getTarefas.js (mostra o progresso na tela) e acoesTarefa.js (altera o status)
const caminhoRegras = path.resolve(__dirname, '../../javascript/regras.js');
const caminhoGetTarefas = path.resolve(__dirname, '../../tarefas/javascript/getTarefas.js');
const caminhoAcoes = path.resolve(__dirname, '../../tarefas/javascript/acoesTarefa.js');

// O regras.js também é carregado nos steps de outros integrantes e declara "const Regras".
// Carregar duas vezes dá erro, então só carrega se ainda não existir
if (typeof Regras === 'undefined') {
    vm.runInThisContext('{' + fs.readFileSync(caminhoRegras, 'utf8') + '\nglobalThis.Regras = Regras;\n}');
}

// O getTarefas.js registra um evento no document assim que é carregado
if (typeof renderizarProgresso === 'undefined') {
    global.document = { addEventListener: () => {} };
    vm.runInThisContext(fs.readFileSync(caminhoGetTarefas, 'utf8'));
}

vm.runInThisContext(fs.readFileSync(caminhoAcoes, 'utf8'));

// Status como aparece no Gherkin -> como é salvo no banco
const STATUS = {
    'Pendente': 'pendente',
    'Em andamento': 'em_andamento',
    'Concluída': 'concluida'
};

// declaração de variáveis pra simular ambiente
let listaTarefas = [];
let camposProgresso = {};

Before(function () {
    // Reseta o estado antes de rodar o cenário
    listaTarefas = [];

    // Sem navegador no teste, o DOM é simulado só com os campos
    // do card "Seu progresso" que renderizarProgresso() preenche
    camposProgresso = {
        'texto-progresso': { textContent: '' },
        'percentual-progresso': { textContent: '' },
        'barra-progresso': { value: 0 },
        'num-total': { textContent: '' },
        'num-concluidas': { textContent: '' },
        'num-restantes': { textContent: '' }
    };
});

// Executa as funções reais que calculam e mostram o progresso (Func. 11)
function mostrarProgressoNaTela() {
    global.document = { getElementById: (id) => camposProgresso[id] };
    renderizarProgresso(Regras.calcularProgresso(listaTarefas));
}

// Cenário 1

Given('que não tenho nenhuma tarefa cadastrada', function () {
    listaTarefas = [];
});

When('eu abro a tela principal de tarefas', function () {
    mostrarProgressoNaTela();
});

Then('o progresso deve mostrar {string}', function (textoEsperado) {
    assert.strictEqual(camposProgresso['texto-progresso'].textContent, textoEsperado);
});

Then('o percentual de progresso deve ser {string}', function (percentualEsperado) {
    assert.strictEqual(camposProgresso['percentual-progresso'].textContent, percentualEsperado);
    // A barra de progresso precisa estar no mesmo valor do texto
    assert.strictEqual(camposProgresso['barra-progresso'].value + '%', percentualEsperado);
});

// Cenário 2

Given('que tenho {int} tarefas cadastradas, sendo {int} concluídas', function (total, concluidas) {
    for (let i = 1; i <= total; i++) {
        listaTarefas.push({
            id: i,
            titulo: 'Tarefa ' + i,
            status: i <= concluidas ? 'concluida' : 'pendente'
        });
    }
});

// Cenários 3 e 4

Given('que minhas tarefas são:', function (tabela) {
    listaTarefas = tabela.hashes().map((linha, i) => ({
        id: i + 1,
        titulo: linha.titulo,
        status: STATUS[linha.status]
    }));
});

// Cenário 4

When('eu altero o status da tarefa {string} para {string}', async function (titulo, novoStatus) {
    const tarefa = listaTarefas.find(t => t.titulo === titulo);

    // mock: o PHP é substituído por uma alteração na lista em memória
    global.montarFormData = (dados) => dados;
    global.avisoRapido = () => {};
    global.alertaErro = () => {};
    global.requisicao = async (url, dados) => {
        tarefa.status = dados.status;
        return { status: 'ok', mensagem: 'Status atualizado!' };
    };

    // Executa a função real que altera o status
    await alterarStatusTarefa(tarefa.id, STATUS[novoStatus]);

    // Depois de alterar, a tela recarrega as tarefas e mostra o progresso de novo
    mostrarProgressoNaTela();
});
