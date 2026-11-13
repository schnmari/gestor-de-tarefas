<?php
/*
 * Funcionalidade 8 - Cadastrar nova categoria
 * POST categorias/php/novaCategoria.php
 * Campo (FormData): nome
 */
include_once('../../php/conexao.php');
include_once('../../php/retorno.php');
include_once('../../php/validacoes.php');

exigirMetodo('POST');

$erros = validarCategoria($_POST);
if (!empty($erros)) {
    retornar('nok', $erros['nome'], $erros);
}

$nome = trim($_POST['nome']);

// Não deixa repetir nome (a comparação ignora maiúsculas/minúsculas)
$stmt = $conexao->prepare("SELECT id FROM categorias WHERE nome = ?");
$stmt->bind_param("s", $nome);
$stmt->execute();
$jaExiste = $stmt->get_result()->num_rows > 0;
$stmt->close();

if ($jaExiste) {
    retornar('nok', 'Já existe uma categoria com esse nome.', ['nome' => 'Já existe uma categoria com esse nome.']);
}

$stmt = $conexao->prepare("INSERT INTO categorias (nome) VALUES (?)");
$stmt->bind_param("s", $nome);
$stmt->execute();
$novoId = $stmt->insert_id;
$stmt->close();
$conexao->close();

retornar('ok', 'Categoria criada com sucesso!', ['id' => $novoId, 'nome' => $nome]);
