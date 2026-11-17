const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Carrega o código real do projeto (regras.js e formularioTarefa.js) no mesmo
// contexto do teste, então o que roda aqui é o que roda no navegador
const caminhoRegras = path.resolve(__dirname, '../../javascript/regras.js');
const caminhoFormulario = path.resolve(__dirname, '../../javascript/formularioTarefa.js');

vm.runInThisContext(fs.readFileSync(caminhoRegras, 'utf8'));
vm.runInThisContext(fs.readFileSync(caminhoFormulario, 'utf8'));

// Estado compartilhado entre os passos
let camposDom = {};
let listaTarefas = [];
let tarefaEmEdicao = null;

Before(function () {
    listaTarefas = [];
    tarefaEmEdicao = null;

    // Sem navegador no teste, o DOM é simulado só com os campos que
    // lerFormularioTarefa() e mostrarErrosFormulario() chegam a acessar
    camposDom = {
        'titulo': { value: '', classList: { add: () => {}, remove: () => {} } },
        'descricao': { value: '' },
        'prioridade': { value: '', classList: { add: () => {}, remove: () => {} } },
        'status': { value: 'pendente' },
        'categoria': { value: '' },
        'data_expiracao': { value: '' },
        'favorita': { checked: false },
        'btn-salvar': { disabled: false },
        'erro-titulo': { textContent: '', closest: () => null },
        'erro-prioridade': { textContent: '', closest: () => null }
    };

    // Id que não existe na lista acima devolve um campo vazio,
    // evitando erro de "undefined" no código testado
    global.document = {
        getElementById: (id) => camposDom[id] || { value: '', textContent: '', closest: () => null },
        querySelectorAll: () => []
    };

    // Rede e alertas ficam fora do teste: montarFormData só repassa
    // os dados e os alertas não fazem nada
    global.montarFormData = (dados) => dados;
    global.alertaSucesso = async () => {};
    global.alertaErro = async () => {};
});

// Cenário 1

Given('que estou no formulário de nova tarefa', function () {
    camposDom['titulo'].value = '';
    camposDom['prioridade'].value = '';
});

Given('preenchi o título {string}', function (titulo) {
    camposDom['titulo'].value = titulo;
});

When('eu escolho a prioridade {string}', function (prioridade) {
    camposDom['prioridade'].value = prioridade;
});

When('salvo a tarefa', async function () {
    // O PHP é substituído por uma gravação ou atualização na lista em memória
    global.requisicao = async (url, dados) => {
        if (tarefaEmEdicao) {
            tarefaEmEdicao.titulo = dados.titulo;
            tarefaEmEdicao.prioridade = dados.prioridade;
        } else {
            listaTarefas.push({
                id: listaTarefas.length + 1,
                titulo: dados.titulo,
                prioridade: dados.prioridade,
                status: dados.status
            });
        }
        return { status: 'ok', mensagem: 'Tarefa salva com sucesso!' };
    };

    const url = tarefaEmEdicao
        ? `../php/alterarTarefa.php?id=${tarefaEmEdicao.id}`
        : '../php/novaTarefa.php';

    await enviarFormularioTarefa(url);
});

Then('o card da tarefa {string} deve mostrar {string}', function (titulo, textoEsperado) {
    const tarefa = listaTarefas.find(t => t.titulo === titulo);
    assert.ok(tarefa, `A tarefa "${titulo}" deveria ter sido salva na lista`);

    // criarCardTarefa (getTarefas.js) exige DOM, então só a parte que monta
    // o texto da etiqueta de prioridade é reproduzida aqui
    const nomePrioridade = Regras.PRIORIDADES[tarefa.prioridade];
    const textoEtiqueta = nomePrioridade ? 'Prioridade ' + nomePrioridade.toLowerCase() : '';

    assert.strictEqual(textoEtiqueta, textoEsperado);
});

// Cenário 2

When('eu salvo a tarefa sem escolher a prioridade', async function () {
    camposDom['prioridade'].value = '';

    global.requisicao = async (url, dados) => {
        listaTarefas.push({ id: listaTarefas.length + 1, titulo: dados.titulo, prioridade: dados.prioridade });
        return { status: 'ok', mensagem: 'Tarefa criada com sucesso!' };
    };

    await enviarFormularioTarefa('../php/novaTarefa.php');
});

Then('deve ser exibida a mensagem de erro {string}', function (mensagemEsperada) {
    assert.strictEqual(camposDom['erro-prioridade'].textContent, mensagemEsperada);
});

Then('a tarefa {string} não deve ser criada', function (titulo) {
    const foiCriada = listaTarefas.some(t => t.titulo === titulo);
    assert.strictEqual(foiCriada, false);
});

// Cenário 3

Given('que existe a tarefa {string} com prioridade {string}', function (titulo, prioridade) {
    const tarefa = {
        id: 1,
        titulo: titulo,
        descricao: '',
        prioridade: prioridade,
        status: 'pendente',
        categoria_id: null,
        data_expiracao: null,
        favorita: false
    };
    listaTarefas.push(tarefa);
    tarefaEmEdicao = tarefa;

    preencherFormularioTarefa(tarefa);
});

When('eu edito a tarefa e escolho a prioridade {string}', function (novaPrioridade) {
    // Só aplica a edição se preencherFormularioTarefa tiver carregado a prioridade atual no campo
    if (camposDom['prioridade'].value !== '') {
        camposDom['prioridade'].value = novaPrioridade;
    }
});