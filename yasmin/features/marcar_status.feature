# language: pt
Funcionalidade: Marcar status da tarefa
  Como um usuário do sistema de gestão de tarefas
  Eu quero alterar o status de uma tarefa 
  Para que eu possa atualizar o andamento das minhas tarefas
  
   Cenário: Criar uma tarefa definindo o status atual da tarefa
        Dado que estou na tela de cadastro de uma nova tarefa
        Quando eu preencho o título "Pagar conta de luz"
        E seleciono o status "Pendente" no campo de seleção
        E clico no botão "Adicionar tarefa"
        Então o card da tarefa "Pagar conta de luz" deve mostrar o status como "Pendente"

   Cenário: Alterar o status de uma tarefa pendente para concluída 
        Dado que existe uma tarefa cadastrada com o título "Pagar conta de luz” com status "Pendente" 
        Quando eu clico no seletor de status da tarefa   "Pagar conta de luz” 
        E seleciono a opção "Concluída" 
        Então o status da tarefa "Pagar conta de luz” deve mudar para "Concluída" 
    
   Cenário: Mudar o status de uma tarefa concluída para em andamento 
        Dado  que existe uma tarefa cadastrada com o título “Pagar conta de luz” com status "Concluída" 
        Quando   eu clico no seletor de status da tarefa “Pagar conta de luz”
        E seleciono a opção "Em andamento" 
        Então  o status da tarefa  "Pagar conta de luz" deve mudar para "Em andamento" 
