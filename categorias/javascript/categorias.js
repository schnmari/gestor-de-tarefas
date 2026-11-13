/**
 * categorias.js - Funcionalidade 8
 * ---------------------------------------------------------------
 * Carrega as categorias no <select id="categoria"> e permite
 * cadastrar uma nova categoria sem sair do formulário da tarefa.
 * Usado em novaTarefa.html e alterarTarefa.html.
 * ---------------------------------------------------------------
 */
const URL_CATEGORIAS = "../../categorias/php/";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("btn-nova-categoria").addEventListener("click", () => abrirNovaCategoria(true));
    document.getElementById("btn-cancelar-categoria").addEventListener("click", () => abrirNovaCategoria(false));
    document.getElementById("btn-salvar-categoria").addEventListener("click", salvarCategoria);
    document.getElementById("nova-categoria-nome").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // não envia o formulário da tarefa
            salvarCategoria();
        }
    });
});

/** Busca as categorias no banco e monta as opções do select. */
async function carregarCategorias(selecionada) {
    const resposta = await requisicao(URL_CATEGORIAS + "getCategorias.php");
    const select   = document.getElementById("categoria");

    select.innerHTML = "";
    select.appendChild(new Option("Sem categoria", ""));

    if (resposta.status === "ok") {
        resposta.data.forEach((categoria) => {
            select.appendChild(new Option(categoria.nome, String(categoria.id)));
        });
    } else {
        alertaErro(resposta.mensagem);
    }

    if (selecionada !== undefined && selecionada !== null) {
        select.value = String(selecionada);
    }
}

function abrirNovaCategoria(mostrar) {
    const caixa = document.getElementById("caixa-nova-categoria");
    caixa.hidden = !mostrar;
    document.getElementById("nova-categoria-nome").value = "";
    document.getElementById("erro-nome").textContent = "";
    if (mostrar) document.getElementById("nova-categoria-nome").focus();
}

async function salvarCategoria() {
    const nome   = document.getElementById("nova-categoria-nome").value.trim();
    const erroEl = document.getElementById("erro-nome");

    if (nome === "") {
        erroEl.textContent = "Informe o nome da categoria.";
        return;
    }

    const resposta = await requisicao(URL_CATEGORIAS + "novaCategoria.php", montarFormData({ nome: nome }));

    if (resposta.status === "ok") {
        await carregarCategorias(resposta.data.id); // já deixa a nova categoria selecionada
        abrirNovaCategoria(false);
        avisoRapido('Categoria "' + resposta.data.nome + '" criada!');
    } else {
        erroEl.textContent = resposta.mensagem;
    }
}
