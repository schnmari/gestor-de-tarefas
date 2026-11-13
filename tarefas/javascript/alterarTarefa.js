/**
 * alterarTarefa.js - Funcionalidade 2 (Editar tarefa)
 * A tela recebe o id pela URL: alterarTarefa.html?id=1
 */
const idTarefa = new URLSearchParams(window.location.search).get("id");

document.addEventListener("DOMContentLoaded", () => {
    carregarTarefa();

    document.getElementById("form-tarefa").addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const deuCerto = await enviarFormularioTarefa("../php/alterarTarefa.php?id=" + idTarefa);
        if (deuCerto) {
            window.location.href = "index.html";
        }
    });
});

async function carregarTarefa() {
    if (!idTarefa) {
        await alertaErro("Nenhuma tarefa foi informada para edição.");
        window.location.href = "index.html";
        return;
    }

    const resposta = await requisicao("../php/getTarefas.php?id=" + encodeURIComponent(idTarefa));

    if (resposta.status !== "ok") {
        await alertaErro(resposta.mensagem);
        window.location.href = "index.html";
        return;
    }

    const tarefa = resposta.data;
    await carregarCategorias(tarefa.categoria_id);
    preencherFormularioTarefa(tarefa);
    document.getElementById("subtitulo-formulario").textContent = 'Editando "' + tarefa.titulo + '"';
}
