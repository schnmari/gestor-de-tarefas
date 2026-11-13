<?php
/*
 * Funcionalidade 3 - Excluir tarefa
 * POST tarefas/php/excluirTarefa.php?id=1
 */
include_once('../../php/conexao.php');
include_once('../../php/retorno.php');

exigirMetodo('POST');
$id = lerIdDaUrl();

$stmt = $conexao->prepare("DELETE FROM tarefas WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$excluiu = $stmt->affected_rows > 0;
$stmt->close();
$conexao->close();

if (!$excluiu) {
    retornar('nok', 'Tarefa não encontrada.');
}
retornar('ok', 'Tarefa excluída com sucesso!');
