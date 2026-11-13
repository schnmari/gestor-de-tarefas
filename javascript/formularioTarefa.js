/**
 * formularioTarefa.js
 * ---------------------------------------------------------------
 * Funções do formulário de tarefa, usadas pelas telas
 * novaTarefa.html (Func. 1) e alterarTarefa.html (Func. 2).
 * ---------------------------------------------------------------
 */

/** Lê os campos do formulário e devolve um objeto com os dados. */
function lerFormularioTarefa() {
    return {
        titulo:         document.getElementById("titulo").value.trim(),
        descricao:      document.getElementById("descricao").value.trim(),
        prioridade:     document.getElementById("prioridade").value,
        status:         document.getElementById("status").value,
        categoria_id:   document.getElementById("categoria").value || null,
        data_expiracao: document.getElementById("data_expiracao").value || null,
        favorita:       document.getElementById("favorita").checked
    };
}

/** Preenche o formulário com uma tarefa (tela de edição). */
function preencherFormularioTarefa(tarefa) {
    document.getElementById("titulo").value         = tarefa.titulo;
    document.getElementById("descricao").value      = tarefa.descricao || "";
    document.getElementById("prioridade").value     = tarefa.prioridade;
    document.getElementById("status").value         = tarefa.status;
    document.getElementById("categoria").value      = tarefa.categoria_id === null ? "" : String(tarefa.categoria_id);
    document.getElementById("data_expiracao").value = tarefa.data_expiracao || "";
    document.getElementById("favorita").checked     = Boolean(tarefa.favorita);
}

/** Mostra as mensagens de erro embaixo de cada campo. erros = { campo: "mensagem" } */
function mostrarErrosFormulario(erros) {
    limparErrosFormulario();
    Object.keys(erros || {}).forEach(function (campo) {
        const span = document.getElementById("erro-" + campo);
        if (span) {
            span.textContent = erros[campo];
            const input = span.closest(".campo") && span.closest(".campo").querySelector("input, select, textarea");
            if (input) input.classList.add("campo-invalido");
        }
    });
}

function limparErrosFormulario() {
    document.querySelectorAll(".erro-campo").forEach(function (span) { span.textContent = ""; });
    document.querySelectorAll(".campo-invalido").forEach(function (el) { el.classList.remove("campo-invalido"); });
}

/**
 * Valida no front, envia ao PHP e trata a resposta.
 * Retorna true se deu certo.
 */
async function enviarFormularioTarefa(url) {
    const dados = lerFormularioTarefa();
    const erros = Regras.validarTarefa(dados);

    if (Object.keys(erros).length > 0) {
        mostrarErrosFormulario(erros);
        return false;
    }

    const botao = document.getElementById("btn-salvar");
    botao.disabled = true;

    const resposta = await requisicao(url, montarFormData(dados));
    botao.disabled = false;

    if (resposta.status === "ok") {
        await alertaSucesso(resposta.mensagem);
        return true;
    }

    // Erros de validação do PHP vêm em resposta.data
    if (resposta.data && !Array.isArray(resposta.data)) {
        mostrarErrosFormulario(resposta.data);
    }
    alertaErro(resposta.mensagem);
    return false;
}
