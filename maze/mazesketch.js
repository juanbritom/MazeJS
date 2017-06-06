var cols, rows;
var totalcells = wid*hei/w/w;
//ajusta wid e hei para caber cells de tamanho w
while (totalcells%2){
  wid+=1;
  hei+=1;
  var totalcells = wid*hei/w/w;
}
var remaining = totalcells - 1;
var grid = [];
//muitas dessas variáveis poderiam não ser globais, porém
//seria perdida a possibilidade de animação step-by-step
//para DFS
var first = true;
var current,next;
var stack = [];
//para Prim
var frontier = [];
var frontiers;
//para AEstrela
var caminho;
var fts = true;
var openSet = [];
var closedSet = [];
var inicio;
var fim;

function setup() {
  createCanvas(wid, hei);
  cols = floor(width/w);
  rows = floor(height/w);
  createCells();
  current = grid[floor(random(0, grid.length))];
  current.visited = true;
  frameRate(144);
}

function draw() {
  background(51);
  for (var i = 0; i<grid.length; i++) {
    grid[i].show();
  }
  current.highlight();
  if (mode == "Anim"){
    if(status == "create") {
      if(createAlg=="DFS") {
        next = current.checkNeighbors();
        current.visited = true;
        current.highlight();
        if (next) {
          stack.push(current);
          //tira parede entre as celulas
          removeWalls(current,next);
          //torna o vizinho a proxima cell
          current = next;
        }else if(stack.length > 0){
          current = stack.pop();
        }else if(stack.length === 0) {
          current = grid[0];
          status = "solve";
        }
      }else if(createAlg=="Prim") {
        current.highlight();

        stack.push(current);
        current.markNeighAsFrontier();
        //colocar if no lugar do while se quiser animação e current e solve num else
        if(frontier.length>0) {
          var indiceRfc = floor(random(0,frontier.length));
          current = frontier[indiceRfc];  //random da frontier
          var randomIncell = current.randomInCell();
          //stack.push(current); //comentar essa linha caso animação
          current.visited = true;
          current.partOffrontier = false;
          current.markNeighAsFrontier();
          removeWalls(current,randomIncell);
          frontier.splice(indiceRfc,1);
        }else{
          current = grid[0];
          status = "solve";
        }
      }else if (createAlg=="Aldous") {
          current.highlight();
          if(remaining > 0) {
            vizinho = current.retornaVizRandomico();
              if(vizinho.visited === false){
                removeWalls(current,vizinho);
                vizinho.visited = true;
                remaining -= 1;
              }
            current = vizinho;
          }else{
            current = grid[0];
            status = "solve";
          }
        }
    }
    else{ //solve
      if(fts){ //first time solving
        fim = grid[(totalcells) - 1];
        fim.highlight();
        inicio = current;
        openSet = [inicio];
        inicio.aStarGValue = 0;
        inicio.aStarFValue = HUEristic(inicio,fim);
        inicio.aStarHValue = HUEristic(inicio,fim);
        inicio.visitedSolve = true;
        disVisitdisFrontier(grid);
        fts = false;
      }
      if(solveAlg=="AStar"){
        fim.highlight();
        if (openSet.length>0){
          idxMenorOpenSetScore = menorfScore(openSet);
          inicio = openSet[idxMenorOpenSetScore];
          //inicio.partOffrontier = true;
          if(inicio == fim){
            caminho = recon_path(inicio);
            openSet = [];
          }
          mostrarCaminho(recon_path(inicio));
          closedSet.push(inicio);
          openSet.splice(idxMenorOpenSetScore,1);
          var vizinhos = inicio.retornaTodosVizinhos();
          for (i = 0; i<vizinhos.length; i++) {
            if (inicio == fim || inArray(vizinhos[i],closedSet) || !isMovePossible(inicio,vizinhos[i])){
              continue;
            }
            vizinhos[i].highlightPossible();
            gScore = inicio.aStarGValue +3;
            var gScoreIsBest = false;
            if(!inArray(vizinhos[i],openSet)){
              gScoreIsBest = true;
              vizinhos[i].aStarHValue = HUEristic(vizinhos[i],fim);
              openSet.push(vizinhos[i]);
            }else if(gScore < vizinhos[i].aStarGValue) {
              gScoreIsBest = true;
            }
            if(gScoreIsBest) {
              vizinhos[i].partOffrontier = true;
              vizinhos[i].pai = inicio;
              vizinhos[i].aStarGValue = gScore;
              vizinhos[i].attFValue();
            }
          }

        }else{
          mostrarCaminho(caminho);
        }
        //var caminho = AEstrela(current,end);
      }else if(solveAlg=="BFS"){
        fim.highlight();
        if(openSet.length>0){
          var c = openSet.pop();
          c.visitedSolve = true;
          c.highlight();
          if(c==fim){
            caminho = recon_path(c);
            openSet = [];
          }else{
            var neigh = c.retornaTodosVizinhos();
            for (i = 0; i<neigh.length; i++) {
              if (!neigh[i].visitedSolve && isMovePossible(c,neigh[i])){
                neigh[i].highlightPossible();
                neigh[i].visitedSolve = true;
                neigh[i].pai = c;
                openSet.unshift(neigh[i]);
              }
            }
            c.partOffrontier = true; //examined
          }
        }else{
          mostrarCaminho(caminho);
        }
      }else if(solveAlg == "GBFirst") {
        fim.highlight();
        if (openSet.length>0){
          idxMenorOpenSetScore = menorhScore(openSet);
          inicio = openSet[idxMenorOpenSetScore];
          //inicio.partOffrontier = true;
          if(inicio == fim){
            caminho = recon_path(inicio);
            openSet = [];
          }
          mostrarCaminho(recon_path(inicio));
          closedSet.push(inicio);
          openSet.splice(idxMenorOpenSetScore,1);
          var kinjins = inicio.retornaTodosVizinhos();
          for (i = 0; i<kinjins.length; i++) {
            if (inicio == fim || inArray(kinjins[i],closedSet) || !isMovePossible(inicio,kinjins[i])){
              continue;
            }
            kinjins[i].highlightPossible();
            var hScore = inicio.aStarHValue;
            var hScoreIsBest = false;
            if(!inArray(kinjins[i],openSet) && hScore < kinjins[i].aStarHValue){
              hScoreIsBest = true;
              kinjins[i].aStarHValue = HUEristic(kinjins[i],fim);
              openSet.push(kinjins[i]);
            }
            // else if(hScore < kinjins[i].aStarHValue) {
            //   hScoreIsBest = true;
            // }
            if(hScoreIsBest) {
              kinjins[i].partOffrontier = true;
              kinjins[i].pai = inicio;
              kinjins[i].aStarHValue = hScore;
              kinjins[i].attFValueGBS();
            }
          }
        }else{
          mostrarCaminho(caminho);
        }
      }
    }
  }else if(mode == "NoAnim"){
    if(status === "create") {
      if(createAlg=="DFS") {
        while(status == "create"){
          next = current.checkNeighbors();
          current.visited = true;
          if (next) {
            stack.push(current);
            //tira parede entre as celulas
            removeWalls(current,next);
            //torna o vizinho a proxima cell
            current = next;
          }else if(stack.length > 0){
            current = stack.pop();
          }else if(stack.length === 0) {
            current = grid[0];
            status = "solve";
          }
        }
      }else if(createAlg=="Prim") {
        current.highlight();

        stack.push(current);
        current.markNeighAsFrontier();
        //colocar if no lugar do while se quiser animação e current e solve num else
        while(frontier.length>0) {
          indiceRfrontierCell = floor(random(0,frontier.length));
          current = frontier[indiceRfrontierCell];  //random da frontier
          var randomInteriorCell = current.randomInCell();
          stack.push(current); //comentar essa linha caso animação
          current.visited = true;
          current.partOffrontier = false;
          current.markNeighAsFrontier();
          removeWalls(current,randomInteriorCell);
          frontier.splice(indiceRfrontierCell,1);
        }
        current = grid[0];
        status = "solve";
      }else if (createAlg=="Aldous") {
          current.highlight();
          while(remaining > 0) {
            vizinho = current.retornaVizRandomico();
              if(vizinho.visited === false){
                removeWalls(current,vizinho);
                vizinho.visited = true;
                remaining -= 1;
              }
            current = vizinho;
          }
          current = grid[0];
          status = "solve";
      }
    }else{
      if(fts){ //first time solving
        fim = grid[(totalcells) - 1];
        fim.highlight();
        inicio = current;
        openSet = [inicio];
        inicio.aStarGValue = 0;
        inicio.aStarHValue = HUEristic(inicio,fim);
        inicio.attFValue();
        fts = false;
      }
      if(solveAlg=="AStar"){
        fim.highlight();
        caminho = AEstrela(inicio,fim);
        mostrarCaminho(caminho);
      }else if(solveAlg == "BFS"){
        fim.highlight();
        caminho = doBFS(inicio,fim);
        mostrarCaminho(caminho);
      }
    }
  }
}
