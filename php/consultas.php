<?php
/*
 * consultas.php
 * ------------------------------------------------------------------
 * Consultas ao banco reaproveitadas por vários endpoints.
 * ------------------------------------------------------------------
 */

/* SELECT base das tarefas, já trazendo o nome da categoria. */
const SQL_SELECT_TAREFAS = "SELECT t.*, c.nome AS categoria_nome
                              FROM tarefas t
                         LEFT JOIN categorias c ON c.id = t.categoria_id";

/* Busca uma tarefa pelo id. Retorna o array da tarefa ou null. */
function buscarTarefa($conexao, $id)
{
    $stmt = $conexao->prepare(SQL_SELECT_TAREFAS . " WHERE t.id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $linha = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    return $linha ? formatarTarefa($linha) : null;
}

/* Lista todas as tarefas: favoritas primeiro, depois as mais recentes. */
function listarTarefas($conexao)
{
    $resultado = $conexao->query(SQL_SELECT_TAREFAS . " ORDER BY t.favorita DESC, t.criado_em DESC, t.id DESC");

    $tabela = [];
    while ($linha = $resultado->fetch_assoc()) {
        $tabela[] = formatarTarefa($linha);
    }
    return $tabela;
}

/* Verifica se a categoria existe (Func. 8). */
function categoriaExiste($conexao, $id)
{
    $stmt = $conexao->prepare("SELECT id FROM categorias WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $existe = $stmt->get_result()->num_rows > 0;
    $stmt->close();

    return $existe;
}

/* Converte os tipos que vêm do banco (tudo string) para os tipos certos. */
function formatarTarefa($linha)
{
    $linha['id']           = (int)$linha['id'];
    $linha['categoria_id'] = $linha['categoria_id'] !== null ? (int)$linha['categoria_id'] : null;
    $linha['favorita']     = (bool)$linha['favorita'];
    return $linha;
}
