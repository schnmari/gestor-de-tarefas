<?php
/*
 * Padrão de resposta de TODOS os endpoints (igual ao UniRide):
 *
 *   {
 *     "status":   "ok" | "nok",
 *     "mensagem": "texto para mostrar ao usuário",
 *     "data":     [] // o retorno de fato (lista, registro ou erros de validação)
 *   }
 */
function retornar($status, $mensagem, $data = [])
{
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode([
        'status'   => $status,
        'mensagem' => $mensagem,
        'data'     => $data
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/* Garante que o endpoint só aceite o método esperado (GET ou POST). */
function exigirMetodo($metodo)
{
    if ($_SERVER['REQUEST_METHOD'] !== $metodo) {
        retornar('nok', "Método não permitido. Use $metodo.");
    }
}

/* Lê o ?id= da URL. Se não vier um inteiro positivo, já responde com erro. */
function lerIdDaUrl()
{
    $id = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]) : false;
    if ($id === false) {
        retornar('nok', 'É necessário informar um ID válido.');
    }
    return $id;
}
