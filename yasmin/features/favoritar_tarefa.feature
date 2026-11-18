# language: pt
Funcionalidade: Marcar tarefa como favorita
  Como um usuário do sistema de gestão de tarefas
  Eu quero marcar tarefa como favorita
  Para alternar seu estado e destacá-la no topo da lista

   Cenário: Marcar tarefa como favorita clicando no ícone de estrela 
        Dado que existe uma tarefa cadastrada com o título "Treinar”  e não está marcada como favorita
        Quando eu clico no ícone de estrela  Da tarefa “Treinar”    
        Então o ícone de estrela deve se tornar amarelo/preenchido indicando que é favorita 
	    E a tarefa deve ser posicionada no topo da listagem 

   Cenário: Remover o favorito de uma tarefa clicando na estrela preenchida 
        Dado que existe uma tarefa cadastrada com o título  "Treinar”  que possui o ícone de favorito preenchido 
        Quando eu eu clico no ícone de estrela da tarefa “Treinar”     	
        Então o ícone de estrela deve voltar a ficar vazio 
	    E a tarefa deve perder o destaque de favorito 
