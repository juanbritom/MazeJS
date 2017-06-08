# MazeJS
As configurações são feitas através do arquivo index.html, editando as variáveis, podendo então ser executado em algum navegador (que suporte HTML5).

Os valores que cada variável aceita estão em comentário na linha de cada variável.

Para escolher como gerar o labirinto:

w: define o tamanho em pixels de cada célula

wid: define a largura em pixels do canvas

hei: define a altura em pixels do canvas

isThereACanvas: booleana que define se o canvas será mostrado ou não

status: status inicial e de controle para o labirinto, recomendável não mudar do valor já setado

timesToCreate: variável que controla quantos labirintos serão gerados e analizados segundo as métricas. 0 cria apenas uma vez (e resolve caso esteja configurado para tal)

solveMetrics: variável que controla se, para cada labirinto, serão executados os cálculos de métrica para todos os 3 algoritmos de resolução.
As métricas são exibidas no console do navegador

mode: Define se o labirinto será gerado e resolvido com ou sem animação

createAlg: Define o algoritmo que será usado para criação do labirinto

solveAlg: Define o algoritmo que será usado para resolução do labirinto

AStarHeuristic: Define a heurística que será usada para os algoritmos que utilizam heurísticas (apesar do nome de variável indicar AStar)

varíaveis color: Podem ser ajustadas como o valor inicial de cada elemento do labirinto (vetor [R,G,B,Transparência]). As variáveis também podem ser editadas através dos controles na interface, embora não sejam salvos para próximas iterações.
