/**
 * requisicao.js
 * ---------------------------------------------------------------
 * Faz as chamadas ao PHP. Todo endpoint responde no formato:
 *   { status: "ok" | "nok", mensagem: "...", data: ... }
 *
 * Sem "dados"  -> GET
 * Com "dados"  -> POST enviando FormData
 * ---------------------------------------------------------------
 */
async function requisicao(url, dados) {
    const opcoes = dados ? { method: "POST", body: dados } : { method: "GET" };

    try {
        const retorno = await fetch(url, opcoes);
        return await retorno.json();
    } catch (erro) {
        console.error("Erro na requisição para " + url, erro);
        return { status: "nok", mensagem: "Não foi possível conectar ao servidor.", data: [] };
    }
}

/** Converte um objeto JS em FormData (null vira "", true/false vira "1"/"0"). */
function montarFormData(dados) {
    const fd = new FormData();
    Object.keys(dados).forEach(function (campo) {
        let valor = dados[campo];
        if (valor === null || valor === undefined) valor = "";
        if (typeof valor === "boolean") valor = valor ? "1" : "0";
        fd.append(campo, valor);
    });
    return fd;
}
