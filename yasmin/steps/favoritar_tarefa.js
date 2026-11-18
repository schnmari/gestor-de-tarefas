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
if (typeof favoritarTarefa === 'undefined') {
    vm.runInThisContext(ler('tarefas/javascript/acoesTarefa.js'));
}


const ASPAS = '["“”]';
const TEXTO = '([^"“”]+)';

let listaTarefas = [];
let tarefaSelecionada = null;
let deuCerto = false;

function prepararCenario(titulo, favorita) {
    listaTarefas = [
        { id: 1, titulo: 'Tarefa de apoio', status: 'pendente', prioridade: 'media', favorita: false },
        { id: 2, titulo: titulo, status: 'pendente', prioridade: 'media', favorita: favorita }
    ];
    tarefaSelecionada = null;
    deuCerto = false;


    global.montarFormData = (dados) => dados;
    global.alertaErro = async () => {};
    global.avisoRapido = () => {};

 
    global.requisicao = async (url, dados) => {
        const id = Number(url.split('id=')[1]);
        const tarefa = listaTarefas.find((t) => t.id === id);
        tarefa.favorita = dados.favorita;
        return { status: 'ok', mensagem: tarefa.favorita ? 'Tarefa adicionada aos favoritos!' : 'Tarefa removida dos favoritos.' };
    };
}

// Cenário 1

Given(
    new RegExp(`^que existe uma tarefa cadastrada com o título\\s+${ASPAS}${TEXTO}${ASPAS}\\s+e não está marcada como favorita$`),
    function (titulo) {
        prepararCenario(titulo, false);
    }
);


When(
    new RegExp(`^eu\\s+(?:eu\\s+)?clico no ícone de estrela\\s+(?:da|Da)\\s+tarefa\\s+${ASPAS}${TEXTO}${ASPAS}$`),
    async function (titulo) {
        tarefaSelecionada = listaTarefas.find((t) => t.titulo === titulo);


        deuCerto = await favoritarTarefa(tarefaSelecionada);
    }
);

Then(/^o ícone de estrela deve se tornar amarelo\/preenchido indicando que é favorita$/, function () {
    assert.strictEqual(deuCerto, true, 'A ação de favoritar deveria ter dado certo');


    assert.strictEqual(tarefaSelecionada.favorita, true);
});

Then('a tarefa deve ser posicionada no topo da listagem', function () {
  
    const lista = Regras.favoritasNoTopo(listaTarefas);
    assert.strictEqual(lista[0].titulo, tarefaSelecionada.titulo);
});

// Cenário 2

Given(
    new RegExp(`^que existe uma tarefa cadastrada com o título\\s+${ASPAS}${TEXTO}${ASPAS}\\s+que possui o ícone de favorito preenchido$`),
    function (titulo) {
        prepararCenario(titulo, true);
    }
);

Then('o ícone de estrela deve voltar a ficar vazio', function () {
    assert.strictEqual(deuCerto, true, 'A ação de desfavoritar deveria ter dado certo');
    assert.strictEqual(tarefaSelecionada.favorita, false);
});

Then('a tarefa deve perder o destaque de favorito', function () {
    const lista = Regras.favoritasNoTopo(listaTarefas);

    // Sem favorita na lista, a ordem original é mantida
    assert.strictEqual(lista[0].titulo, 'Tarefa de apoio');
});
