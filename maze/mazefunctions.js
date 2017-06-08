//lul
function createCells() {
  if(grid.length>0){
    grid = [];
  }
  for (var j=0; j < rows; j++) {
    for (var i=0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }
}
//verifica se um elemento target tá no array array
function inArray(target, array) {
  for(var i = 0; i < array.length; i++) {
    if(array[i] === target) {
      return true;
    }
  }
  return false;
}

function creationMetrics(){
  var i,j,cr,de,ce = grid.length; //j = junctions, cr = crossroads, de = deadends
  //3 paredes derrubadas = junction
  for(i=0, j=0, cr=0, de=0;i<ce;i++){
    if(_.isEqual(grid[i].walls,[true,false,false,false]) || _.isEqual(grid[i].walls,[false,true,false,false]) || _.isEqual(grid[i].walls,[false,false,true,false]) || _.isEqual(grid[i].walls,[false,false,false,true])){
      j++;
    }else if(_.isEqual(grid[i].walls,[false,false,false,false])){ //4 paredes derrubadas = crossroad
      cr++;
      //3 paredes levantadas = deadend
    }else if(_.isEqual(grid[i].walls,[true,true,true,false]) || _.isEqual(grid[i].walls,[true,true,false,true]) || _.isEqual(grid[i].walls,[true,false,true,true]) || _.isEqual(grid[i].walls,[false,true,true,true])){
      de++;
    }
  }
  //retorna porcentagem
  var xd = j/ce+";"+cr/ce+";"+de/ce+"\n";
  return xd;
}

function singleSolvingMetrics(){
  var i,s = caminho.length,v,ce = grid.length; //s = tamanho da solução (caminho), v = vizinhos visitados
  for (i=0,v=0;i<grid.length;i++){
    if(grid[i].visitedSolve){
      v++;
      grid[i].visitedSolve = false;
    }
  }
  var xd = s+";"+v/ce;
  return xd; //tamanho da solução e porcentagem de vizinhos percorridos
}

function completeSolvingMetrics(){
  var stringSolve = "";
  noLoop();
  current = grid[0];
  status = "solve";
  solveAlg = "AStar";
  fts = true;
  caminho = [];
  draw();
  stringSolve +=singleSolvingMetrics();
  current = grid[0];
  solveAlg = "BFS";
  fts = true;
  caminho = [];
  draw();
  stringSolve +=";"+singleSolvingMetrics();
  current = grid[0];
  solveAlg = "GBFirst";
  fts = true;
  caminho = [];
  draw();
  stringSolve +=";"+singleSolvingMetrics()+"\n";
  return stringSolve;
}

//retorna o index do grid (1-dimensional array)
function index(i, j) {
  if(i<0 || j<0 || i>cols-1 || j>rows-1) {
    return -1;
  }
  return i+(j*cols);
}

function removeWalls(a, b) {
  var x = a.i - b.i;
  var y = a.j - b.j;
  //tira parede esquerda de A, direita de b
  if (x===1) {
    a.walls[3] = false;
    b.walls[1] = false;
  }else if(x===-1) {  //tira parede direita de a, esq. de b
    a.walls[1] = false;
    b.walls[3] = false;
  }

  if (y===1) {  //tira parede cima de A, baixo de b
    a.walls[0] = false;
    b.walls[2] = false;
  }else if(y===-1) { //tira parede baixo de A, cima de B
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

function doGBFirst(inicio,fim){
  fim.highlight();
  var openSet = [inicio];
  var closedSet = [];
  inicio.aStarHValue = HUEristic(inicio,fim);
  inicio.aStarFValue = HUEristic(inicio,fim);
  while (openSet.length>0){
    idxMenorOpenSetScore = menorhScore(openSet);
    inicio = openSet[idxMenorOpenSetScore];
    inicio.visitedSolve = true;
    //inicio.partOffrontier = true;
    if(inicio == fim){
      var way = recon_path(inicio);
      return way;
    }
    closedSet.push(inicio);
    openSet.splice(idxMenorOpenSetScore,1);
    var kinjins = inicio.retornaTodosVizinhos();
    for (i = 0; i<kinjins.length; i++) {
      if (inArray(kinjins[i],closedSet) || !isMovePossible(inicio,kinjins[i])){
        continue;
      }
      var hScore = inicio.aStarHValue;
      var hScoreIsBest = false;
      if(!inArray(kinjins[i],openSet)){
        hScoreIsBest = true;
        kinjins[i].aStarHValue = HUEristic(kinjins[i],fim);
        openSet.push(kinjins[i]);
      }
      else if(hScore < kinjins[i].aStarHValue) {
        hScoreIsBest = true;
      }
      if(hScoreIsBest) {
        kinjins[i].pai = inicio;
        kinjins[i].aStarHValue = hScore;
        kinjins[i].attFValueGBS();
      }
    }
  }
}

function AEstrela(inicio,fim) {
  var openSet = [inicio];
  var closedSet = [];
  inicio.aStarGValue = 0;
  inicio.aStarFValue = HUEristic(inicio,fim);
  while (openSet.length>0){
    idxMenorOpenSetScore = menorfScore(openSet);
    inicio = openSet[idxMenorOpenSetScore];
    inicio.visitedSolve = true;
    //inicio.partOffrontier = true;
    if(inicio == fim){
      return recon_path(inicio);
      //openSet = [];
    }
    closedSet.push(inicio);
    openSet.splice(idxMenorOpenSetScore,1);
    var vizinhos = inicio.retornaTodosVizinhos();
    for (var i = 0; i<vizinhos.length; i++) {
      if (inArray(vizinhos[i],closedSet) || !isMovePossible(inicio,vizinhos[i])){
        continue;
      }
      gScore = inicio.aStarGValue +1;
      var gScoreIsBest = false;
      if(!inArray(vizinhos[i],openSet)){
        gScoreIsBest = true;
        vizinhos[i].aStarHValue = HUEristic(vizinhos[i],fim);
        openSet.push(vizinhos[i]);
      }else if(gScore < vizinhos[i].aStarGValue) {
        gScoreIsBest = true;
      }
      if(gScoreIsBest) {
        vizinhos[i].pai = inicio;
        vizinhos[i].aStarGValue = gScore;
        vizinhos[i].attFValue();
      }
    }
  }
  return [];
}

function recon_path(currentNode) {
  var curr = currentNode;
  var path = [];
  while(curr.pai) {
    path.push(curr);
    curr = curr.pai;
  }
  return path.reverse();
}

function HUEristic(inicio,fim){ //euclidean,Manhatttan distance
  if(AStarHeuristic == "Euclidean"){
    return Math.sqrt((Math.pow((fim.i - inicio.i),2) + Math.pow((fim.j-inicio.j),2)));
  }else{
    return ((Math.sqrt(Math.pow((fim.i - inicio.i),2)) + Math.sqrt(Math.pow((fim.j-inicio.j),2))));
  }
}

function menorfScore(set){
  currentlow = Number.MAX_SAFE_INTEGER;
  var idx;
  for(var i=0;i<set.length;i++){
    if (set[i].aStarFValue<currentlow){
      currentlow = set.aStarFValue;
      idx = i;
    }
  }
  return idx;
}

function menorhScore(set){
  currentlow = Number.MAX_SAFE_INTEGER;
  var idx;
  for(var i=0;i<set.length;i++){
    if (set[i].aStarHValue<currentlow){
      currentlow = set.aStarHValue;
      idx = i;
    }
  }
  return idx;
}

function mostrarCaminho(caminho){
  for(i = 0; i<caminho.length; i++){
    caminho[i].highlightPath();
  }
}

function isMovePossible(a, b){
  var x = a.i - b.i;
  var y = a.j - b.j;

  if (x===1) {
    if(a.walls[3] === false && b.walls[1] === false){
      return true;
    }
  }else if(x===-1) {
    if(a.walls[1] === false && b.walls[3] === false) {
      return true;
    }
  }else if (y===1) {
    if(a.walls[0] === false && b.walls[2] === false){
      return true;
    }
  }else if(y===-1) { //tira parede baixo de A, cima de B
    if(a.walls[2] === false && b.walls[0] === false) {
      return true;
    }
  }else{
    return false;
  }
}

function disVisitdisFrontier(set){
  for(var i=0;i<set.length;i++){
    set[i].visitedSolve = false;
    set[i].partOffrontier = false;
  }
}
//courses.cs.washington.edu/courses/cse326/03su/homework/hw3/bfs.html
function doBFS(inicio,fim){
  var filinha = [inicio];
  fim.highlight();
  while(filinha.length>0){
    var c = filinha.pop();
    c.visitedSolve=true;
    if(c==fim){
      return recon_path(c);
    }else{
      var vizinhos = c.retornaTodosVizinhos();
      for (var i = 0; i<vizinhos.length; i++) {
        if (!vizinhos[i].visitedSolve && isMovePossible(c,vizinhos[i])){
          vizinhos[i].visitedSolve = true;
          vizinhos[i].pai = c;
          filinha.unshift(vizinhos[i]);
        }
      }
      c.partOffrontier = true; //examined
    }
  }
  return [];
}
