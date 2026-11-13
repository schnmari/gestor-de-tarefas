<?php
/*
 * Conexão com o banco de dados (mysqli).
 * Ajuste servidor, porta, usuário e senha conforme o seu XAMPP.
 * (No UniRide a porta usada era 3307 — se for o seu caso, troque abaixo.)
 */
$servidor = "localhost";
$porta    = 3306;
$usuario  = "root";
$senha    = "";
$banco    = "gestor_tarefas";

// Qualquer erro do MySQL vira exceção...
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// ...e qualquer exceção não tratada volta para o front no formato padrão (status/mensagem/data)
set_exception_handler(function ($erro) {
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode([
        'status'   => 'nok',
        'mensagem' => 'Erro no servidor: ' . $erro->getMessage(),
        'data'     => []
    ]);
});

$conexao = new mysqli($servidor, $usuario, $senha, $banco, $porta);
$conexao->set_charset("utf8mb4");
