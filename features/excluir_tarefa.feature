# language: pt
Funcionalidade: Excluir tarefa
  Como usuário do sistema de gestão de tarefas
  Quero excluir uma tarefa da minha lista
  Para manter minhas tarefas organizadas

  Cenário: Excluir uma tarefa após confirmar
    Dado que existe a tarefa "Estudar" na lista
    Quando eu peço para excluir a tarefa "Estudar"
    E confirmo a exclusão
    Então deve ser exibida a mensagem "Tarefa excluída com sucesso!"

  Cenário: Cancelar a exclusão
    Dado que existe a tarefa "Estudar biologia" na lista
    Quando eu peço para excluir a tarefa "Estudar biologia"
    E cancelo a confirmação
    Então a tarefa "Estudar biologia" deve continuar na lista