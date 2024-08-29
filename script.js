"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Cell {
    constructor(s) {
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
let globalGameState = [];
var CellState;
(function (CellState) {
    CellState[CellState["alive"] = 0] = "alive";
    CellState[CellState["dead"] = 1] = "dead";
})(CellState || (CellState = {}));
function drawActiveCells(ctx) {
    for (let y = 0; y < GRID_ROWS; ++y) {
        for (let x = 0; x < GRID_COLS; ++x) {
            const item = globalGameState[y][x];
            renderCell(ctx, item, x, y);
        }
    }
}
function initGridEventHandler(ctx) {
    ctx.canvas.addEventListener("click", (e) => {
        const x = Math.floor((e.offsetX / ctx.canvas.width) * GRID_COLS);
        const y = Math.floor((e.offsetY / ctx.canvas.height) * GRID_COLS);
        globalGameState[y][x].toggle();
        renderCell(ctx, globalGameState[y][x], x, y);
    });
}
function initEmptyGrid(ctx) {
    ctx.reset();
    ctx.scale(ctx.canvas.width / GRID_COLS, ctx.canvas.height / GRID_ROWS);
    drawCanvasGrid(ctx);
}
function renderScene(ctx) {
    ctx.reset();
    ctx.scale(ctx.canvas.width / GRID_COLS, ctx.canvas.height / GRID_ROWS);
    drawCanvasGrid(ctx);
    drawActiveCells(ctx);
}
function clearRect(ctx, x, y) {
    ctx.clearRect(x + 0.05, y + 0.05, 0.9, 0.9);
}
function renderCell(ctx, cell, x, y) {
    if (!cell.isAlive()) {
        clearRect(ctx, x, y);
        return;
    }
    ctx.fillStyle = "black";
    ctx.fillRect(x + 0.05, y + 0.05, 0.9, 0.9);
}
function drawCanvasGrid(ctx) {
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
function initBlock(state, x, y) {
    state[y][x] = new Cell(1);
    state[y][x + 1] = new Cell(1);
    state[y + 1][x] = new Cell(1);
    state[y + 1][x + 1] = new Cell(1);
}
function initGlider(state, x, y) {
    state[y][x + 1] = new Cell(1);
    state[y + 1][x + 2] = new Cell(1);
    state[y + 2][x] = new Cell(1);
    state[y + 2][x + 1] = new Cell(1);
    state[y + 2][x + 2] = new Cell(1);
}
function initGosperGlider(state, x, y) {
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
function initGameOfLife() {
    const result = zeroInitGameState();
    // initBlock(result, 4, 4);
    // initGlider(result, 7, 8);
    initGosperGlider(result, 5, 5);
    return result;
}
function sleep(ms = 1000) {
    return new Promise((res) => {
        setTimeout(res, ms);
    });
}
function isXOutOfBound(x) {
    return x < 0 || x >= GRID_COLS;
}
function isYOutOfBound(y) {
    return y < 0 || y >= GRID_ROWS;
}
function getNextCellState(x, y) {
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
        if (isXOutOfBound(nx) || isYOutOfBound(ny))
            continue;
        const n = globalGameState[ny][nx];
        if (n.isAlive())
            count++;
    }
    if (globalGameState[y][x].isAlive()) {
        return [2, 3].includes(count) ? new Cell(1) : new Cell(0);
    }
    else {
        return [3].includes(count) ? new Cell(1) : new Cell(0);
    }
}
function zeroInitGameState() {
    const result = [];
    for (let y = 0; y < GRID_ROWS; ++y) {
        const row = [];
        for (let x = 0; x < GRID_COLS; ++x) {
            row.push(new Cell(0));
        }
        result.push(row);
    }
    return result;
}
function getNextState() {
    const result = zeroInitGameState();
    for (let y = 0; y < GRID_ROWS; ++y) {
        for (let x = 0; x < GRID_COLS; ++x) {
            result[y][x] = getNextCellState(x, y);
        }
    }
    return result;
}
window.addEventListener("keyup", (e) => __awaiter(void 0, void 0, void 0, function* () {
    if (e.key !== " ")
        return;
    isGamePlaying = !isGamePlaying;
    const canvas = document.querySelector("canvas");
    if (canvas === null) {
        throw new Error("No canvas found in document");
    }
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
        throw new Error("2D Rendering context not supported by your browser - kekw");
    }
    while (isGamePlaying) {
        yield sleep(PERIOD_DURATION);
        globalGameState = getNextState();
        renderScene(ctx);
    }
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const canvas = document.querySelector("canvas");
    if (canvas === null) {
        throw new Error("No canvas found in document");
    }
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
        throw new Error("2D Rendering context not supported by your browser - kekw");
    }
    globalGameState = initGameOfLife();
    initGridEventHandler(ctx);
    renderScene(ctx);
}))();
//# sourceMappingURL=script.js.map