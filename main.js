const size = 20;
const extra_w = 100;
const extra_h = 0;
let grid = Array();
let piece = new Piece();
let tetris_w, tetris_h;
let speed = 10; // speed decreases
let destroyed = 0;
let pause = false;

const pieces = [[[0, size], [0, 0], [0, size*2], [size, size*2], [239, 170, 10]],
              [[size, size], [size, 0], [size, size*2], [0, size*2], [22, 32, 221]],
            [[0, 0], [-size, 0], [size, 0], [0, size], [239, 10, 219]],
          [[0, size], [-size, 0], [0, 0], [size, size], [255,0,0]],
          [[0, size], [-size, size], [0, 0], [size, 0], [0,255,0]],
        [[0, 0],[size, 0], [0, size], [size, size], [239, 235, 11]],
      [[0,-size], [0, 0], [0, size], [0, size * 2], [35, 206, 237]]];

function setup() {
  createCanvas(300, 400);

  tetris_w = width - extra_w;
  tetris_h = height - extra_h;
  piece.secondP = piece.newPiece();
  piece.setup();
}

function draw() {
  if(pause) return;
  background(0);
  stroke(255);
  line(tetris_w + 1, 0, tetris_w + 1, height);
  stroke(0);
  piece.draw();
  grid.forEach(elem =>{
    fill(elem.color);
    rect(elem.x, elem.y, size, size)}
  );
  if(destroyed % 6 === 5){
    speed--;
    destroyed = 0;
  }
}

function Block(x,y, color){
  this.x = x;
  this.y = y;
  this.color = color;

  this.check = function(yv, xv){
    if(this.y + yv === tetris_h ||(this.x + xv < 0 ||  this.x + xv >= tetris_w))
      return false;
    for(let i = 0; i < grid.length; i++){
      if(this.x === grid[i].x - xv && this.y === grid[i].y - yv) return false;
    }return true;
  }
}

function Piece(){
  this.arr = this.secondP = Array();
  this.numb, this.lastnumb;
  this.counter = -1;
  this.yv = this.xv = 0

  this.setup = function(){
    this.arr = this.secondP;
    this.secondP = this.newPiece();

    if(!this.check(0, 0)) noLoop();
  }
  this.draw = function(){
    if(this.yv === 0) this.yv = this.counter % speed === speed - 1 ? size : 0;
    if(this.yv !== 0){
      this.counter = -1;
      let c = Array();
      for(let elem of this.arr){
        if(!elem.check(this.yv, 0)){
          this.arr.forEach(elem =>{
            grid.push(elem);
            if(grid.filter(x => x.y === elem.y).length === tetris_w / size)
              c.push(elem);
          });
          destroyed += c.length;
          for(let i = 0; i < c.length; i++){
            grid = grid.filter(x => x.y !== c[i].y);
            grid.forEach(x => {
              if(x.y < c[i].y) x.y += size;
            })
          }
          this.setup();
          break;
        }
      }
    }
    fill(this.secondP[0].color);
    for(let elem of this.secondP){
      rect(elem.x + tetris_w / 2 + extra_w/2 - size, elem.y + size, size, size);
    }
    for(let elem of this.arr){
      elem.y += this.yv;
      elem.x += this.xv;
      fill(elem.color);
      rect(elem.x, elem.y, size, size);
    }
    this.counter ++;
    this.xv = this.yv = 0;
  }
  this.newPiece = function(){
    let ayy = Array();
    this.numb = this.lastnumb;
    this.lastnumb = 3;
    let a = floor(random(0, 6.99));
    if(a === 5) this.lastnumb = 2;
    else if(a === 6) this.lastnumb = 4;
    for(let i = 0; i < 4; i++){
      ayy.push(new Block(tetris_w / 2 + pieces[a][i][0], pieces[a][i][1],
                    color(pieces[a][4][0], pieces[a][4][1], pieces[a][4][2])));
    }
    return ayy;
  }
  this.check = function(delta){
     for(let i = 0; i < this.arr.length; i++){
       if(!this.arr[i].check(0, delta)) return false;
     }
     this.xv = delta;
     return true;
  }
  this.down = function(){
    let p;
    let maxY = 0;

    for(let elem of this.arr){
       if(elem.y > maxY) maxY = elem.y;
    }
    for(let i = 1; i < tetris_h / size + size; i++){
      p = true;
      for(let j = 0; j < 4; j++){
        if(!this.arr[j].check(-maxY + this.arr[j].y + i * size - this.arr[j].y, 0))
          p = false;
      }
      if(!p){
        this.arr.forEach(elem => elem.y = -(maxY - elem.y - (i-1) * size));
        return;
      }
    }
  }
  this.rotate = function(){
    if(this.numb === 2) return;
    let a = new Piece();
    let c = this.arr[0].color;
    if(this.numb === 4){
      if(this.arr[0].x === this.arr[1].x){ // this is way too much #FIX
        if(this.arr[0].y < this.arr[1].y){
          a.arr.push(new Block(this.arr[0].x + size * 2, this.arr[0].y + size * 2,c));
          a.arr.push(new Block(this.arr[1].x + size, this.arr[1].y + size,c));
          a.arr.push(new Block(this.arr[2].x, this.arr[2].y,c));
          a.arr.push(new Block(this.arr[3].x - size, this.arr[3].y - size,c));
        }else{
          a.arr.push(new Block(this.arr[0].x - size * 2, this.arr[0].y - size * 2,c));
          a.arr.push(new Block(this.arr[1].x - size, this.arr[1].y - size,c));
          a.arr.push(new Block(this.arr[2].x, this.arr[2].y,c));
          a.arr.push(new Block(this.arr[3].x + size, this.arr[3].y + size,c));
        }
      }else{
        if(this.arr[0].x < this.arr[1].x){
          a.arr.push(new Block(this.arr[0].x + size * 2, this.arr[0].y - size,c));
          a.arr.push(new Block(this.arr[1].x + size, this.arr[1].y,c));
          a.arr.push(new Block(this.arr[2].x, this.arr[2].y + size,c));
          a.arr.push(new Block(this.arr[3].x - size, this.arr[3].y + size * 2,c));
        }else{
          a.arr.push(new Block(this.arr[0].x - size * 2, this.arr[0].y + size,c));
          a.arr.push(new Block(this.arr[1].x - size, this.arr[1].y,c));
          a.arr.push(new Block(this.arr[2].x, this.arr[2].y - size,c));
          a.arr.push(new Block(this.arr[3].x + size, this.arr[3].y - size * 2,c));
        }
      }
    }else if(this.numb === 3){
      a.arr.push(this.arr[0]);
      for(let i = 1; i < this.arr.length; i++){
        if(this.arr[i].x === this.arr[0].x){
          a.arr.push(new Block(this.arr[i].x + this.arr[i].y - this.arr[0].y,
                this.arr[0].y,c));
        }else if(this.arr[i].y === this.arr[0].y){
          a.arr.push(new Block(this.arr[0].x,
             this.arr[i].y + this.arr[0].x - this.arr[i].x,c));
        }
        else{
          a.arr.push(new Block(
            this.arr[i].x > this.arr[0].x && this.arr[i].y < this.arr[0].y
              ? this.arr[0].x - size
              : this.arr[i].x < this.arr[0].x && this.arr[i].y > this.arr[0].y
              ? this.arr[0].x + size : this.arr[i].x,
            this.arr[i].y > this.arr[0].y && this.arr[i].x > this.arr[0].x
              ? this.arr[0].y - size
              : this.arr[i].y < this.arr[0].y && this.arr[i].x < this.arr[0].x
              ? this.arr[0].y + size : this.arr[i].y,c));
        }
      }
    }
    for(let elem of a.arr){
      if(!elem.check(0, 0)) return;
    }this.arr = a.arr;
  }
}


function keyPressed(){
  if(keyCode === 37){
      piece.check(-size);
  }else if(keyCode === 39){
      piece.check(size);
  }else if(keyCode === 38){
    piece.rotate();
  }else if(keyCode === 40){
    piece.down();
    piece.draw();
  }else if(keyCode === 80){
    pause =  pause ? false : true;
  }
}
