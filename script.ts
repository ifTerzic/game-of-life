const GRID_ROWS = 20;
const GRID_COLS = 20;

enum CellState {
  "alive",
  "dead",
}

enum Direction {
  "top",
  "right",
  "bottom",
  "left",
}

class Canon {
  direction: Direction;
  constructor(d: Direction, x: number: y: number) {
    this.direction = d;
  }

  shoot() {}
}

class Cell {
  state: CellState;
  constructor(s: CellState) {
    this.state = s;
  }

  isAlive() {
    return this.state === 1;
  }
}

type GameState = Array<Array<Cell>>;

function drawActiveCells(ctx: CanvasRenderingContext2D, state: GameState) {
  for (let y = 0; y < GRID_ROWS; ++y) {
    for (let x = 0; x < GRID_COLS; ++x) {
      renderCell(ctx, state[y][x], x, y);
    }
  }
}

function renderScene(ctx: CanvasRenderingContext2D, state: GameState) {
  ctx.reset();
  ctx.scale(ctx.canvas.width / GRID_COLS, ctx.canvas.height / GRID_ROWS);

  drawCanvasGrid(ctx);
  drawActiveCells(ctx, state);
}

function renderCell(
  ctx: CanvasRenderingContext2D,
  cell: Cell,
  x: number,
  y: number,
): void {
  if (!cell.isAlive()) return;
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

function initGameOfLife(): GameState {
  const result: GameState = zeroInitGameState();

  result[6][2] = new Cell(1);
  result[6][3] = new Cell(1);
  result[7][2] = new Cell(1);
  result[7][3] = new Cell(1);
  // result[10][8] = new Canon("");
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

function getNextCellState(state: GameState, x: number, y: number): Cell {
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
    const n = state[ny][nx];
    if (n.isAlive()) count++;
  }

  return [2, 3].includes(count) ? new Cell(1) : new Cell(0);
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

function getNextState(state: GameState): GameState {
  const result: GameState = zeroInitGameState();
  for (let y = 0; y < GRID_ROWS; ++y) {
    for (let x = 0; x < GRID_COLS; ++x) {
      result[y][x] = getNextCellState(state, x, y);
    }
  }
  return result;
}

window.addEventListener("keypress", async () => {
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

  let state: GameState = initGameOfLife();

  renderScene(ctx, state);

  for (;;) {
    await sleep(1000);
    state = getNextState(state);
    renderScene(ctx, state);
  }
});

(async () => {})();
