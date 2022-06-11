import Cell from "./cell.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const normalModeBtn = document.getElementById("normal-mode-btn");
const heatMapBtn = document.getElementById("heat-map-mode-btn");

normalModeBtn.addEventListener("click", changeModeToNormal);
heatMapBtn.addEventListener("click", changeModeToHeatMap);

const resolution = 10;

canvas.style.width = "90%";
canvas.style.height = "100%";
canvas.width = canvas.offsetWidth - (canvas.offsetWidth % resolution);
canvas.height = canvas.offsetHeight - (canvas.offsetHeight % resolution);

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

let grid = randomGrid();
requestAnimationFrame(update);

// normal - 0, heat map - 1,
let renderMethod = 1;

function changeModeToHeatMap(event) {
    if (!heatMapBtn.classList.contains("active-btn")) {
        heatMapBtn.classList.toggle("active-btn");
        normalModeBtn.classList.toggle("active-btn");
    }
    renderMethod = 1;
}

function changeModeToNormal(event) {
    if (!normalModeBtn.classList.contains("active-btn")) {
        heatMapBtn.classList.toggle("active-btn");
        normalModeBtn.classList.toggle("active-btn");
    }
    renderMethod = 0;
}

function update() {
    render(grid);
    grid = nextGen(grid);
    requestAnimationFrame(update);
}

function randomGrid() {
    return new Array(ROWS)
        .fill(null)
        .map(() => new Array(COLS).fill(null).map(() => new Cell()));
}

function getNextGenValue(cellNeighborHood, neighbourWindowRadius) {
    let aliveCount = 0;
    for (let i = 0; i < cellNeighborHood.length; i++) {
        for (let j = 0; j < cellNeighborHood[i].length; j++) {
            if (i === neighbourWindowRadius && j === neighbourWindowRadius) {
                continue;
            }
            aliveCount += cellNeighborHood[i][j].currentState;
        }
    }
    return {
        currentState: Number(
            (cellNeighborHood[neighbourWindowRadius][neighbourWindowRadius]
                .currentState &&
                aliveCount === 2) ||
                aliveCount === 3
        ),
        total: cellNeighborHood[neighbourWindowRadius][neighbourWindowRadius]
            .total,
    };
}

function getCurrentNeighborhood(grid, x, y, neighbourWindowRadius) {
    const currentCellNeighborHood = new Array(2 * neighbourWindowRadius + 1)
        .fill(null)
        .map(() => new Array(2 * neighbourWindowRadius + 1).fill(0));
    for (let i = 0; i < 2 * neighbourWindowRadius + 1; i++) {
        for (let j = 0; j < 2 * neighbourWindowRadius + 1; j++) {
            if (
                x + i - neighbourWindowRadius >= 0 &&
                x + i - neighbourWindowRadius < grid.length &&
                y + j - neighbourWindowRadius >= 0 &&
                y + j - neighbourWindowRadius < grid[0].length
            ) {
                // console.log(x + i - neighbourWindowRadius);
                // console.log(y + j - neighbourWindowRadius);
                currentCellNeighborHood[i][j] =
                    grid[x + i - neighbourWindowRadius][
                        y + j - neighbourWindowRadius
                    ];
            }
        }
    }
    return currentCellNeighborHood;
}

function nextGen(grid) {
    const nextGen = randomGrid();
    const neighbourWindowRadius = 1;
    for (let i = 0; i < nextGen.length; i++) {
        for (let j = 0; j < nextGen[i].length; j++) {
            const currentCellNeighborHood = getCurrentNeighborhood(
                grid,
                i,
                j,
                neighbourWindowRadius
            );
            nextGen[i][j].setState(
                getNextGenValue(currentCellNeighborHood, neighbourWindowRadius)
            );
        }
    }

    return nextGen;
}

function render(grid) {
    let max_total = 0;
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            max_total =
                max_total < grid[i][j].total ? grid[i][j].total : max_total;
        }
    }

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const cell = grid[i][j];
            ctx.beginPath();
            ctx.rect(j * resolution, i * resolution, resolution, resolution);
            if (!renderMethod) {
                ctx.fillStyle = cell.currentState ? "black" : "white";
            } else {
                let normalized = cell.total / max_total;
                let hue = (1 - normalized) * 240;
                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            }
            ctx.fill();
            // ctx.stroke();
        }
    }
}
