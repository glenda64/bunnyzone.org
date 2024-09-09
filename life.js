window.onload = () => { setup(); tick(); setInterval(tick, 250); }

let canvas, ctx, id, grid, grid2, w, h, t;
const density = 0.2;
const on = {r: 0x00, g: 0x88, b: 0x00};
const off = {r: 0xee, g: 0xff, b: 0xee};

function randomize() {
  t = 0;
  grid = new Uint8Array(w*h);
  grid2 = new Uint8Array(w*h);
  for (let i = 0; i < w*h; i++) {
    grid[i] = Math.random() < density ? 1 : 0;
    grid2[i] = 0;
  }
}

function setup() {
  canvas = document.getElementById("life");
  w = canvas.width;
  h = canvas.height;
  ctx = canvas.getContext("2d");
  id = new ImageData(canvas.width, canvas.height);
  randomize();
}

function step() {
  for (let i = 0; i < w*h; i++) {
    let n = 0;
    let x = i%w, y = Math.floor(i / w);

    let ax = x-1, zx = x+1;
    if (x <= 0) ax = w-1;
    else if (x >= w-1) zx = 0;

    let ay = y-1, zy = y+1;
    if (y <= 0) ay = h-1;
    else if (y >= h-1) zy = 0;

    n += grid[ay*w + ax];
    n += grid[ay*w +  x];
    n += grid[ay*w + zx];
    n += grid[ y*w + ax];
    n += grid[ y*w + zx];
    n += grid[zy*w + ax];
    n += grid[zy*w +  x];
    n += grid[zy*w + zx];

    if (n == 3) grid2[i] = 1;
    else if (n == 2) grid2[i] = grid[i];
    else grid2[i] = 0;
  }

  for (let i = 0; i < w*h; i++) {
    grid[i] = grid2[i];
  }
}

function tick() {
  for (let i = 0; i < w*h; i++) {
    id.data[i*4    ] = grid[i] == 1 ? on.r : off.r;
    id.data[i*4 + 1] = grid[i] == 1 ? on.g : off.g;
    id.data[i*4 + 2] = grid[i] == 1 ? on.b : off.b;
    id.data[i*4 + 3] = 255;
  }

  ctx.putImageData(id, 0, 0);

  t++;
  if (t >= 256) randomize();
  else step();
}
