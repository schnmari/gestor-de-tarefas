const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const caminhoAcoes = path.resolve(__dirname, '../../tarefas/javascript/acoesTarefa.js');
vm.runInThisContext(fs.readFileSync(caminhoAcoes, 'utf8'));

// declaração de variáveis pra simular ambiente
let listaTarefas = [];
let tarefaSelecionada = null;
let mensagemExibida = null;

Before(function () {
    // Reseta o estado antes de rodar o cenário
    listaTarefas = [];
    tarefaSelecionada = null;
    mensagemExibida = null;

    // mock
    global.FormData = class FormData {};
    global.avisoRapido = (msg) => { mensagemExibida = msg; };
    global.alertaErro = (msg) => { mensagemExibida = msg; };
});


Given('que existe a tarefa {string} na lista', function (titulo) {
    listaTarefas.push({ id: 1, titulo: titulo, status: 'pendente' });
});

When('eu peço para excluir a tarefa {string}', function (titulo) {
    // Encontra a tarefa alvo
    tarefaSelecionada = listaTarefas.find(t => t.titulo === titulo);
});

When('confirmo a exclusão', async function () {
    // simulado do clique
    global.confirmarAcao = async () => true;
    
    global.requisicao = async () => {
        listaTarefas = listaTarefas.filter(t => t.id !== tarefaSelecionada.id);
        return { status: 'ok', mensagem: 'Tarefa excluída com sucesso!' };
    };

    // Executa a função real
    await excluirTarefa(tarefaSelecionada);
});

Then('deve ser exibida a mensagem {string}', function (mensagemEsperada) {
    // Valida se a mensagem capturada é igual à esperada pelo Gherkin
    assert.strictEqual(mensagemExibida, mensagemEsperada);
});

When('cancelo a confirmação', async function () {
    // Simula o clique em "Cancelar"
    global.confirmarAcao = async () => false;
    
    // Verifica se foi realmente apagado
    global.requisicao = async () => {
        listaTarefas = listaTarefas.filter(t => t.id !== tarefaSelecionada.id);
        return { status: 'ok', mensagem: 'Tarefa excluída com sucesso!' };
    };

    await excluirTarefa(tarefaSelecionada);
});

Then('a tarefa {string} deve continuar na lista', function (titulo) {
    // Verifica se a tarefa ainda está na lista
    const tarefaAindaExiste = listaTarefas.some(t => t.titulo === titulo);
    assert.strictEqual(tarefaAindaExiste, true);
});