const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const resolution = 10;
canvas.width = 1200;
canvas.height = 800;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

let grid = randomGrid();
requestAnimationFrame(update);

function update() {
    render(grid);
    grid = nextGen(grid);
    requestAnimationFrame(update);
}

function getRandomNumberBetween(start, end) {
    return start + Math.floor(Math.random() * (end - start + 1));
}

function buildGrid() {
    return new Array(ROWS).fill(null).map(() => new Array(COLS).fill(0));
}

function randomGrid() {
    return new Array(ROWS)
        .fill(null)
        .map(() =>
            new Array(COLS).fill(null).map(() => getRandomNumberBetween(0, 1))
        );
}

function getNextGenValue(cellNeighborHood, neighbourWindowRadius) {
    let aliveCount = 0;
    for (let i = 0; i < cellNeighborHood.length; i++) {
        for (let j = 0; j < cellNeighborHood[i].length; j++) {
            if (i === neighbourWindowRadius && j === neighbourWindowRadius) {
                continue;
            }
            aliveCount += cellNeighborHood[i][j];
        }
    }
    return (
        (cellNeighborHood[neighbourWindowRadius][neighbourWindowRadius] &&
            aliveCount === 2) ||
        aliveCount === 3
    );
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
    const nextGen = JSON.parse(JSON.stringify(grid));
    const neighbourWindowRadius = 1;

    for (let i = 0; i < nextGen.length; i++) {
        for (let j = 0; j < nextGen[i].length; j++) {
            const currentCellNeighborHood = getCurrentNeighborhood(
                grid,
                i,
                j,
                neighbourWindowRadius
            );
            nextGen[i][j] = getNextGenValue(
                currentCellNeighborHood,
                neighbourWindowRadius
            );
        }
    }

    return nextGen;
}

function render(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            const cell = grid[i][j];
            ctx.beginPath();
            ctx.rect(j * resolution, i * resolution, resolution, resolution);
            ctx.fillStyle = cell ? "black" : "white";
            ctx.fill();
            // ctx.stroke();
        }
    }
}
