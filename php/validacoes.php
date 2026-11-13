<?php
/*
 * validacoes.php
 * ------------------------------------------------------------------
 * Funções de validação/normalização dos dados (não acessam o banco).
 *
 * Funcionalidades: 1 Criar | 2 Editar | 4 Status | 6 Prioridade
 *                  8 Categoria | 10 Expiração
 * ------------------------------------------------------------------
 */

const STATUS_VALIDOS      = ['pendente', 'em_andamento', 'concluida'];
const PRIORIDADES_VALIDAS = ['alta', 'media', 'baixa'];
const TITULO_MAX          = 150;
const DESCRICAO_MAX       = 1000;
const CATEGORIA_NOME_MIN  = 2;
const CATEGORIA_NOME_MAX  = 50;

/*
 * Valida os dados de uma tarefa.
 * Retorna um array de erros no formato ['campo' => 'mensagem'].
 * Array vazio = dados válidos.
 */
function validarTarefa($dados)
{
    $erros = [];

    // Título (obrigatório)
    $titulo = trim((string)($dados['titulo'] ?? ''));
    if ($titulo === '') {
        $erros['titulo'] = 'O título é obrigatório.';
    } elseif (mb_strlen($titulo) > TITULO_MAX) {
        $erros['titulo'] = 'O título deve ter no máximo ' . TITULO_MAX . ' caracteres.';
    }

    // Descrição (opcional)
    if (mb_strlen((string)($dados['descricao'] ?? '')) > DESCRICAO_MAX) {
        $erros['descricao'] = 'A descrição deve ter no máximo ' . DESCRICAO_MAX . ' caracteres.';
    }

    // Prioridade (se vier, precisa ser válida)
    if (!vazio($dados['prioridade'] ?? null) && !prioridadeValida($dados['prioridade'])) {
        $erros['prioridade'] = 'Prioridade inválida. Use: alta, media ou baixa.';
    }

    // Status (se vier, precisa ser válido)
    if (!vazio($dados['status'] ?? null) && !statusValido($dados['status'])) {
        $erros['status'] = 'Status inválido. Use: pendente, em_andamento ou concluida.';
    }

    // Data de expiração (opcional, AAAA-MM-DD)
    if (!vazio($dados['data_expiracao'] ?? null) && !dataValida($dados['data_expiracao'])) {
        $erros['data_expiracao'] = 'Data de expiração inválida.';
    }

    // Categoria (opcional, id inteiro positivo)
    if (!vazio($dados['categoria_id'] ?? null) && !idValido($dados['categoria_id'])) {
        $erros['categoria_id'] = 'Categoria inválida.';
    }

    return $erros;
}

/*
 * Limpa os dados da tarefa e aplica os valores padrão:
 * status = pendente, prioridade = media, campos vazios = null.
 */
function normalizarTarefa($dados)
{
    $descricao = trim((string)($dados['descricao'] ?? ''));

    return [
        'titulo'         => trim((string)($dados['titulo'] ?? '')),
        'descricao'      => $descricao === '' ? null : $descricao,
        'status'         => vazio($dados['status'] ?? null) ? 'pendente' : $dados['status'],
        'prioridade'     => vazio($dados['prioridade'] ?? null) ? 'media' : $dados['prioridade'],
        'categoria_id'   => vazio($dados['categoria_id'] ?? null) ? null : (int)$dados['categoria_id'],
        'data_expiracao' => vazio($dados['data_expiracao'] ?? null) ? null : $dados['data_expiracao'],
        'favorita'       => valorBooleano($dados['favorita'] ?? false),
    ];
}

/* Valida o nome de uma nova categoria (Func. 8). */
function validarCategoria($dados)
{
    $erros = [];
    $nome  = trim((string)($dados['nome'] ?? ''));

    if ($nome === '') {
        $erros['nome'] = 'O nome da categoria é obrigatório.';
    } elseif (mb_strlen($nome) < CATEGORIA_NOME_MIN) {
        $erros['nome'] = 'O nome deve ter pelo menos ' . CATEGORIA_NOME_MIN . ' caracteres.';
    } elseif (mb_strlen($nome) > CATEGORIA_NOME_MAX) {
        $erros['nome'] = 'O nome deve ter no máximo ' . CATEGORIA_NOME_MAX . ' caracteres.';
    }

    return $erros;
}

/* ------------------------- funções auxiliares ------------------------- */

function statusValido($status)
{
    return is_string($status) && in_array($status, STATUS_VALIDOS, true);
}

function prioridadeValida($prioridade)
{
    return is_string($prioridade) && in_array($prioridade, PRIORIDADES_VALIDAS, true);
}

/* Aceita somente datas reais no formato AAAA-MM-DD (ex.: 2026-02-30 é inválida). */
function dataValida($data)
{
    if (!is_string($data)) {
        return false;
    }
    $d = DateTime::createFromFormat('Y-m-d', $data);
    return $d !== false && $d->format('Y-m-d') === $data;
}

function idValido($id)
{
    return filter_var($id, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) !== false;
}

/* Converte "1", "true", "on", 1, true -> true. Qualquer outra coisa -> false. */
function valorBooleano($valor)
{
    return in_array($valor, [true, 1, '1', 'true', 'on'], true);
}

function vazio($valor)
{
    return $valor === null || $valor === '';
}
