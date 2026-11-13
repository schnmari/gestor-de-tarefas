-- =====================================================
-- Gestor de Tarefas - Script do banco de dados (MySQL)
-- Execute este arquivo inteiro no phpMyAdmin ou no terminal:
--   mysql -u root -p < bancoGestorTarefas.sql
-- =====================================================

CREATE DATABASE IF NOT EXISTS gestor_tarefas
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE gestor_tarefas;

-- -----------------------------------------------------
-- Tabela de categorias (Funcionalidade 8)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS categorias (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
);

-- -----------------------------------------------------
-- Tabela de tarefas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS tarefas (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    titulo         VARCHAR(150) NOT NULL,
    descricao      TEXT NULL,
    status         ENUM('pendente', 'em_andamento', 'concluida') NOT NULL DEFAULT 'pendente', -- Func. 4
    prioridade     ENUM('alta', 'media', 'baixa') NOT NULL DEFAULT 'media',                  -- Func. 6
    categoria_id   INT NULL,                                                                  -- Func. 8
    data_expiracao DATE NULL,                                                                 -- Func. 10
    favorita       TINYINT(1) NOT NULL DEFAULT 0,                                             -- Func. 12
    criado_em      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tarefas_categoria
        FOREIGN KEY (categoria_id) REFERENCES categorias(id)
        ON DELETE SET NULL
);

-- -----------------------------------------------------
-- Categorias padrão
-- -----------------------------------------------------
INSERT IGNORE INTO categorias (nome) VALUES ('Casa'), ('Trabalho'), ('Estudos');
