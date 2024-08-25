const W = 10, H = 8;

const EMPTY = 0;

const SILVER = 0b0000_0000;
const RED =    0b1000_0000;

const OBELISK = 0b0001_0000;
const STACKED = 0b0010_0000;
const PYRAMID = 0b0011_0000;
const DJED    = 0b0100_0000;
const PHAROAH = 0b0101_0000;

const R1 = 0b0000_0000;
const R2 = 0b0000_0100;
const R3 = 0b0000_1000;
const R4 = 0b0000_1100;

const TILESIZE = 64;
const TILEMARGIN = 4;
const PIECESIZE = TILESIZE - 2 * TILEMARGIN

const TILELAYOUT = new Map([
  [SILVER | PHAROAH, {x: 0, y: 0}],
  [SILVER | DJED | R1, {x: 1, y: 0}],
  [SILVER | DJED | R2, {x: 2, y: 0}],
  [SILVER | PYRAMID | R1, {x: 3, y: 0}],
  [SILVER | PYRAMID | R2, {x: 4, y: 0}],
  [SILVER | PYRAMID | R3, {x: 5, y: 0}],
  [SILVER | PYRAMID | R4, {x: 6, y: 0}],
  [SILVER | OBELISK, {x: 7, y: 0}],
  [SILVER | STACKED, {x: 0, y: 1}]
]);

let boardimg, tilesimg;
let canvas, ctx;
let board = new Uint8Array(W * H);

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
}

function ply() {
  console.log("ply");
  drawboard();
}

function boardsetup() {
  board[0 * W + 2] = SILVER | PYRAMID | R4;
  // TODO
}

function drawboard() {
  ctx.drawImage(boardimg, 0, 0);
  for (let i = 0; i < W * H; i++) {
    drawpiece(
      board[i],
      0,0
      //i % W * TILESIZE + TILEMARGIN,
      //(H - Math.floor(i / W)) * TILESIZE + TILEMARGIN
    );
  }
}

function drawpiece(piece, x, y) {
  if (piece == EMPTY) return;

  let p = TILELAYOUT.get(piece);
  let sx = p.x * PIECESIZE, sy = p.y * PIECESIZE;
  ctx.drawImage(
    tilesimg,
    sx, sy, PIECESIZE, PIECESIZE,
    x, y, PIECESIZE, PIECESIZE
  );
}

function ispiece(x, piece) {
  return x & piece == piece;
}
