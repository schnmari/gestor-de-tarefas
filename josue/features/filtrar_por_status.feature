# language: pt
@josue
Funcionalidade: Filtrar por status
  Como usuário do gestor de tarefas
  Quero filtrar as tarefas pelo status
  Para enxergar apenas o que preciso ver agora

  Contexto:
    Dado que a lista contém a tarefa "Estudar" com status "pendente"
    E que a lista contém a tarefa "Trabalhar" com status "em_andamento"
    E que a lista contém a tarefa "Descansar" com status "concluida"

  Cenário: Filtrar apenas as tarefas pendentes
    Quando eu aplicar o filtro de status "pendente"
    Então a lista filtrada deve conter 1 tarefa
    E a lista filtrada deve conter a tarefa "Estudar"
    E a lista filtrada não deve conter a tarefa "Trabalhar"

  Cenário: Filtrar apenas as tarefas concluídas
    Quando eu aplicar o filtro de status "concluida"
    Então a lista filtrada deve conter 1 tarefa
    E a lista filtrada deve conter a tarefa "Descansar"
    E a lista filtrada não deve conter a tarefa "Estudar"

  Cenário: Filtrar apenas as tarefas em andamento
    Quando eu aplicar o filtro de status "em_andamento"
    Então a lista filtrada deve conter 1 tarefa
    E a lista filtrada deve conter a tarefa "Trabalhar"
    E a lista filtrada não deve conter a tarefa "Descansar"
