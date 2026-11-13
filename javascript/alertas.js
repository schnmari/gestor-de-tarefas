/**
 * alertas.js
 * ---------------------------------------------------------------
 * Alertas com SweetAlert2 (igual ao UniRide).
 * Se o SweetAlert não carregar (ex.: sem internet), usa alert/confirm do navegador.
 * ---------------------------------------------------------------
 */
const COR_PRIMARIA = "#6c5ce7";
const COR_PERIGO   = "#e5534b";

function swalDisponivel() {
    return typeof Swal !== "undefined";
}

/** Alerta de sucesso que fecha sozinho. */
function alertaSucesso(mensagem) {
    if (!swalDisponivel()) {
        alert(mensagem);
        return Promise.resolve();
    }
    return Swal.fire({
        icon: "success",
        title: "Tudo certo!",
        text: mensagem,
        timer: 1500,
        showConfirmButton: false
    });
}

/** Alerta de erro. */
function alertaErro(mensagem) {
    if (!swalDisponivel()) {
        alert(mensagem);
        return Promise.resolve();
    }
    return Swal.fire({
        icon: "error",
        title: "Ops!",
        text: mensagem,
        confirmButtonText: "OK",
        confirmButtonColor: COR_PRIMARIA
    });
}

/** Pede confirmação. Retorna true se o usuário confirmou. */
async function confirmarAcao(titulo, texto, textoBotao) {
    if (!swalDisponivel()) {
        return confirm(texto);
    }
    const resultado = await Swal.fire({
        icon: "warning",
        title: titulo,
        text: texto,
        showCancelButton: true,
        confirmButtonText: textoBotao || "Confirmar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: COR_PERIGO,
        cancelButtonColor: "#8a8fa8",
        reverseButtons: true
    });
    return resultado.isConfirmed;
}

/** Aviso pequeno no canto da tela (para ações rápidas como status e favorito). */
function avisoRapido(mensagem) {
    if (!swalDisponivel()) return;
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: mensagem,
        timer: 1600,
        showConfirmButton: false
    });
}
