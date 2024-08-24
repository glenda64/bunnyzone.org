window.onload = () => { setup(); setInterval(tick, 150) }

let canvas, ctx, id, grid, grid2, w, h, t;
let density = 0.2;

function randomize() {
  t = 0;
  grid = new Uint8Array(w * h);
  grid2 = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    grid[i] = Math.random() < density ? 1 : 0;
    grid2[i] = 0;
  }
}

function setup() {
  canvas = document.getElementById("life");
  w = canvas.width * 3;
  h = canvas.height;
  ctx = canvas.getContext("2d");
  id = new ImageData(canvas.width, canvas.height);
  randomize();
}

function step() {
  for (let i = 0; i < w * h; i++) {
    let n = 0;
    let x = i % w, y = Math.floor(i / w);

    let ax = x - 1, zx = x + 1;
    if (x <= 0) ax = w - 1;
    else if (x >= w - 1) zx = 0;

    let ay = y - 1, zy = y + 1;
    if (y <= 0) ay = h - 1;
    else if (y >= h - 1) zy = 0;

    n += grid[ay * w + ax];
    n += grid[ay * w +  x];
    n += grid[ay * w + zx];
    n += grid[ y * w + ax];
    n += grid[ y * w + zx];
    n += grid[zy * w + ax];
    n += grid[zy * w +  x];
    n += grid[zy * w + zx];

    if (n == 3) grid2[i] = 1;
    else if (n == 2) grid2[i] = grid[i];
    else grid2[i] = 0;
  }

  for (let i = 0; i < w * h; i++) {
    grid[i] = grid2[i];
  }
}

function tick() {
  for (let i = 0; i < w * h; i += 3) {
    let j = Math.floor(i / 3) * 4;
    id.data[j + 0] = (1 - grid[i    ]) * 255;
    id.data[j + 1] = (1 - grid[i + 1]) * 255;
    id.data[j + 2] = (1 - grid[i + 2]) * 255;
    id.data[j + 3] = 255;
  }

  ctx.putImageData(id, 0, 0);

  t++;
  if (t >= 256) randomize();
  else step();
}
