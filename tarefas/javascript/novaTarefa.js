/**
 * novaTarefa.js - Funcionalidade 1 (Criar tarefa)
 */
document.addEventListener("DOMContentLoaded", () => {
    carregarCategorias();

    document.getElementById("form-tarefa").addEventListener("submit", async (evento) => {
        evento.preventDefault();
        const deuCerto = await enviarFormularioTarefa("../php/novaTarefa.php");
        if (deuCerto) {
            window.location.href = "index.html";
        }
    });
});
