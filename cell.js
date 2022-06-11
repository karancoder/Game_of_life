function getRandomNumberBetween(start, end) {
    return start + Math.floor(Math.random() * (end - start + 1));
}

class Cell {
    #currentState;
    #total;

    constructor() {
        this.#currentState = getRandomNumberBetween(0, 1);
        this.#total = 0;
    }

    get currentState() {
        return this.#currentState;
    }

    get total() {
        return this.#total;
    }

    setState(newState) {
        this.#currentState = newState.currentState;
        this.#total += newState.total + newState.currentState;
    }
}

export default Cell;
