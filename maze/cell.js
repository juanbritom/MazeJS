function Cell(i, j) {
  this.i = i;
  this.j = j;   //t,r,b,l
  this.walls = [true,true,true,true];
  this.aStarGValue = Number.MAX_SAFE_INTEGER-1;
  this.aStarHValue = Number.MAX_SAFE_INTEGER-1;
  this.aStarFValue = Number.MAX_SAFE_INTEGER-1;
  this.visited = false;
  this.partOffrontier = false;
  this.pai = undefined;
  this.visitedSolve = false;

  this.attFValue = function () {
    this.aStarFValue = this.aStarHValue + this.aStarGValue;
  };

  this.checkNeighbors = function() {
    var neighbors = [];
    var candidates = [];

    //top,right,bottom,left
    if(index(i    , j-1)>=0) {
      candidates.push(grid[index(i    , j-1)]);
    }
    if(index(i+1  , j)>=0) {
      candidates.push(grid[index(i+1  , j)]);
    }
    if(index(i    , j+1)>=0) {
      candidates.push(grid[index(i    , j+1)]);
    }
    if(index(i-1  , j)>=0) {
      candidates.push(grid[index(i-1  , j)]);
    }
    for (var k = 0; k< candidates.length; k++) {
      if (!candidates[k].visited) {
        neighbors.push(candidates[k]);
      }
    }

    if (neighbors.length > 0) {
      var r = floor(random((0, neighbors.length)));
      return neighbors[r];
    }else{
      return undefined;
    }
  };

  this.markNeighAsFrontier = function() {
    var candidates = [];

    //top,right,bottom,left
    if(index(i    , j-1)>=0) {
      candidates.push(grid[index(i    , j-1)]);
    }
    if(index(i+1  , j)>=0) {
      candidates.push(grid[index(i+1  , j)]);
    }
    if(index(i    , j+1)>=0) {
      candidates.push(grid[index(i    , j+1)]);
    }
    if(index(i-1  , j)>=0) {
      candidates.push(grid[index(i-1  , j)]);
    }
    for (var k = 0; k< candidates.length; k++) {
      if (!candidates[k].visited&&!(inArray(candidates[k],frontier))) {
        candidates[k].partOffrontier = true;
        frontier.push(candidates[k]);
      }
    }
  };

  this.retornaTodosVizinhos = function() {
    var candidates = [];

    //top,right,bottom,left
    if(index(i    , j-1)>=0) {
      candidates.push(grid[index(i    , j-1)]);
    }
    if(index(i+1  , j)>=0) {
      candidates.push(grid[index(i+1  , j)]);
    }
    if(index(i    , j+1)>=0) {
      candidates.push(grid[index(i    , j+1)]);
    }
    if(index(i-1  , j)>=0) {
      candidates.push(grid[index(i-1  , j)]);
    }
    return candidates;
  };

  this.randomInCell = function() {
    var neighbors = [];
    var candidates = [];

    //top,right,bottom,left
    if(index(i    , j-1)>=0) {
      candidates.push(grid[index(i    , j-1)]);
    }
    if(index(i+1  , j)>=0) {
      candidates.push(grid[index(i+1  , j)]);
    }
    if(index(i    , j+1)>=0) {
      candidates.push(grid[index(i    , j+1)]);
    }
    if(index(i-1  , j)>=0) {
      candidates.push(grid[index(i-1  , j)]);
    }
    for (var k = 0; k< candidates.length; k++) {
      if (candidates[k].visited) {
        neighbors.push(candidates[k]);
      }
    }

    if (neighbors.length > 0) {
      var r = floor(random((0, neighbors.length)));
      return neighbors[r];
    }else{
      return undefined;
    }
  };

  this.show = function() {
    var x = this.i*w;
    var y = this.j*w;
    stroke(255);
    //de x, de y até esse x e esse y
    if (this.walls[0]) {
      line(x      ,y      ,x+w        ,y);        //topwall
    }
    if (this.walls[2]) {
      line(x      ,y+w    ,x+w        ,y+w);      //botwall
    }
    if (this.walls[3]) {
      line(x      ,y      ,x          ,y+w);      //leftwall
    }
    if (this.walls[1]) {
      line(x+w    ,y      ,x+w        ,y+w);      //rightwall
    }

    if(this.visited) {
      noStroke();
      fill(0,140,40,100);
      rect(x,y,w,w);
    }
    if(this.partOffrontier){
      noStroke();
      fill(200,0,0,100);
      rect(x,y,w,w);
    }
  };

  this.highlight = function() {
    var x = this.i*w;
    var y = this.j*w;
    noStroke();
    fill(0,0,100,100);
    rect(x+1,y+1,w-1,w-1);
  };

  this.highlightPossible = function() {
    var x = this.i*w;
    var y = this.j*w;
    noStroke();
    fill(0,0,0,200);
    rect(x+1,y+1,w-1,w-1);
  };

  this.highlightPath = function() {
    var x = this.i*w;
    var y = this.j*w;
    tam = floor(w/1.75);
    pos = [(x+w/2),(y+w/2)];
    noStroke();
    fill(0,0,30,150);
    ellipse(pos[0],pos[1],tam,tam);
  };
}
