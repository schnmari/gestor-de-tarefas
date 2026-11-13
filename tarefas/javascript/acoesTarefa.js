/**
 * acoesTarefa.js
 * ---------------------------------------------------------------
 * Ações rápidas feitas direto na lista (tela index.html):
 *   Func. 3  - Excluir tarefa
 *   Func. 4  - Marcar status
 *   Func. 12 - Marcar como favorita
 * Cada função retorna true se a ação deu certo.
 * ---------------------------------------------------------------
 */

async function alterarStatusTarefa(id, status) {
    const resposta = await requisicao("../php/alterarStatus.php?id=" + id, montarFormData({ status: status }));

    if (resposta.status === "ok") {
        avisoRapido(status === "concluida" ? "Tarefa concluída! 🎉" : resposta.mensagem);
        return true;
    }
    alertaErro(resposta.mensagem);
    return false;
}

async function favoritarTarefa(tarefa) {
    const resposta = await requisicao(
        "../php/favoritarTarefa.php?id=" + tarefa.id,
        montarFormData({ favorita: !tarefa.favorita })
    );

    if (resposta.status === "ok") {
        avisoRapido(resposta.mensagem);
        return true;
    }
    alertaErro(resposta.mensagem);
    return false;
}

async function excluirTarefa(tarefa) {
    const confirmou = await confirmarAcao(
        "Excluir tarefa?",
        'A tarefa "' + tarefa.titulo + '" será excluída permanentemente.',
        "Sim, excluir"
    );
    if (!confirmou) return false;

    const resposta = await requisicao("../php/excluirTarefa.php?id=" + tarefa.id, new FormData());

    if (resposta.status === "ok") {
        avisoRapido(resposta.mensagem);
        return true;
    }
    alertaErro(resposta.mensagem);
    return false;
}
