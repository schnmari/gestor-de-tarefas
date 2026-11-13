<?php
/*
 * GET tarefas/php/getTarefas.php        -> lista todas as tarefas
 * GET tarefas/php/getTarefas.php?id=1   -> busca uma tarefa
 */
include_once('../../php/conexao.php');
include_once('../../php/retorno.php');
include_once('../../php/consultas.php');

exigirMetodo('GET');

// 1a situação - recebendo o id por GET: retorna só uma tarefa
if (isset($_GET['id'])) {
    $id     = lerIdDaUrl();
    $tarefa = buscarTarefa($conexao, $id);
    $conexao->close();

    if ($tarefa === null) {
        retornar('nok', 'Tarefa não encontrada.');
    }
    retornar('ok', 'Registro encontrado', $tarefa);
}

// 2a situação - sem id: retorna a lista inteira
$tabela = listarTarefas($conexao);
$conexao->close();

retornar('ok', count($tabela) . ' registro(s) encontrado(s)', $tabela);
