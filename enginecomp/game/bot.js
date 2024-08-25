const W = 10, H = 8;

const EMPTY = 0;

const SILVER = 0b0000_0000;
const RED    = 0b1000_0000;

const OBELISK = 0b0001_0000;
const STACKED = 0b0010_0000;
const PYRAMID = 0b0011_0000;
const DJED    = 0b0100_0000;
const PHAROAH = 0b0101_0000;
const PIECE   = 0b0111_0000;

const R1 = 0b0000_0000;
const R2 = 0b0000_0100;
const R3 = 0b0000_1000;
const R4 = 0b0000_1100;
const RN = 0b0000_1100;

const TILESIZE = 64;
const TILEMARGIN = 4;
const PIECESIZE = TILESIZE - 2 * TILEMARGIN
const LASERWIDTH = 8;
const HALFWIDTH = LASERWIDTH / 2;

const NORTH   = 0;
const EAST    = 1;
const SOUTH   = 2;
const WEST    = 3;
const DESTROY = 4;

const TILELAYOUT = new Map([
  [SILVER | PHAROAH,      {x: 0, y: 0}],
  [SILVER | DJED    | R1, {x: 1, y: 0}],
  [SILVER | DJED    | R2, {x: 2, y: 0}],
  [SILVER | PYRAMID | R1, {x: 3, y: 0}],
  [SILVER | PYRAMID | R2, {x: 4, y: 0}],
  [SILVER | PYRAMID | R3, {x: 5, y: 0}],
  [SILVER | PYRAMID | R4, {x: 6, y: 0}],
  [SILVER | OBELISK,      {x: 7, y: 0}],
  [SILVER | STACKED,      {x: 0, y: 1}],
  [RED    | PHAROAH,      {x: 0, y: 2}],
  [RED    | DJED    | R1, {x: 1, y: 2}],
  [RED    | DJED    | R2, {x: 2, y: 2}],
  [RED    | PYRAMID | R1, {x: 3, y: 2}],
  [RED    | PYRAMID | R2, {x: 4, y: 2}],
  [RED    | PYRAMID | R3, {x: 5, y: 2}],
  [RED    | PYRAMID | R4, {x: 6, y: 2}],
  [RED    | OBELISK,      {x: 7, y: 2}],
  [RED    | STACKED,      {x: 0, y: 3}],
]);

const DJEDREFLECT = new Map([
  [R1, [WEST, SOUTH, EAST, NORTH]],
  [R2, [EAST, NORTH, WEST, SOUTH]],
]);

const PYRAMIDREFLECT = new Map([
  [R1, [DESTROY, DESTROY, EAST,    NORTH  ]],
  [R2, [EAST,    NORTH,   DESTROY, DESTROY]],
  [R3, [WEST,    SOUTH,   DESTROY, DESTROY]],
  [R4, [DESTROY, NORTH,   WEST,    DESTROY]]
])

let boardimg, tilesimg;
let canvas, ctx;
let board = new Uint8Array(W * H);
let turn = SILVER;

earlysetup();
window.onload = () => { setup(); setInterval(ply, 1000); }

function earlysetup() {
  boardimg = new Image();
  boardimg.src = "game/board.png";

  tilesimg = new Image();
  tilesimg.src = "game/tiles.png"
}

function setup() {
  canvas = document.getElementById("botboard");
  ctx = canvas.getContext("2d");
  boardsetup();
  drawboard();
  laser();
}

function ply() {
  if (turn === SILVER) turn = RED;
  else if (turn === RED) turn = SILVER;
}

function laser() {
  let x, y, direction;
  if (turn === SILVER) {
    x = W - 1;
    y = 0;
    direction = NORTH;
  } else if (turn === RED) {
    x = 0;
    y = H - 1;
    direction = SOUTH;
  }

  while (x >= 0 && x < W && y >= 0 && y < H) {
    let newdirection = direction, destroy = false;
    let piece = board[y * W + x];

    if ((piece & PIECE) === DJED) {
      newdirection = DJEDREFLECT.get(piece & RN)[direction];
    } else if ((piece & PIECE) === PYRAMID) {
      console.log("pyramid x="+x+", y="+y+", r="+(piece&RN)+", d="+direction)
      newdirection = PYRAMIDREFLECT.get(piece & RN)[direction];
      if (newdirection === DESTROY) destroy = true;
    }

    drawlaser(x, y, direction, newdirection, false);

    if (destroy) {
      break;
    }

    direction = newdirection;

    switch (direction) {
    case NORTH: y++; break;
    case EAST: x++; break;
    case SOUTH: y--; break;
    case WEST: x--; break;
    }
  }
}

function boardsetup() {
  board[0 * W + 2] = SILVER | PYRAMID | R4;
  board[0 * W + 3] = SILVER | STACKED;
  board[0 * W + 4] = SILVER | PHAROAH;
  board[0 * W + 5] = SILVER | STACKED;
  board[1 * W + 7] = SILVER | PYRAMID | R1;
  board[2 * W + 6] = RED    | PYRAMID | R2;
  board[3 * W + 0] = RED    | PYRAMID | R2;
  board[3 * W + 2] = SILVER | PYRAMID | R4;
  board[3 * W + 4] = SILVER | DJED    | R2;
  board[3 * W + 5] = SILVER | DJED    | R1;
  board[3 * W + 7] = RED    | PYRAMID | R1;
  board[3 * W + 9] = SILVER | PYRAMID | R3;
  board[4 * W + 0] = RED    | PYRAMID | R1;
  board[4 * W + 2] = SILVER | PYRAMID | R3;
  board[4 * W + 4] = RED    | DJED    | R1;
  board[4 * W + 5] = RED    | DJED    | R2;
  board[4 * W + 7] = RED    | PYRAMID | R2;
  board[4 * W + 9] = SILVER | PYRAMID | R4;
  board[5 * W + 3] = SILVER | PYRAMID | R4;
  board[6 * W + 2] = RED    | PYRAMID | R3;
  board[7 * W + 4] = RED    | STACKED;
  board[7 * W + 5] = RED    | PHAROAH;
  board[7 * W + 6] = RED    | STACKED;
  board[7 * W + 7] = RED    | PYRAMID | R2;
}

function drawboard() {
  ctx.drawImage(boardimg, 0, 0);
  for (let i = 0; i < W * H; i++) {
    drawpiece(
      board[i],
      i % W * TILESIZE + TILEMARGIN,
      (H - Math.floor(i / W) - 1) * TILESIZE + TILEMARGIN
    );
  }
}

function drawpiece(piece, x, y) {
  if (piece === EMPTY) return;

  let p = TILELAYOUT.get(piece);
  let sx = p.x * PIECESIZE, sy = p.y * PIECESIZE;
  ctx.drawImage(
    tilesimg,
    sx, sy, PIECESIZE, PIECESIZE,
    x, y, PIECESIZE, PIECESIZE
  );
}

function drawlaser(x, y, enter, exit, arrowhead) {
  ctx.fillStyle = "black";
  y = H - y - 1;

  drawlaserpart(x, y, enter, true);
  drawlaserconnection(x, y, enter, exit);
  drawlaserpart(x, y, exit, false);

  // TODO arrowhead
}

function drawlaserpart(x, y, direction, enter) {
  let partsize = TILESIZE / 2 - LASERWIDTH;

  // XXX some of these variables may assume TILEMARGIN = HALFWIDTH
  let vertx = (x + 0.5) * TILESIZE - HALFWIDTH;
  let eastx = x * TILESIZE;
  let westx = (x + 1) * TILESIZE - partsize;

  let horizy = (y + 0.5) * TILESIZE - HALFWIDTH;
  let northy = (y + 1) * TILESIZE - partsize;
  let southy = y * TILESIZE;

  let exitoffs = TILESIZE / 2 + LASERWIDTH;

  if (!enter) {
    eastx += exitoffs;
    westx -= exitoffs;
    southy += exitoffs;
    northy -= exitoffs;
  }

  switch (direction) {
  case NORTH:
    ctx.fillRect(vertx, northy, LASERWIDTH, partsize);
    break;
  case EAST:
    ctx.fillRect(eastx, horizy, partsize, LASERWIDTH);
    break;
  case SOUTH:
    ctx.fillRect(vertx, southy, LASERWIDTH, partsize);
    break;
  case WEST:
    ctx.fillRect(westx, horizy, partsize, LASERWIDTH);
    break;
  }
}

function drawlaserconnection(x, y, enter, exit) {
  if (enter === exit && (enter === NORTH || enter === SOUTH)) {
    ctx.fillRect(
      (x + 0.5) * TILESIZE - HALFWIDTH,
      (y + 0.5) * TILESIZE - LASERWIDTH,
      LASERWIDTH,
      LASERWIDTH * 2
    )
  } else if (enter === exit && (enter === EAST || enter === WEST)) {
    ctx.fillRect(
      (x + 0.5) * TILESIZE - LASERWIDTH,
      (y + 0.5) * TILESIZE - HALFWIDTH,
      LASERWIDTH * 2,
      LASERWIDTH
    )
  }
}
