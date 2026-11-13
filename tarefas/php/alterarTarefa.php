<?php
/*
 * Funcionalidade 2 - Editar tarefa
 * POST tarefas/php/alterarTarefa.php?id=1
 * Campos (FormData): titulo, descricao, prioridade, status, categoria_id, data_expiracao, favorita
 */
include_once('../../php/conexao.php');
include_once('../../php/retorno.php');
include_once('../../php/validacoes.php');
include_once('../../php/consultas.php');

exigirMetodo('POST');
$id = lerIdDaUrl();

$atual = buscarTarefa($conexao, $id);
if ($atual === null) {
    retornar('nok', 'Tarefa não encontrada.');
}

// Se o status não vier no formulário, mantém o atual
$dados = $_POST;
if (vazio($dados['status'] ?? null)) {
    $dados['status'] = $atual['status'];
}

$erros = validarTarefa($dados);

if (!isset($erros['categoria_id']) && !vazio($dados['categoria_id'] ?? null)
    && !categoriaExiste($conexao, (int)$dados['categoria_id'])) {
    $erros['categoria_id'] = 'Categoria não encontrada.';
}

if (!empty($erros)) {
    retornar('nok', 'Verifique os campos destacados.', $erros);
}

$t = normalizarTarefa($dados);

// Favorita: se não vier no formulário, mantém a atual
$favorita = isset($dados['favorita']) ? ($t['favorita'] ? 1 : 0) : ($atual['favorita'] ? 1 : 0);

$stmt = $conexao->prepare("UPDATE tarefas
                              SET titulo = ?, descricao = ?, status = ?, prioridade = ?,
                                  categoria_id = ?, data_expiracao = ?, favorita = ?
                            WHERE id = ?");
$stmt->bind_param("ssssisii",
    $t['titulo'], $t['descricao'], $t['status'], $t['prioridade'],
    $t['categoria_id'], $t['data_expiracao'], $favorita, $id
);
$stmt->execute();
$stmt->close();

$tarefa = buscarTarefa($conexao, $id);
$conexao->close();

retornar('ok', 'Tarefa alterada com sucesso!', $tarefa);
