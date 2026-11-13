/**
 * regras.js
 * ---------------------------------------------------------------
 * Funções PURAS (sem DOM, sem fetch): recebem dados e devolvem dados.
 * Ficam disponíveis no navegador pelo objeto global "Regras".
 *
 * Funcionalidades: 5 Filtrar status | 7 Filtrar prioridade | 9 Buscar texto
 *                  10 Ordenar por expiração | 11 Progresso | 12 Favoritas no topo
 *                  + validação no front (1 e 2)
 * ---------------------------------------------------------------
 */
const Regras = (function () {
    'use strict';

    const STATUS = {
        pendente: 'Pendente',
        em_andamento: 'Em andamento',
        concluida: 'Concluída',
    };

    const PRIORIDADES = {
        alta: 'Alta',
        media: 'Média',
        baixa: 'Baixa',
    };

    const TITULO_MAX = 150;

    /* -------------------- Validação (Func. 1 e 2) -------------------- */

    /**
     * Valida os dados do formulário antes de enviar ao servidor.
     * @returns {Object} erros no formato { campo: 'mensagem' } (vazio = válido)
     */
    function validarTarefa(dados) {
        const erros = {};
        const titulo = String((dados && dados.titulo) || '').trim();

        if (titulo === '') {
            erros.titulo = 'O título é obrigatório.';
        } else if (titulo.length > TITULO_MAX) {
            erros.titulo = 'O título deve ter no máximo ' + TITULO_MAX + ' caracteres.';
        }

        if (dados && dados.prioridade && !Object.prototype.hasOwnProperty.call(PRIORIDADES, dados.prioridade)) {
            erros.prioridade = 'Prioridade inválida.';
        }

        if (dados && dados.status && !Object.prototype.hasOwnProperty.call(STATUS, dados.status)) {
            erros.status = 'Status inválido.';
        }

        if (dados && dados.data_expiracao && !/^\d{4}-\d{2}-\d{2}$/.test(dados.data_expiracao)) {
            erros.data_expiracao = 'Data de expiração inválida.';
        }

        return erros;
    }

    /* -------------------- Filtros -------------------- */

    /** Func. 5 - Filtra por status. Status vazio ou 'todos' devolve tudo. */
    function filtrarPorStatus(tarefas, status) {
        if (!status || status === 'todos') return tarefas.slice();
        return tarefas.filter(function (t) { return t.status === status; });
    }

    /** Func. 7 - Filtra por prioridade. Prioridade vazia ou 'todas' devolve tudo. */
    function filtrarPorPrioridade(tarefas, prioridade) {
        if (!prioridade || prioridade === 'todas') return tarefas.slice();
        return tarefas.filter(function (t) { return t.prioridade === prioridade; });
    }

    /** Deixa o texto em minúsculas e sem acentos (para a busca). */
    function normalizarTexto(texto) {
        return String(texto || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .trim();
    }

    /**
     * Func. 9 - Busca por texto no título e na descrição.
     * Não diferencia maiúsculas/minúsculas nem acentos.
     */
    function buscarPorTexto(tarefas, texto) {
        const termo = normalizarTexto(texto);
        if (termo === '') return tarefas.slice();
        return tarefas.filter(function (t) {
            const conteudo = normalizarTexto(t.titulo) + ' ' + normalizarTexto(t.descricao);
            return conteudo.indexOf(termo) !== -1;
        });
    }

    /* -------------------- Ordenação -------------------- */

    /**
     * Func. 10 - Ordena por data de expiração.
     * ordem: 'asc' (mais próxima primeiro) ou 'desc' (mais distante primeiro).
     * Tarefas SEM data sempre vão para o final.
     */
    function ordenarPorExpiracao(tarefas, ordem) {
        const sentido = ordem === 'desc' ? -1 : 1;
        return tarefas.slice().sort(function (a, b) {
            const da = a.data_expiracao;
            const db = b.data_expiracao;
            if (!da && !db) return 0;
            if (!da) return 1;
            if (!db) return -1;
            // datas no formato AAAA-MM-DD podem ser comparadas como texto
            if (da < db) return -1 * sentido;
            if (da > db) return 1 * sentido;
            return 0;
        });
    }

    /** Func. 12 - Coloca as favoritas no topo, mantendo a ordem relativa do resto. */
    function favoritasNoTopo(tarefas) {
        return tarefas.slice().sort(function (a, b) {
            return Number(Boolean(b.favorita)) - Number(Boolean(a.favorita));
        });
    }

    /* -------------------- Progresso (Func. 11) -------------------- */

    /**
     * @returns {{total:number, concluidas:number, percentual:number}}
     * percentual é inteiro de 0 a 100.
     */
    function calcularProgresso(tarefas) {
        const total = tarefas.length;
        const concluidas = tarefas.filter(function (t) { return t.status === 'concluida'; }).length;
        const percentual = total === 0 ? 0 : Math.round((concluidas / total) * 100);
        return { total: total, concluidas: concluidas, percentual: percentual };
    }

    /* -------------------- Datas -------------------- */

    /** Converte um Date para 'AAAA-MM-DD' (horário local). */
    function dataParaIso(data) {
        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        return ano + '-' + mes + '-' + dia;
    }

    /** 'AAAA-MM-DD' -> 'DD/MM/AAAA'. Devolve '' se não houver data. */
    function formatarData(iso) {
        if (!iso) return '';
        const partes = String(iso).split('-');
        if (partes.length !== 3) return '';
        return partes[2] + '/' + partes[1] + '/' + partes[0];
    }

    /**
     * Uma tarefa está vencida se tem data de expiração anterior a hoje
     * e ainda não foi concluída.
     * @param {Date} [hoje] data de referência (padrão: data atual)
     */
    function estaVencida(tarefa, hoje) {
        if (!tarefa.data_expiracao || tarefa.status === 'concluida') return false;
        const hojeIso = dataParaIso(hoje || new Date());
        return tarefa.data_expiracao < hojeIso;
    }

    /* -------------------- Combinação de tudo -------------------- */

    /**
     * Aplica todos os critérios da tela de uma vez.
     * criterios = { status, prioridade, texto, ordenacao }
     * ordenacao: 'padrao' | 'expiracao_asc' | 'expiracao_desc'
     */
    function aplicarFiltros(tarefas, criterios) {
        const c = criterios || {};
        let resultado = filtrarPorStatus(tarefas, c.status);
        resultado = filtrarPorPrioridade(resultado, c.prioridade);
        resultado = buscarPorTexto(resultado, c.texto);

        if (c.ordenacao === 'expiracao_asc') resultado = ordenarPorExpiracao(resultado, 'asc');
        if (c.ordenacao === 'expiracao_desc') resultado = ordenarPorExpiracao(resultado, 'desc');

        return favoritasNoTopo(resultado); // favoritas sempre ficam em cima
    }

    return {
        STATUS: STATUS,
        PRIORIDADES: PRIORIDADES,
        validarTarefa: validarTarefa,
        filtrarPorStatus: filtrarPorStatus,
        filtrarPorPrioridade: filtrarPorPrioridade,
        normalizarTexto: normalizarTexto,
        buscarPorTexto: buscarPorTexto,
        ordenarPorExpiracao: ordenarPorExpiracao,
        favoritasNoTopo: favoritasNoTopo,
        calcularProgresso: calcularProgresso,
        dataParaIso: dataParaIso,
        formatarData: formatarData,
        estaVencida: estaVencida,
        aplicarFiltros: aplicarFiltros,
    };
})();
