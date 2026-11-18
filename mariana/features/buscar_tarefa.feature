# language: pt
Funcionalidade: Buscar tarefa por texto
  Como usuário do sistema de gestão de tarefas
  Quero buscar minhas tarefas digitando um texto
  Para encontrar rapidamente a tarefa que procuro

  Contexto:
    Dado que tenho as seguintes tarefas cadastradas:
      | titulo                | descricao            |
      | Comprar pão           | Passar na padaria    |
      | Revisão de matemática | Estudar para a prova |
      | Pagar conta de luz    | Vence na sexta-feira |

  Cenário: Buscar uma tarefa pelo título
    Quando eu digito "Comprar pão" no campo de busca
    Então deve aparecer somente a tarefa "Comprar pão"

  Cenário: Buscar uma tarefa pela descrição
    Quando eu digito "padaria" no campo de busca
    Então deve aparecer somente a tarefa "Comprar pão"

  Cenário: A busca ignora maiúsculas e acentos
    Quando eu digito "REVISAO" no campo de busca
    Então deve aparecer somente a tarefa "Revisão de matemática"

  Cenário: A busca não encontra nenhuma tarefa
    Quando eu digito "academia" no campo de busca
    Então nenhuma tarefa deve aparecer na lista
