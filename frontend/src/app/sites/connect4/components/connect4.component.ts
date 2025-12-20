import {Component} from '@angular/core';
import {CellComponent} from "./cell/cell.component";

import {Connect4Service} from "../connect4.service";
import {MoveRequest, SolveRequest, UndoRequest} from "../dto/requests";
import {GameState, PlayerConfig} from "../dto/data";
import {Globals} from "../../../main/classes/globals";
import {PlayerSettingsComponent} from "./player-settings/player-settings.component";
import {DelayLoader} from "../../../main/classes/delay-loader";

@Component({
    selector: 'app-connect4',
    imports: [
    CellComponent,
    PlayerSettingsComponent
],
    templateUrl: './connect4.component.html',
    standalone: true,
    styleUrl: './connect4.component.css'
})
export class Connect4Component {
    board!: number[][];
    moves!: number[];
    gameOver!: boolean;
    gameOverText!: string;
    isUndoing!: boolean;

    delayLoader: DelayLoader = new DelayLoader(10);

    score: number = 0;
    winDistance: number = -1;

    player1!: PlayerConfig;
    player2!: PlayerConfig;

    private _gameState: GameState = GameState.RUNNING;
    private _currentPlayer: PlayerConfig | undefined = undefined;

    get gameState(): GameState {
        return this._gameState;
    }

    get currentPlayer(): PlayerConfig | undefined {
        return this._currentPlayer;
    }

    set gameState(value: GameState) {
        this._gameState = value;

        //check game state for end
        if (this._gameState === GameState.RUNNING) {
            this.gameOver = false;
        } else {
            this.gameOver = true;
            if (this._gameState === GameState.PLAYER1 || this._gameState === GameState.PLAYER2) {
                const winner = this._gameState === GameState.PLAYER1 ? "1" : "2";
                this.gameOverText = `Player ${winner} won!`;
            } else {
                this.gameOverText = `It's a draw!`;
            }
        }
    }

    set currentPlayer(value: PlayerConfig | undefined) {
        this._currentPlayer = value;

        //start next ai move
        if (this.gameState !== GameState.RUNNING || this._currentPlayer === undefined) return;

        if (this._currentPlayer.isAi && !this.isUndoing) {
            this.solve(this._currentPlayer);
        }
    }

    constructor(private globals: Globals, private connect4Service: Connect4Service) {
        this.refresh();
    }

    initPlayer1(config: PlayerConfig) {
        this.player1 = config;

        //first init
        if (this.currentPlayer === undefined) {
            this.currentPlayer = this.player1;
        }
    }

    initPlayer2(config: PlayerConfig) {
        this.player2 = config;
    }

    refresh(): void {
        this.board = this.createBoard(6, 7);
        this.gameOver = false;
        this.gameOverText = '';
        this.currentPlayer = this.player1;
        this.gameState = GameState.RUNNING;
        this.moves = new Array(0);
        this.delayLoader.isLoading = false;
        this.isUndoing = false;
    }

    makeMove(col: number) {
        if (this.gameOver || !this.currentPlayer) return;

        let moveRequest: MoveRequest = {
            board: this.board,
            player: this.currentPlayer.value,
            move: col
        };

        this.isUndoing = false;
        this.connect4Service.move(moveRequest).subscribe({
            next: res => {
                this.board = res.board;
                this.gameState = res.gameState;

                this.moves.push(moveRequest.move);
                this.togglePlayer();
            }
        })
    }

    undoMove(col: number) {
        let undoRequest: UndoRequest = {
            board: this.board,
            move: col
        }

        this.isUndoing = true;
        this.connect4Service.undo(undoRequest).subscribe({
            next: res => {
                this.board = res.board;
                this.gameState = res.gameState;

                this.moves.pop();
                this.togglePlayer();
            }
        })
    }

    solve(player: PlayerConfig | undefined) {
        if (this.gameOver || player === undefined) return;

        let solveRequest: SolveRequest = {
            board: this.board,
            player: player.value,
            maxTime: player.maxTime,
            maxDepth: -1,
            tableSize: player.maxMemory,
            version: player.version
        };

        this.delayLoader.isLoading = true;
        this.connect4Service.solve(solveRequest).subscribe({
            next: res => {
                this.delayLoader.isLoading = false;

                this.board = res.board;
                this.gameState = res.gameState;
                this.score = res.score;
                this.winDistance = res.winDistance;

                this.moves.push(res.move);
                this.togglePlayer();
            },
            error: err => {
                this.delayLoader.isLoading = false;
            }
        })
    }

    isLastMove(i: number, j: number): boolean {
        if (this.moves.length === 0) return false;

        const col = this.moves[this.moves.length - 1];
        if (j != col) return false;

        for (let k = 0; k < this.board.length; k++) {
            if (this.board[k][col] !== 0) {
                return i == k;
            }
        }

        return false;
    }

    private createBoard(rows: number, cols: number): number[][] {
        return new Array(rows)
            .fill(0)
            .map(
                () => new Array(cols).fill(0)
            )
    }

    private togglePlayer(): void {
        if (!this.currentPlayer) return;

        this.currentPlayer = this.currentPlayer.value === this.player1.value ? this.player2 : this.player1;
    }

    protected readonly Math = Math;
}
