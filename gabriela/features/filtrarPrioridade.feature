# language: pt

Funcionalidade: Filtrar tarefas por prioridade
  Como usuário do sistema
  Quero filtrar as tarefas pela prioridade
  Para visualizar tarefas de acordo com sua prioridade.

  Cenário: Filtrar tarefas por uma prioridade específica
    Dado que existem tarefas cadastradas com diferentes prioridades
    Quando escolho a prioridade "alta" para filtrar
    Então devem ser exibidas apenas as tarefas com prioridade "alta"

  Cenário: Exibir todas as tarefas ao selecionar todas as prioridades
    Dado que existem tarefas cadastradas com diferentes prioridades
    Quando seleciono a opção "todas" as prioridades
    Então devem ser exibidas todas as tarefas cadastradas

  Cenário: Não encontrar tarefas para a prioridade selecionada
    Dado que existem tarefas cadastradas apenas com prioridades média e baixa
    Quando escolho a prioridade "alta" para filtrar
    Então nenhuma tarefa deve ser exibida
