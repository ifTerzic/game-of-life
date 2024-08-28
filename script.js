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
const GRID_ROWS = 20;
const GRID_COLS = 20;
var CellState;
(function (CellState) {
    CellState[CellState["alive"] = 0] = "alive";
    CellState[CellState["dead"] = 1] = "dead";
})(CellState || (CellState = {}));
var Direction;
(function (Direction) {
    Direction[Direction["top"] = 0] = "top";
    Direction[Direction["right"] = 1] = "right";
    Direction[Direction["bottom"] = 2] = "bottom";
    Direction[Direction["left"] = 3] = "left";
})(Direction || (Direction = {}));
class Canon {
    constructor(d, x, y) {
        this.direction = d;
    }
    shoot() { }
}
class Cell {
    constructor(s) {
        this.state = s;
    }
    isAlive() {
        return this.state === 1;
    }
}
function drawActiveCells(ctx, state) {
    for (let y = 0; y < GRID_ROWS; ++y) {
        for (let x = 0; x < GRID_COLS; ++x) {
            renderCell(ctx, state[y][x], x, y);
        }
    }
}
function renderScene(ctx, state) {
    ctx.reset();
    ctx.scale(ctx.canvas.width / GRID_COLS, ctx.canvas.height / GRID_ROWS);
    drawCanvasGrid(ctx);
    drawActiveCells(ctx, state);
}
function renderCell(ctx, cell, x, y) {
    if (!cell.isAlive())
        return;
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
function initGameOfLife() {
    const result = zeroInitGameState();
    result[6][2] = new Cell(1);
    result[6][3] = new Cell(1);
    result[7][2] = new Cell(1);
    result[7][3] = new Cell(1);
    // result[10][8] = new Canon("");
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
function getNextCellState(state, x, y) {
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
        const n = state[ny][nx];
        if (n.isAlive())
            count++;
    }
    return [2, 3].includes(count) ? new Cell(1) : new Cell(0);
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
function getNextState(state) {
    const result = zeroInitGameState();
    for (let y = 0; y < GRID_ROWS; ++y) {
        for (let x = 0; x < GRID_COLS; ++x) {
            result[y][x] = getNextCellState(state, x, y);
        }
    }
    return result;
}
window.addEventListener("keypress", () => __awaiter(void 0, void 0, void 0, function* () {
    const canvas = document.querySelector("canvas");
    if (canvas === null) {
        throw new Error("No canvas found in document");
    }
    const ctx = canvas.getContext("2d");
    if (ctx === null) {
        throw new Error("2D Rendering context not supported by your browser - kekw");
    }
    let state = initGameOfLife();
    renderScene(ctx, state);
    for (;;) {
        yield sleep(1000);
        state = getNextState(state);
        renderScene(ctx, state);
    }
}));
(() => __awaiter(void 0, void 0, void 0, function* () { }))();
//# sourceMappingURL=script.js.map