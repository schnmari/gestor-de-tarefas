# language: pt
Funcionalidade: Ordenar tarefas por data de expiração
  Como um usuário do Gestor de Tarefas
  Eu quero ordenar minhas tarefas pela data de expiração mais próxima ou mais distante
  Para priorizar os prazos de entrega e visualizar tarefas sem data ao final da lista

  Cenário: Ordenar tarefas pela expiração mais próxima
    Dado que o usuário está na tela principal de listagem de tarefas
    E existem tarefas não favoritas cadastradas com datas "2026-11-25", "2026-11-15" e uma tarefa "Sem data de expiração"
    Quando ele seleciona a opção "Expiração mais próxima" no campo "Ordenar por"
    Então o sistema reordena a lista exibindo primeiro a tarefa que expira em "15/11/2026", seguida pela de "25/11/2026"
    E posiciona a tarefa "Sem data de expiração" no final da lista

  Cenário: Ordenar tarefas pela expiração mais distante
    Dado que o usuário está na tela principal de listagem de tarefas
    E existem tarefas não favoritas cadastradas com datas "2026-11-15", "2026-11-25" e uma tarefa "Sem data de expiração"
    Quando ele seleciona a opção "Expiração mais distante" no campo "Ordenar por"
    Então o sistema reordena a lista exibindo primeiro a tarefa que expira em "25/11/2026", seguida pela de "15/11/2026"
    E mantém a tarefa "Sem data de expiração" no final da lista