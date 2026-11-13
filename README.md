# ✅ Gestor de Tarefas

Sistema web de gestão de tarefas do dia a dia (to-do list) feito com **PHP**, **MySQL** e **JavaScript**.

![Tela principal](capturas_de_tela/TelaPrincipal.png)

---

## ✨ Funcionalidades

1. Criar tarefa
2. Editar tarefa
3. Excluir tarefa
4. Marcar status (pendente, em andamento, concluída)
5. Filtrar por status
6. Definir prioridade (alta, média, baixa)
7. Filtrar por prioridade
8. Categorizar (Casa, Trabalho, Estudos ou nova categoria)
9. Buscar por texto
10. Ordenar por data de expiração
11. Barra de progresso
12. Favoritar (favoritas ficam no topo)

---

## 🛠️ Tecnologias

HTML5 · CSS3 · JavaScript · PHP · MySQL · SweetAlert2

---

## 📂 Estrutura

```text
GestorTarefas/
├── tarefas/            # Módulo de tarefas (html, javascript, php)
├── categorias/         # Módulo de categorias (javascript, php)
├── php/                # Conexão, validações e funções compartilhadas
├── javascript/         # Regras, requisições e alertas compartilhados
├── css/                # Estilos
├── assets/             # Ícones
├── capturas_de_tela/   # Prints do sistema
└── bancoGestorTarefas.sql
```

---

## ⚙️ Como executar

1. Coloque a pasta `GestorTarefas` em `htdocs` (XAMPP) e inicie o **Apache** e o **MySQL**.
2. No **phpMyAdmin**, importe o arquivo `bancoGestorTarefas.sql`.
3. Se precisar, ajuste usuário, senha e porta em `php/conexao.php`.
4. Acesse: `http://localhost/GestorTarefas/`
