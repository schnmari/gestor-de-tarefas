const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let tarefasNaMemoria = [];
let tarefasVisiveis = [];

function carregarRegrasProducao() {
    const caminhoRegras = path.resolve(__dirname, '../../javascript/regras.js');
    const codigoRegras = fs.readFileSync(caminhoRegras, 'utf8');
    vm.runInThisContext(codigoRegras.replace('const Regras =', 'global.Regras ='));
}

Given('que o usuário está na tela principal de listagem de tarefas', function () {
    tarefasNaMemoria = [];
    tarefasVisiveis = [];
    carregarRegrasProducao();

    global.document = {
        getElementById: (id) => ({ value: '', textContent: '', hidden: false, addEventListener: () => {} }),
        querySelector: () => ({ value: 'todos', checked: true }),
        querySelectorAll: () => [],
        addEventListener: () => {}
    };
});

Given('existem tarefas não favoritas cadastradas com datas {string}, {string} e uma tarefa {string}', function (data1, data2, semData) {
    tarefasNaMemoria = [
        { id: 1, titulo: 'Tarefa 1', status: 'pendente', prioridade: 'media', favorita: false, data_expiracao: data1 },
        { id: 2, titulo: 'Tarefa 2', status: 'pendente', prioridade: 'media', favorita: false, data_expiracao: data2 },
        { id: 3, titulo: semData,    status: 'pendente', prioridade: 'media', favorita: false, data_expiracao: null }
    ];
});

When('ele seleciona a opção {string} no campo "Ordenar por"', function (opcaoSelecionada) {
    const mapaOrdenacao = {
        'Mais recentes': 'padrao',
        'Expiração mais próxima': 'expiracao_asc',
        'Expiração mais distante': 'expiracao_desc'
    };

    const criterios = {
        status: 'todos',
        prioridade: 'todas',
        texto: '',
        ordenacao: mapaOrdenacao[opcaoSelecionada] || 'padrao'
    };

    tarefasVisiveis = global.Regras.aplicarFiltros(tarefasNaMemoria, criterios);
});

Then('o sistema reordena a lista exibindo primeiro a tarefa que expira em {string}, seguida pela de {string}', function (primeiraDataEsperada, segundaDataEsperada) {
    const primeiraFormatada = global.Regras.formatarData(tarefasVisiveis[0].data_expiracao);
    const segundaFormatada = global.Regras.formatarData(tarefasVisiveis[1].data_expiracao);

    assert.strictEqual(primeiraFormatada, primeiraDataEsperada);
    assert.strictEqual(segundaFormatada, segundaDataEsperada);
});

Then('posiciona a tarefa {string} no final da lista', function (textoSemData) {
    const ultimaTarefa = tarefasVisiveis[tarefasVisiveis.length - 1];
    assert.strictEqual(ultimaTarefa.data_expiracao, null);
    assert.strictEqual(ultimaTarefa.titulo, textoSemData);
});

Then('mantém a tarefa {string} no final da lista', function (textoSemData) {
    const ultimaTarefa = tarefasVisiveis[tarefasVisiveis.length - 1];
    assert.strictEqual(ultimaTarefa.data_expiracao, null);
    assert.strictEqual(ultimaTarefa.titulo, textoSemData);
});