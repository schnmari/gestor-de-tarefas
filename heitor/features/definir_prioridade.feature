# language: pt
Funcionalidade: Definir prioridade da tarefa
  Como usuário do sistema de gestão de tarefas
  Quero definir a prioridade de uma tarefa
  Para organizar quais tarefas precisam de atenção primeiro

  Cenário: Criar uma tarefa definindo a prioridade
    Dado que estou no formulário de nova tarefa
    E preenchi o título "Estudar"
    Quando eu escolho a prioridade "alta"
    E salvo a tarefa
    Então o card da tarefa "Estudar" deve mostrar "Prioridade alta"

  Cenário: Criar uma tarefa sem informar a prioridade
    Dado que estou no formulário de nova tarefa
    E preenchi o título "Estudar"
    Quando eu salvo a tarefa sem escolher a prioridade
    Então deve ser exibida a mensagem de erro "A prioridade é obrigatória."
    E a tarefa "Estudar" não deve ser criada

  Cenário: Alterar a prioridade de uma tarefa existente
    Dado que existe a tarefa "Estudar" com prioridade "baixa"
    Quando eu edito a tarefa e escolho a prioridade "alta"
    E salvo a tarefa
    Então o card da tarefa "Estudar" deve mostrar "Prioridade alta"