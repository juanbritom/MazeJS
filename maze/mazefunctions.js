//funcoes diversas xd
function createCells() {
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

function AEstrela(inicio,fim) {
  var openSet = [inicio];
  var closedSet = [];
  inicio.aStarGValue = 0;
  inicio.aStarFValue = HUEristic(inicio,fim);
  while (openSet.length>0){
    idxMenorOpenSetScore = menorfScore(openSet);
    inicio = openSet[idxMenorOpenSetScore];
    if(inicio == fim){
      return recon_path(inicio);
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

function HUEristic(inicio,fim){ //euclidean distance
  return Math.sqrt((Math.pow((fim.i - inicio.i),2) + Math.pow((fim.j-inicio.j),2)));
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
