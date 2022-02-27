// STATE
const dictionary = ['earth', 'crane', 'world', 'brake', 'penis'];
const state = {
    secret: dictionary[Math.round(Math.random() * dictionary.length)],
    grid: Array(6)
        .fill()
        .map((r) => Array(5).fill('')),
    currentPos: {
        row: 0,
        col: 0,
    },
};

// FUNCITONS
function addLetter(letter) {
    if (state.currentPos.col === 5) return;

    state.grid[state.currentPos.row][state.currentPos.col] = letter;

    state.currentPos.col++;
}

function removeLetter() {
    if (state.currentPos.col === 0) return;
    state.grid[state.currentPos.row][state.currentPos.col - 1] = '';
    state.currentPos.col--;
}

function drawGameContainer(container) {
    const game = document.createElement('div');
    game.className = 'game';
    container.appendChild(game);

    const grid = document.createElement('div');
    grid.className = 'grid';
    game.appendChild(grid);

    return grid;
}

function drawField(container, pos, value = '') {
    const box = document.createElement('div');
    box.className = 'box';
    box.textContent = value;
    box.id = `box${pos.row}${pos.col}`;

    container.appendChild(box);
    return box;
}

function isLetter(s) {
    return s.length === 1 && s.match(/[a-z]/i);
}

function registerKeyboardEvents() {
    document.body.onkeydown = (e) => {
        if (e.key === 'Enter') {
            if (state.currentPos.col === 5) {
                const word = getCurrentWord();
                if (isWordValid(word)) {
                    revealWord();
                    state.currentPos.col = 0;
                    state.currentPos.row++;
                } else {
                    alert('Word is not valid.');
                }
            }
        }
        if (e.key === 'Backspace') {
            removeLetter();
        }
        if (isLetter(e.key)) {
            addLetter(e.key);
        }

        updateGrid();
    };
}

function updateGrid() {
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
        }
    }
}

function isWordValid(word) {
    return dictionary.includes(word);
}

function getCurrentWord() {
    return state.grid[state.currentPos.row].reduce((prev, curr) => prev + curr);
}

function revealWord() {
    const row = state.currentPos.row;
    const anim_duration = 500;
    for (let i = 0; i < 5; i++) {
        const box = document.getElementById(`box${row}${i}`);
        const letter = box.textContent;

        box.classList.add('animated');
        setTimeout(() => {
            if (state.secret[i] === letter) {
                box.classList.add('right');
            } else if (state.secret.includes(letter)) {
                box.classList.add('wrong');
            } else {
                box.classList.add('empty');
            }
        }, (i + 1) * (anim_duration / 2));

        box.style.animationDelay = `${i * 0.25}s`;
    }

    const isWinner = state.secret === getCurrentWord();
    const isGameOver = row === 5;

    setTimeout(() => {
        if (isWinner) {
            alert('Congratulations!');
        }
        if (isGameOver) {
            alert(`Better luck next time. The word was ${state.secret}.`);
        }
    }, 3 * anim_duration);
}

function startUp() {
    const container = drawGameContainer(document.body);
    for (let i = 0; i < state.grid.length; i++) {
        for (let j = 0; j < state.grid[i].length; j++) {
            drawField(container, { row: i, col: j });
        }
    }
    registerKeyboardEvents();
}

startUp();
