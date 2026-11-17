const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// Carrega o código real do projeto (regras.js) no mesmo contexto do teste,
// então a busca que roda aqui é a mesma que roda no navegador
const caminhoRegras = path.resolve(__dirname, '../../javascript/regras.js');

// O regras.js também é carregado nos steps de outros integrantes e declara "const Regras".
// Carregar duas vezes dá erro, então só carrega se ainda não existir
if (typeof Regras === 'undefined') {
    vm.runInThisContext('{' + fs.readFileSync(caminhoRegras, 'utf8') + '\nglobalThis.Regras = Regras;\n}');
}

// declaração de variáveis pra simular ambiente
let listaTarefas = [];
let tarefasEncontradas = [];

Before(function () {
    // Reseta o estado antes de rodar o cenário
    listaTarefas = [];
    tarefasEncontradas = [];
});

// Contexto

Given('que tenho as seguintes tarefas cadastradas:', function (tabela) {
    listaTarefas = tabela.hashes().map((linha, i) => ({
        id: i + 1,
        titulo: linha.titulo,
        descricao: linha.descricao,
        status: 'pendente'
    }));
});

// Cenários 1, 2, 3 e 4

When('eu digito {string} no campo de busca', function (texto) {
    // Executa a função real da busca (Func. 9)
    tarefasEncontradas = Regras.buscarPorTexto(listaTarefas, texto);
});

Then('deve aparecer somente a tarefa {string}', function (tituloEsperado) {
    const titulos = tarefasEncontradas.map(t => t.titulo);
    assert.deepStrictEqual(titulos, [tituloEsperado]);
});

// Cenário 4

Then('nenhuma tarefa deve aparecer na lista', function () {
    assert.strictEqual(tarefasEncontradas.length, 0);
});
