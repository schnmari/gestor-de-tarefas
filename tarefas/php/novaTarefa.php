<?php
/*
 * Funcionalidade 1 - Criar tarefa
 * POST tarefas/php/novaTarefa.php
 * Campos (FormData): titulo, descricao, prioridade, status, categoria_id, data_expiracao, favorita
 */
include_once('../../php/conexao.php');
include_once('../../php/retorno.php');
include_once('../../php/validacoes.php');
include_once('../../php/consultas.php');

exigirMetodo('POST');

// Validação dos campos
$erros = validarTarefa($_POST);

if (!isset($erros['categoria_id']) && !vazio($_POST['categoria_id'] ?? null)
    && !categoriaExiste($conexao, (int)$_POST['categoria_id'])) {
    $erros['categoria_id'] = 'Categoria não encontrada.';
}

if (!empty($erros)) {
    retornar('nok', 'Verifique os campos destacados.', $erros);
}

// Dados limpos e com valores padrão
$t = normalizarTarefa($_POST);
$favorita = $t['favorita'] ? 1 : 0;

$stmt = $conexao->prepare("INSERT INTO tarefas (titulo, descricao, status, prioridade, categoria_id, data_expiracao, favorita)
                           VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssisi",
    $t['titulo'], $t['descricao'], $t['status'], $t['prioridade'],
    $t['categoria_id'], $t['data_expiracao'], $favorita
);
$stmt->execute();
$novoId = $stmt->insert_id;
$stmt->close();

$tarefa = buscarTarefa($conexao, $novoId);
$conexao->close();

retornar('ok', 'Tarefa criada com sucesso!', $tarefa);
