# language: pt
@josue
Funcionalidade: Criar tarefa
  Como usuário do gestor de tarefas
  Quero cadastrar uma nova tarefa
  Para organizar o que preciso fazer

  Contexto:
    Dado que o formulário de nova tarefa está aberto

  Cenário: Cadastrar uma tarefa com título, descrição e prioridade
    Quando eu preencho o título "Estudar para a prova"
    E eu preencho a descrição "Revisar o capítulo 3"
    E eu preencho a prioridade "alta" no formulário
    E eu cadastro a tarefa
    Então a tarefa "Estudar para a prova" deve estar cadastrada com prioridade "alta"
    E a lista de tarefas deve conter 1 tarefa

  Cenário: Cadastrar tarefa sem título
    Quando eu preencho a prioridade "media" no formulário
    E eu cadastro a tarefa
    Então o campo "titulo" deve exibir o erro "O título é obrigatório."
    E a lista de tarefas deve conter 0 tarefa

  Cenário: Cadastrar tarefa sem prioridade
    Quando eu preencho o título "Comprar pão"
    E eu cadastro a tarefa
    Então o campo "prioridade" deve exibir o erro "A prioridade é obrigatória."
    E a lista de tarefas deve conter 0 tarefa
