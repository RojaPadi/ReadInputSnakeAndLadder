const rl = require("readline-sync");
// const rl = readlineSync.createInterface({
//     input: process.stdin,
//     output: process.stdout
// });
class Game {
    constructor() {
        this.board = new Board();
        this.players = [];
        this.winner = [];
        this.snakes = [];
        this.ladders = [];
        this.dice_count = 1;
        this.dice = new Dice();
    }

    get entities() {
        return this.snakes + this.ladders;
    }

    async launch() {
        await this.readInput();
        await this.board.setup(this.entities);
        this.start();
    }

    start() {
        while (this.players.length != 1) {
            var current_player = this.players.shift();
            var steps = this.dice.roll(this.dice_count);
            this.makeMove(current_player, steps);
            if (winner(current_player)) {
                this.winners << current_player;
            }
            else {
                this.players << current_player;
            }
        }
        displayWinners;
    }

    winner(position) {
        this.board.size == position;
    }

    displayWinners() {
        console.log(`Winners`);
        this.winners.forEach(winner => {
            console.log(`${winner.name}`)
        });
    }

    makeMove(player, steps) {
        var start_position = player.position;
        if (this.board.overflow(start_position, steps)) {
            console.log(`${player.name} has rollled ${steps}. Move not possible`);
            return null;
        }
        player.position += steps;
        if (!this.board.entity(player.position)) {
            player.position = this.board.finalSquare(player.position);
        }
        console.log(`${player.name} has rolled ${steps} and moved from ${start_position} to ${player.position}`);
    }

    async readInput() {
        this.snakes = await this.readBoardEntities('snake');
        this.ladders = await this.readBoardEntities('ladder');
        await this.readPlayers();
    }

    async readBoardEntities(entity) {
        let entities = [];
        let num = rl.question("Enter Number");
        for (let val = 0; val < num; val++) {
            let snake = rl.question(`Enter ${entity}`)
            let coordinates = snake.split(' ');
            let head = parseInt(coordinates[0]);
            let tail = parseInt(coordinates[1]);
            const entityResult = await BoardEntity(entity, head, tail);
            entities.unshift(entityResult);
        }
        return entities;
    }

    async readPlayers() {
        let num = rl.question(null, num);
        for (let val = 0; val < num; val++) {
            rl.question(null, name => {
                this.players << new Player(name);
            });
        }
    }
}

async function BoardEntity(entity, head, tail) {
    if (entity == 'snake') {
        return new Snake(head, tail);
    }
    else if (entity == 'ladder') {
        return new Ladder(head, tail);
    }
}

class Board {
    constructor() {
        this.board = this.createBoard();
        this.size = 100;
    }

    createBoard() {
        let board = {};
        for (let square = 1; square <= 100; square++) {
            board[square] = null;
        }
        return board;
    }

    setup(entities) {
        entities.forEach(entity => {
            this.board[entity.head] = entity;
        });
    }

    overflow(square, steps) {
        square + steps > this.size;
    }

    entity(square) {
        this.board[square] === null;
    }

    finalSquare(square) {
        this.board[square].tail;
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.position = 0;
    }
}

class Dice {
    roll(count) {
        Math.floor(Math.random() * count * 6) + count;
    }
}

class Snake {
    constructor(head, tail) {
        this.head = head;
        this.tail = tail;
    }
}

class Ladder {
    constructor(head, tail) {
        this.head = tail;
        this.head = tail;
    }
}

var game = new Game;
game.launch();

