# language: pt
Funcionalidade: Categorizar itens
  Como um usuário do Gestor de Tarefas
  Eu quero associar categorias às minhas tarefas
  Para organizar minhas atividades por contexto

  Cenário: Categorizar uma nova tarefa com uma categoria existente
    Dado que estou no formulário de nova tarefa com a categoria "Estudos" de id "3" disponível
    Quando preencho o campo título com "Estudar BDD"
    E seleciono a categoria de id "3" no formulário
    E envio o formulário para salvar a tarefa
    Então a tarefa deve ser salva na lista com o título "Estudar BDD" e categoria_id 3

  Cenário: Criar uma nova categoria durante o cadastro da tarefa
    Dado que estou no formulário de nova tarefa com 3 categorias padrão cadastradas
    Quando abro a caixa de nova categoria e digito o nome "Academia"
    E clico para salvar a nova categoria
    Então a categoria "Academia" deve ser cadastrada e ficar selecionada com id "4" no campo categoria