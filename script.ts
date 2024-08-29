class Cell {
  state: CellState;
  constructor(s: CellState) {
    this.state = s;
  }
  isAlive() {
    return this.state === 1;
  }
  toggle() {
    this.state = 1 - this.state;
  }
}

const GRID_ROWS = 50;
const GRID_COLS = 50;
const PERIOD_DURATION = 100;
let isGamePlaying = false;
let globalGameState: GameState = [];

enum CellState {
  "alive",
  "dead",
}

type GameState = Array<Array<Cell>>;

function drawActiveCells(ctx: CanvasRenderingContext2D) {
  for (let y = 0; y < GRID_ROWS; ++y) {
    for (let x = 0; x < GRID_COLS; ++x) {
      const item = globalGameState[y][x];
      renderCell(ctx, item, x, y);
    }
  }
}

function initGridEventHandler(ctx: CanvasRenderingContext2D) {
  ctx.canvas.addEventListener("click", (e) => {
    const x = Math.floor((e.offsetX / ctx.canvas.width) * GRID_COLS);
    const y = Math.floor((e.offsetY / ctx.canvas.height) * GRID_COLS);
    globalGameState[y][x].toggle();
    renderCell(ctx, globalGameState[y][x], x, y);
  });
}

function initEmptyGrid(ctx: CanvasRenderingContext2D) {
  ctx.reset();
  ctx.scale(ctx.canvas.width / GRID_COLS, ctx.canvas.height / GRID_ROWS);

  drawCanvasGrid(ctx);
}

function renderScene(ctx: CanvasRenderingContext2D) {
  ctx.reset();
  ctx.scale(ctx.canvas.width / GRID_COLS, ctx.canvas.height / GRID_ROWS);

  drawCanvasGrid(ctx);
  drawActiveCells(ctx);
}

function clearRect(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.clearRect(x + 0.05, y + 0.05, 0.9, 0.9);
}
function renderCell(
  ctx: CanvasRenderingContext2D,
  cell: Cell,
  x: number,
  y: number,
): void {
  if (!cell.isAlive()) {
    clearRect(ctx, x, y);
    return;
  }
  ctx.fillStyle = "black";
  ctx.fillRect(x + 0.05, y + 0.05, 0.9, 0.9);
}

function drawCanvasGrid(ctx: CanvasRenderingContext2D): void {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.1;
  for (let x = 0; x <= GRID_COLS; ++x) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, GRID_COLS);
    ctx.stroke();
  }
  for (let y = 0; y <= GRID_ROWS; ++y) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(GRID_ROWS, y);
    ctx.stroke();
  }
}

function initBlock(state: GameState, x: number, y: number): void {
  state[y][x] = new Cell(1);
  state[y][x + 1] = new Cell(1);
  state[y + 1][x] = new Cell(1);
  state[y + 1][x + 1] = new Cell(1);
}

function initGlider(state: GameState, x: number, y: number): void {
  state[y][x + 1] = new Cell(1);
  state[y + 1][x + 2] = new Cell(1);
  state[y + 2][x] = new Cell(1);
  state[y + 2][x + 1] = new Cell(1);
  state[y + 2][x + 2] = new Cell(1);
}

function initGosperGlider(state: GameState, x: number, y: number): void {
  // First block (upper left)
  state[y][x + 24] = new Cell(1);

  // Second block
  state[y + 1][x + 22] = new Cell(1);
  state[y + 1][x + 24] = new Cell(1);

  // Third block
  state[y + 2][x + 12] = new Cell(1);
  state[y + 2][x + 13] = new Cell(1);
  state[y + 2][x + 20] = new Cell(1);
  state[y + 2][x + 21] = new Cell(1);
  state[y + 2][x + 34] = new Cell(1);
  state[y + 2][x + 35] = new Cell(1);

  // Fourth block
  state[y + 3][x + 11] = new Cell(1);
  state[y + 3][x + 15] = new Cell(1);
  state[y + 3][x + 20] = new Cell(1);
  state[y + 3][x + 21] = new Cell(1);
  state[y + 3][x + 34] = new Cell(1);
  state[y + 3][x + 35] = new Cell(1);

  // Fifth block
  state[y + 4][x + 0] = new Cell(1);
  state[y + 4][x + 1] = new Cell(1);
  state[y + 4][x + 10] = new Cell(1);
  state[y + 4][x + 16] = new Cell(1);
  state[y + 4][x + 20] = new Cell(1);
  state[y + 4][x + 21] = new Cell(1);

  // Sixth block
  state[y + 5][x + 0] = new Cell(1);
  state[y + 5][x + 1] = new Cell(1);
  state[y + 5][x + 10] = new Cell(1);
  state[y + 5][x + 14] = new Cell(1);
  state[y + 5][x + 16] = new Cell(1);
  state[y + 5][x + 17] = new Cell(1);
  state[y + 5][x + 22] = new Cell(1);
  state[y + 5][x + 24] = new Cell(1);

  // Seventh block
  state[y + 6][x + 10] = new Cell(1);
  state[y + 6][x + 16] = new Cell(1);
  state[y + 6][x + 24] = new Cell(1);

  // Eighth block
  state[y + 7][x + 11] = new Cell(1);
  state[y + 7][x + 15] = new Cell(1);

  // Ninth block
  state[y + 8][x + 12] = new Cell(1);
  state[y + 8][x + 13] = new Cell(1);
}

function initGameOfLife(): GameState {
  const result: GameState = zeroInitGameState();

  // initBlock(result, 4, 4);
  // initGlider(result, 7, 8);
  initGosperGlider(result, 5, 5);

  return result;
}

function sleep(ms: number = 1000): Promise<void> {
  return new Promise((res) => {
    setTimeout(res, ms);
  });
}

function isXOutOfBound(x: number): boolean {
  return x < 0 || x >= GRID_COLS;
}

function isYOutOfBound(y: number): boolean {
  return y < 0 || y >= GRID_ROWS;
}

function getNextCellState(x: number, y: number): Cell {
  let count = 0;

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    if (isXOutOfBound(nx) || isYOutOfBound(ny)) continue;
    const n = globalGameState[ny][nx];
    if (n.isAlive()) count++;
  }

  if (globalGameState[y][x].isAlive()) {
    return [2, 3].includes(count) ? new Cell(1) : new Cell(0);
  } else {
    return [3].includes(count) ? new Cell(1) : new Cell(0);
  }
}

function zeroInitGameState(): GameState {
  const result: GameState = [];
  for (let y = 0; y < GRID_ROWS; ++y) {
    const row: Cell[] = [];
    for (let x = 0; x < GRID_COLS; ++x) {
      row.push(new Cell(0));
    }
    result.push(row);
  }
  return result;
}

function getNextState(): GameState {
  const result: GameState = zeroInitGameState();
  for (let y = 0; y < GRID_ROWS; ++y) {
    for (let x = 0; x < GRID_COLS; ++x) {
      result[y][x] = getNextCellState(x, y);
    }
  }
  return result;
}

window.addEventListener("keyup", async (e: KeyboardEvent) => {
  if (e.key !== " ") return;
  isGamePlaying = !isGamePlaying;
  const canvas: HTMLCanvasElement | null = document.querySelector("canvas");
  if (canvas === null) {
    throw new Error("No canvas found in document");
  }

  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
  if (ctx === null) {
    throw new Error(
      "2D Rendering context not supported by your browser - kekw",
    );
  }

  while (isGamePlaying) {
    await sleep(PERIOD_DURATION);
    globalGameState = getNextState();
    renderScene(ctx);
  }
});

(async () => {
  const canvas: HTMLCanvasElement | null = document.querySelector("canvas");
  if (canvas === null) {
    throw new Error("No canvas found in document");
  }

  const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
  if (ctx === null) {
    throw new Error(
      "2D Rendering context not supported by your browser - kekw",
    );
  }

  globalGameState = initGameOfLife();
  initGridEventHandler(ctx);
  renderScene(ctx);
})();
