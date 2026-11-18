const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let elementosDOM = {};
let listaTarefas = [];
let listaCategorias = [];

function criarMockDOM() {
    elementosDOM = {
        'titulo': { value: '', classList: { add: () => {}, remove: () => {} } },
        'descricao': { value: '', classList: { add: () => {}, remove: () => {} } },
        'prioridade': { value: 'media', classList: { add: () => {}, remove: () => {} } },
        'status': { value: 'pendente', classList: { add: () => {}, remove: () => {} } },
        'categoria': { value: '', innerHTML: '', children: [], appendChild: function (opt) { this.children.push(opt); } },
        'data_expiracao': { value: '', classList: { add: () => {}, remove: () => {} } },
        'favorita': { checked: false },
        'btn-salvar': { disabled: false },
        'erro-titulo': { textContent: '', closest: () => null },
        'erro-categoria_id': { textContent: '', closest: () => null },
        'caixa-nova-categoria': { hidden: true },
        'nova-categoria-nome': { value: '', focus: () => {}, addEventListener: () => {} },
        'erro-nome': { textContent: '' }
    };

    global.document = {
        getElementById: (id) => elementosDOM[id] || { value: '', textContent: '', hidden: false, focus: () => {}, addEventListener: () => {} },
        querySelectorAll: () => [],
        addEventListener: () => {}
    };

    global.Option = function (texto, valor) {
        return { text: texto, value: valor };
    };

    global.montarFormData = (dados) => dados;
    global.alertaSucesso = async () => {};
    global.alertaErro = async () => {};
    global.avisoRapido = () => {};

    global.requisicao = async (url, dados) => {
        if (url.includes('novaTarefa.php')) {
            const novaTarefa = {
                id: listaTarefas.length + 1,
                titulo: dados.titulo,
                categoria_id: dados.categoria_id ? Number(dados.categoria_id) : null
            };
            listaTarefas.push(novaTarefa);
            return { status: 'ok', mensagem: 'Tarefa criada com sucesso!', data: novaTarefa };
        }
        if (url.includes('novaCategoria.php')) {
            const novaCategoria = {
                id: listaCategorias.length + 1,
                nome: dados.nome
            };
            listaCategorias.push(novaCategoria);
            return { status: 'ok', mensagem: 'Categoria criada com sucesso!', data: novaCategoria };
        }
        if (url.includes('getCategorias.php')) {
            return { status: 'ok', mensagem: 'Categorias carregadas', data: listaCategorias };
        }
        return { status: 'ok', data: [] };
    };
}

function carregarScriptsProducao() {
    if (typeof Regras === 'undefined') {
        const caminhoRegras = path.resolve(__dirname, '../../javascript/regras.js');
        const codigoRegras = fs.readFileSync(caminhoRegras, 'utf8');
        vm.runInThisContext(codigoRegras);
    }

    const caminhoFormulario = path.resolve(__dirname, '../../javascript/formularioTarefa.js');
    const codigoFormulario = fs.readFileSync(caminhoFormulario, 'utf8');
    vm.runInThisContext(codigoFormulario);

    const caminhoCategorias = path.resolve(__dirname, '../../categorias/javascript/categorias.js');
    const codigoCategorias = fs.readFileSync(caminhoCategorias, 'utf8').replace('const URL_CATEGORIAS', 'var URL_CATEGORIAS');
    vm.runInThisContext(codigoCategorias);
}

// --- Steps do Cenário 01 ---

Given('que estou no formulário de nova tarefa com a categoria {string} de id {string} disponível', function (nomeCategoria, idCategoria) {
    listaTarefas = [];
    listaCategorias = [{ id: Number(idCategoria), nome: nomeCategoria }];
    criarMockDOM();
    carregarScriptsProducao();
});

When('preencho o campo título com {string}', function (titulo) {
    global.document.getElementById('titulo').value = titulo;
});

When('seleciono a categoria de id {string} no formulário', function (idCategoria) {
    global.document.getElementById('categoria').value = idCategoria;
});

When('envio o formulário para salvar a tarefa', async function () {
    await global.enviarFormularioTarefa('../php/novaTarefa.php');
});

Then('a tarefa deve ser salva na lista com o título {string} e categoria_id {int}', function (tituloEsperado, idCategoriaEsperado) {
    assert.strictEqual(listaTarefas.length, 1, 'Deveria existir 1 tarefa salva na lista');
    assert.strictEqual(listaTarefas[0].titulo, tituloEsperado);
    assert.strictEqual(listaTarefas[0].categoria_id, idCategoriaEsperado);
});

// --- Steps do Cenário 02 ---

Given('que estou no formulário de nova tarefa com {int} categorias padrão cadastradas', function (qtdCategorias) {
    listaTarefas = [];
    listaCategorias = [
        { id: 1, nome: 'Casa' },
        { id: 2, nome: 'Trabalho' },
        { id: 3, nome: 'Estudos' }
    ].slice(0, qtdCategorias);
    criarMockDOM();
    carregarScriptsProducao();
});

When('abro a caixa de nova categoria e digito o nome {string}', function (nomeNovaCategoria) {
    global.abrirNovaCategoria(true);
    global.document.getElementById('nova-categoria-nome').value = nomeNovaCategoria;
});

When('clico para salvar a nova categoria', async function () {
    await global.salvarCategoria();
});

Then('a categoria {string} deve ser cadastrada e ficar selecionada com id {string} no campo categoria', function (nomeEsperado, idEsperado) {
    const criada = listaCategorias.find((c) => c.nome === nomeEsperado);
    assert.ok(criada, 'A nova categoria deveria ter sido adicionada à lista');
    assert.strictEqual(global.document.getElementById('categoria').value, idEsperado);
});