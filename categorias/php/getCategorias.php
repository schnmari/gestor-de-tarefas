<?php
/*
 * Funcionalidade 8 - Listar categorias
 * GET categorias/php/getCategorias.php
 */
include_once('../../php/conexao.php');
include_once('../../php/retorno.php');

exigirMetodo('GET');

$resultado = $conexao->query("SELECT id, nome FROM categorias ORDER BY id");

$tabela = [];
while ($linha = $resultado->fetch_assoc()) {
    $linha['id'] = (int)$linha['id'];
    $tabela[] = $linha;
}
$conexao->close();

retornar('ok', count($tabela) . ' categoria(s) encontrada(s)', $tabela);
