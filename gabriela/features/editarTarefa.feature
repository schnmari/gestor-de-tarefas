
# language: pt

Funcionalidade: Editar tarefa
  Como usuário do sistema
  Quero editar uma tarefa existente
  Para atualizar suas informações.

  Cenário: Editar uma tarefa com sucesso
    Dado que existe uma tarefa cadastrada
    E estou na tela de edição dessa tarefa
    Quando altero o título para "Estudar para a prova"
    E altero a descrição para "Revisar os conteúdos da disciplina"
    E seleciono a prioridade "alta"
    E clico em "Salvar alterações"
    Então o sistema deve salvar as alterações da tarefa
    E deve apresentar uma confirmação de sucesso

  Cenário: Tentar salvar uma tarefa sem título
    Dado que existe uma tarefa cadastrada
    E estou na tela de edição dessa tarefa
    Quando apago o título da tarefa
    E clico em "Salvar alterações"
    Então o sistema deve impedir o salvamento
    E deve apresentar a mensagem "O título é obrigatório."

  Cenário: Tentar salvar um título com mais de 150 caracteres
    Dado que existe uma tarefa cadastrada
    E estou na tela de edição dessa tarefa
    Quando informo um título com 151 caracteres
    E clico em "Salvar alterações"
    Então o sistema deve impedir o salvamento
    E deve apresentar a mensagem "O título deve ter no máximo 150 caracteres."

  Cenário: Tentar editar uma tarefa inexistente
    Dado que acesso a tela de edição com um identificador inexistente
    Quando o sistema tenta carregar a tarefa
    Então deve apresentar uma mensagem de erro
    E deve redirecionar para a lista de tarefas
