<?php
/*
 * Funcionalidade 4 - Marcar status da tarefa
 * POST tarefas/php/alterarStatus.php?id=1
 * Campo (FormData): status = pendente | em_andamento | concluida
 */
include_once('../../php/conexao.php');
include_once('../../php/retorno.php');
include_once('../../php/validacoes.php');
include_once('../../php/consultas.php');

exigirMetodo('POST');
$id     = lerIdDaUrl();
$status = $_POST['status'] ?? null;

if (!statusValido($status)) {
    retornar('nok', 'Status inválido. Use: pendente, em_andamento ou concluida.', ['status' => 'Status inválido.']);
}

if (buscarTarefa($conexao, $id) === null) {
    retornar('nok', 'Tarefa não encontrada.');
}

$stmt = $conexao->prepare("UPDATE tarefas SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $id);
$stmt->execute();
$stmt->close();

$tarefa = buscarTarefa($conexao, $id);
$conexao->close();

retornar('ok', 'Status atualizado!', $tarefa);
