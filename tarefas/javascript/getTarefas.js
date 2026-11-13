/**
 * getTarefas.js - tela principal (index.html)
 * ---------------------------------------------------------------
 * Carrega as tarefas, desenha os cards e aplica:
 *   Func. 5  filtro por status       Func. 9  busca por texto
 *   Func. 7  filtro por prioridade   Func. 10 ordenação por expiração
 *   Func. 11 barra de progresso      Func. 12 favoritas no topo
 * As regras em si ficam em javascript/regras.js (funções puras).
 * ---------------------------------------------------------------
 */
let tarefas = []; // todas as tarefas que vieram do banco

document.addEventListener("DOMContentLoaded", () => {
    mostrarDataDeHoje();
    registrarEventos();
    carregarTarefas();
});

async function carregarTarefas() {
    const resposta = await requisicao("../php/getTarefas.php");

    if (resposta.status === "ok") {
        tarefas = resposta.data;
    } else {
        alertaErro(resposta.mensagem);
    }
    atualizarTela();
}

/* ------------------------- filtros ------------------------- */

function lerCriterios() {
    const statusMarcado = document.querySelector('input[name="filtroStatus"]:checked');
    return {
        texto:      document.getElementById("busca").value,
        status:     statusMarcado ? statusMarcado.value : "todos",
        prioridade: document.getElementById("filtro-prioridade").value,
        ordenacao:  document.getElementById("ordenacao").value
    };
}

function limparFiltros() {
    document.getElementById("busca").value = "";
    document.querySelector('input[name="filtroStatus"][value="todos"]').checked = true;
    document.getElementById("filtro-prioridade").value = "todas";
    document.getElementById("ordenacao").value = "padrao";
    atualizarTela();
}

/** Aplica filtros/ordenação e redesenha lista + progresso. */
function atualizarTela() {
    const visiveis = Regras.aplicarFiltros(tarefas, lerCriterios());
    renderizarTarefas(visiveis);
    renderizarProgresso(Regras.calcularProgresso(tarefas));
}

/* ------------------------- progresso (Func. 11) ------------------------- */

function renderizarProgresso(progresso) {
    document.getElementById("barra-progresso").value          = progresso.percentual;
    document.getElementById("percentual-progresso").textContent = progresso.percentual + "%";
    document.getElementById("num-total").textContent      = progresso.total;
    document.getElementById("num-concluidas").textContent = progresso.concluidas;
    document.getElementById("num-restantes").textContent  = progresso.total - progresso.concluidas;
    document.getElementById("texto-progresso").textContent =
        progresso.concluidas + " de " + progresso.total + " tarefas concluídas";
}

/* ------------------------- lista ------------------------- */

function renderizarTarefas(lista) {
    const area = document.getElementById("lista-tarefas");
    area.innerHTML = "";
    lista.forEach((tarefa) => area.appendChild(criarCardTarefa(tarefa)));

    document.getElementById("contador-visiveis").textContent = lista.length;
    document.getElementById("mensagem-vazia").hidden = lista.length > 0;

    // Mensagem diferente se não existe nenhuma tarefa ou se o filtro escondeu todas
    document.getElementById("texto-vazio").textContent = tarefas.length === 0
        ? "Você ainda não tem tarefas. Que tal criar a primeira?"
        : "Nenhuma tarefa encontrada com esses filtros.";
}

/* Cria um elemento com classe e texto (texto via textContent = sem risco de XSS) */
function criarElemento(tag, classe, texto) {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto !== undefined) el.textContent = texto;
    return el;
}

function criarBotaoIcone(acao, icone, titulo) {
    const botao = criarElemento("button", "botao-icone botao-" + acao);
    botao.type = "button";
    botao.title = titulo;
    botao.dataset.acao = acao;

    const img = document.createElement("img");
    img.src = "../../assets/" + icone;
    img.alt = titulo;
    botao.appendChild(img);
    return botao;
}

function criarCardTarefa(tarefa) {
    const card = criarElemento("article", "card-tarefa prioridade-" + tarefa.prioridade);
    if (tarefa.status === "concluida") card.classList.add("concluida");
    if (tarefa.favorita) card.classList.add("favorita");
    card.dataset.id = tarefa.id;

    /* --- topo: etiquetas + favorito --- */
    const topo = criarElemento("div", "card-topo");
    const etiquetas = criarElemento("div", "etiquetas");

    etiquetas.appendChild(criarElemento("span", "etiqueta etiqueta-" + tarefa.prioridade,
        "Prioridade " + Regras.PRIORIDADES[tarefa.prioridade].toLowerCase()));

    if (tarefa.categoria_nome) {
        const categoria = criarElemento("span", "etiqueta etiqueta-categoria");
        const icone = document.createElement("img");
        icone.src = "../../assets/icon-etiqueta.svg";
        icone.alt = "";
        categoria.append(icone, tarefa.categoria_nome);
        etiquetas.appendChild(categoria);
    }

    const botaoFavorito = criarElemento("button", "botao-favorito", tarefa.favorita ? "★" : "☆");
    botaoFavorito.type = "button";
    botaoFavorito.dataset.acao = "favoritar";
    botaoFavorito.title = tarefa.favorita ? "Remover dos favoritos" : "Marcar como favorita";
    topo.append(etiquetas, botaoFavorito);

    /* --- corpo: título e descrição --- */
    const titulo = criarElemento("h3", "tarefa-titulo", tarefa.titulo);
    card.append(topo, titulo);

    if (tarefa.descricao) {
        card.appendChild(criarElemento("p", "tarefa-descricao", tarefa.descricao));
    }

    /* --- rodapé: data, status e ações --- */
    const rodape = criarElemento("div", "card-rodape");
    const infoData = criarElemento("div", "info-data");

    if (tarefa.data_expiracao) {
        const icone = document.createElement("img");
        icone.src = "../../assets/icon-calendario.svg";
        icone.alt = "";
        infoData.append(icone, "Expira em " + Regras.formatarData(tarefa.data_expiracao));

        if (Regras.estaVencida(tarefa)) {
            infoData.appendChild(criarElemento("span", "etiqueta etiqueta-vencida", "Vencida"));
        }
    } else {
        infoData.appendChild(criarElemento("span", "sem-data", "Sem data de expiração"));
    }

    const acoes = criarElemento("div", "acoes");

    const selectStatus = criarElemento("select", "select-status status-" + tarefa.status);
    selectStatus.dataset.acao = "status";
    selectStatus.title = "Alterar status";
    Object.keys(Regras.STATUS).forEach((valor) => {
        selectStatus.appendChild(new Option(Regras.STATUS[valor], valor, false, valor === tarefa.status));
    });

    acoes.append(
        selectStatus,
        criarBotaoIcone("editar", "icon-lapis.svg", "Editar tarefa"),
        criarBotaoIcone("excluir", "icon-lixeira.svg", "Excluir tarefa")
    );

    rodape.append(infoData, acoes);
    card.appendChild(rodape);
    return card;
}

/* ------------------------- eventos ------------------------- */

function buscarTarefaPorId(id) {
    return tarefas.find((t) => t.id === id);
}

async function aoClicarNaLista(evento) {
    const botao = evento.target.closest("button[data-acao]");
    if (!botao) return;

    const id     = Number(botao.closest(".card-tarefa").dataset.id);
    const tarefa = buscarTarefaPorId(id);
    if (!tarefa) return;

    const acao = botao.dataset.acao;
    let atualizar = false;

    if (acao === "editar") {                    // Func. 2
        window.location.href = "alterarTarefa.html?id=" + id;
        return;
    }
    if (acao === "excluir")   atualizar = await excluirTarefa(tarefa);   // Func. 3
    if (acao === "favoritar") atualizar = await favoritarTarefa(tarefa); // Func. 12

    if (atualizar) carregarTarefas();
}

async function aoMudarStatus(evento) {          // Func. 4
    const select = evento.target;
    if (select.dataset.acao !== "status") return;

    const id = Number(select.closest(".card-tarefa").dataset.id);
    await alterarStatusTarefa(id, select.value);
    carregarTarefas(); // recarrega mesmo se der erro, para o select voltar ao valor certo
}

function registrarEventos() {
    const lista = document.getElementById("lista-tarefas");
    lista.addEventListener("click", aoClicarNaLista);
    lista.addEventListener("change", aoMudarStatus);

    // Filtros atualizam na hora, sem ir ao servidor
    document.getElementById("busca").addEventListener("input", atualizarTela);
    document.getElementById("filtro-prioridade").addEventListener("change", atualizarTela);
    document.getElementById("ordenacao").addEventListener("change", atualizarTela);
    document.querySelectorAll('input[name="filtroStatus"]').forEach((radio) => {
        radio.addEventListener("change", atualizarTela);
    });
    document.getElementById("btn-limpar-filtros").addEventListener("click", limparFiltros);
}

function mostrarDataDeHoje() {
    const hoje = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
    document.getElementById("data-hoje").textContent = hoje.charAt(0).toUpperCase() + hoje.slice(1);
}
