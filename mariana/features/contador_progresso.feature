# language: pt
Funcionalidade: Visualizar contador de progresso
  Como usuário do sistema de gestão de tarefas
  Quero ver quantas das minhas tarefas já foram concluídas
  Para acompanhar o meu progresso no dia

  Cenário: Progresso zerado quando não existe nenhuma tarefa
    Dado que não tenho nenhuma tarefa cadastrada
    Quando eu abro a tela principal de tarefas
    Então o progresso deve mostrar "0 de 0 tarefas concluídas"
    E o percentual de progresso deve ser "0%"

  Cenário: Tarefas em andamento não contam no progresso
    Dado que minhas tarefas são:
      | titulo           | status       |
      | Fazer o trabalho | Em andamento |
      | Ir ao mercado    | Concluída    |
    Quando eu abro a tela principal de tarefas
    Então o progresso deve mostrar "1 de 2 tarefas concluídas"

  Cenário: Concluir uma tarefa atualiza o progresso
    Dado que minhas tarefas são:
      | titulo        | status    |
      | Lavar a louça | Pendente  |
      | Ir ao mercado | Concluída |
    E eu abro a tela principal de tarefas
    Quando eu altero o status da tarefa "Lavar a louça" para "Concluída"
    Então o progresso deve mostrar "2 de 2 tarefas concluídas"
    E o percentual de progresso deve ser "100%"

  Esquema do Cenário: Calcular o percentual de progresso
    Dado que tenho <total> tarefas cadastradas, sendo <concluidas> concluídas
    Quando eu abro a tela principal de tarefas
    Então o progresso deve mostrar "<concluidas> de <total> tarefas concluídas"
    E o percentual de progresso deve ser "<percentual>"

    Exemplos:
      | total | concluidas | percentual |
      | 4     | 1          | 25%        |
      | 3     | 2          | 67%        |
      | 2     | 2          | 100%       |
