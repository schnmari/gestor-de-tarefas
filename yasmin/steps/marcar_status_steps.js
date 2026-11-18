const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');


const raiz = path.resolve(__dirname, '../..');
const ler = (arquivo) => fs.readFileSync(path.join(raiz, arquivo), 'utf8');

if (typeof Regras === 'undefined') {
    vm.runInThisContext('{' + ler('javascript/regras.js') + '\nglobalThis.Regras = Regras;\n}');
}
if (typeof enviarFormularioTarefa === 'undefined') {
    vm.runInThisContext(ler('javascript/formularioTarefa.js'));
}
if (typeof alterarStatusTarefa === 'undefined') {
    vm.runInThisContext(ler('tarefas/javascript/acoesTarefa.js'));
}


const formularioDoJosue = require('../../josue/steps/suporte').estado;


const ASPAS = '["“”]';
const TEXTO = '([^"“”]+)';


let camposDom = {};
let listaTarefas = [];
let tarefaSelecionada = null;
let deuCerto = false;


function valorDoStatus(rotulo) {
    return Object.keys(Regras.STATUS).find((chave) => Regras.STATUS[chave] === rotulo);
}


function prepararCenario() {
    listaTarefas = [];
    tarefaSelecionada = null;
    deuCerto = false;

    
    camposDom = {
        'titulo': { value: '', classList: { add: () => {}, remove: () => {} } },
        'descricao': { value: '' },
        'prioridade': { value: 'media', classList: { add: () => {}, remove: () => {} } },
        'status': { value: 'pendente' },
        'categoria': { value: '' },
        'data_expiracao': { value: '' },
        'favorita': { checked: false },
        'btn-salvar': { disabled: false }
    };
    global.document = {
        getElementById: (id) => camposDom[id] || { value: '', textContent: '', closest: () => null },
        querySelectorAll: () => []
    };

    
    global.montarFormData = (dados) => dados;
    global.alertaSucesso = async () => {};
    global.alertaErro = async () => {};
    global.avisoRapido = () => {};

    
    global.requisicao = async (url, dados) => {
        if (url.includes('novaTarefa.php')) {
            listaTarefas.push({
                id: listaTarefas.length + 1,
                titulo: dados.titulo,
                status: dados.status || 'pendente',
                prioridade: dados.prioridade
            });
            return { status: 'ok', mensagem: 'Tarefa criada com sucesso!' };
        }

        if (url.includes('alterarStatus.php')) {
            const id = Number(url.split('id=')[1]);
            const tarefa = listaTarefas.find((t) => t.id === id);
            tarefa.status = dados.status;
            return { status: 'ok', mensagem: 'Status atualizado!' };
        }

        return { status: 'nok', mensagem: 'Endpoint não simulado' };
    };
}

// Cenário 1

Given('que estou na tela de cadastro de uma nova tarefa', function () {
    prepararCenario();
});

// O passo 'eu preencho o título {string}' já existe em josue/steps
// (os passos do Cucumber são globais), então não é definido de novo aqui.

When('seleciono o status {string} no campo de seleção', function (status) {
    camposDom['status'].value = valorDoStatus(status);
});

When('clico no botão {string}', async function (botao) {
    camposDom['titulo'].value = formularioDoJosue.campos.titulo.value;

   
    deuCerto = await enviarFormularioTarefa('../php/novaTarefa.php');
});

Then('o card da tarefa {string} deve mostrar o status como {string}', function (titulo, status) {
    assert.strictEqual(deuCerto, true, 'O formulário deveria ter sido enviado com sucesso');

    const tarefa = listaTarefas.find((t) => t.titulo === titulo);
    assert.ok(tarefa, `A tarefa "${titulo}" deveria ter sido salva na lista`);

    // O select do card (getTarefas.js) mostra o texto de Regras.STATUS
    assert.strictEqual(Regras.STATUS[tarefa.status], status);
});

// Cenários 2 e 3

Given(
    new RegExp(`^que existe uma tarefa cadastrada com o título\\s+${ASPAS}${TEXTO}${ASPAS}\\s+com status\\s+${ASPAS}${TEXTO}${ASPAS}$`),
    function (titulo, status) {
        prepararCenario();
        listaTarefas.push({ id: 1, titulo: titulo, status: valorDoStatus(status), prioridade: 'media' });
    }
);

When(
    new RegExp(`^eu clico no seletor de status da tarefa\\s+${ASPAS}${TEXTO}${ASPAS}$`),
    function (titulo) {
        tarefaSelecionada = listaTarefas.find((t) => t.titulo === titulo);
    }
);

When('seleciono a opção {string}', async function (opcao) {
    // Executa a função real que altera o status
    deuCerto = await alterarStatusTarefa(tarefaSelecionada.id, valorDoStatus(opcao));
});

Then(
    new RegExp(`^o status da tarefa\\s+${ASPAS}${TEXTO}${ASPAS}\\s+deve mudar para\\s+${ASPAS}${TEXTO}${ASPAS}$`),
    function (titulo, novoStatus) {
        assert.strictEqual(deuCerto, true, 'A alteração de status deveria ter dado certo');

        const tarefa = listaTarefas.find((t) => t.titulo === titulo);
        assert.strictEqual(Regras.STATUS[tarefa.status], novoStatus);
    }
);