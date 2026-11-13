<?php
/*
 * Funcionalidade 12 - Marcar/desmarcar tarefa como favorita
 * POST tarefas/php/favoritarTarefa.php?id=1
 * Campo (FormData): favorita = 1 (marcar) | 0 (desmarcar)
 */
include_once('../../php/conexao.php');
include_once('../../php/retorno.php');
include_once('../../php/validacoes.php');
include_once('../../php/consultas.php');

exigirMetodo('POST');
$id       = lerIdDaUrl();
$favorita = valorBooleano($_POST['favorita'] ?? '0') ? 1 : 0;

if (buscarTarefa($conexao, $id) === null) {
    retornar('nok', 'Tarefa não encontrada.');
}

$stmt = $conexao->prepare("UPDATE tarefas SET favorita = ? WHERE id = ?");
$stmt->bind_param("ii", $favorita, $id);
$stmt->execute();
$stmt->close();

$tarefa = buscarTarefa($conexao, $id);
$conexao->close();

retornar('ok', $favorita ? 'Tarefa adicionada aos favoritos!' : 'Tarefa removida dos favoritos.', $tarefa);
