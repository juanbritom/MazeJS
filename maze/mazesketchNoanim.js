var cols, rows;
var w = 20; //tamanho da cell, wid*hei deve ser divisivel por w²
var wid = 600;
var hei = 600;
var totalcells = wid*hei/w/w;
//ajusta wid e hei para caber cells de tamanho w
while (totalcells%2){
  wid+=1;
  hei+=1;
  var totalcells = wid*hei/w/w;
}
var grid = [];
//muitas dessas variáveis poderiam não ser globais, porém
//seria perdida a possibilidade de animação step-by-step
var status = "create"; //create,solve
var createAlg = "DFS"; //Prim,DFS
var solveAlg = "AStar";
//para DFS
var current;
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
  if(status === "create") {
    if(createAlg=="DFS") {
      while(status == "create"){
        var next = current.checkNeighbors();
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
        var indiceRfc = floor(random(0,frontier.length));
        current = frontier[indiceRfc];  //random da frontier
        var randomIncell = current.randomInCell();
        stack.push(current); //comentar essa linha caso animação
        current.visited = true;
        current.partOffrontier = false;
        current.markNeighAsFrontier();
        removeWalls(current,randomIncell);
        frontier.splice(indiceRfc,1);
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
      }
    }
}
