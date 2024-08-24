const W = 10, H = 8;

const EMPTY = 0;

const SILVER = 0b0000_0000;
const RED =    0b1000_0000;

const OBELISK = 0b0000_0000;
const STACKED = 0b0001_0000;
const PYRAMID = 0b0010_0000;
const DJED    = 0b0011_0000;
const PHAROAH = 0b0100_0000;

const R1 = 0b0000_0000;
const R2 = 0b0000_0100;
const R3 = 0b0000_1000;
const R4 = 0b0000_1100;

let boardimg, tilesimg;
let canvas, ctx;
let board = new Uint8Array(W * H);

earlysetup();
window.onload = () => { setup(); setInterval(ply, 1000); }

function ply() {
  console.log("ply");
}

function boardsetup() {
  set(3, 1, SILVER | PYRAMID | R4);
  set(4, 1, SILVER | STACKED);
  set(5, 1, SILVER | PHAROAH);
  set(6, 1, SILVER | STACKED);
}

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

function ispiece(x, piece) {
  return x & piece == piece;
}

function set(file, rank, piece) {
  board[file - 1][rank - 1] = piece;
}

function get(file, rank) {
  return board[file - 1][rank - 1];
}
