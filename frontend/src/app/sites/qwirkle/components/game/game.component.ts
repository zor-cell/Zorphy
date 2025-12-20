import {Component, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {QwirkleHandComponent} from "../hand/hand.component";
import {QwirkleStackComponent} from "../stack/stack.component";
import {QwirkleService} from "../../qwirkle.service";
import {GameState} from "../../dto/game/GameState";
import { NgStyle } from "@angular/common";
import {QwirkleTileComponent} from "../tile/tile.component";
import {Position} from "../../../../main/dto/all/Position";
import {Move} from "../../dto/move/Move";
import {Direction} from "../../dto/enums/Direction";
import {MoveGroup} from "../../dto/move/MoveGroup";
import {PanContainerComponent} from "../../../../main/components/all/pan-container/pan-container.component";
import {SelectionInfo} from "../../dto/SelectionInfo";
import {ImageInputComponent} from "../image-input/image-input.component";
import {Router} from "@angular/router";
import {GameSessionGameComponent} from "../../../all/components/game-session-game.component";

@Component({
    selector: 'qwirkle-game',
    imports: [
    QwirkleHandComponent,
    QwirkleStackComponent,
    QwirkleTileComponent,
    NgStyle,
    PanContainerComponent,
    ImageInputComponent,
    GameSessionGameComponent
],
    templateUrl: './game.component.html',
    standalone: true,
    styleUrl: './game.component.css'
})
export class QwirkleGameComponent implements OnInit {
    @ViewChild('board') board!: PanContainerComponent;

    tileSize = 40;
    gameState!: GameState;
    selectedMove: MoveGroup | null = null;

    bestMoves: MoveGroup[] | null = null;
    selectionInfo: SelectionInfo | null = null;

    editMode: boolean = false;

    private readonly localCenter: Position = {
        x: 0,
        y: 0,
    };

    get center() {
        return {
            x: this.localCenter.x - this.tileSize / 2,
            y: this.localCenter.y - this.tileSize / 2
        }
    }

    protected qwirkleService = inject(QwirkleService)
    private router = inject(Router);

    ngOnInit() {
        this.getSession();
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        const target = event.target as HTMLElement;

        //unselect a move when clicking anywhere except on it
        if (!target.closest('.valid-move') && !target.closest('.highlighted-move')) {
            this.selectedMove = null;
        }
    }

    //events from children
    clearedHand(gameState: GameState) {
        this.gameState = gameState;
        this.bestMoves = null;
    }

    selectedInHand(selectionInfo: SelectionInfo) {
        if(selectionInfo.tiles.length === 0) {
            this.selectionInfo = null;
        } else {
            this.selectionInfo = selectionInfo;
        }
    }

    drewTile(gameState: GameState) {
        this.gameState = gameState;
        this.findBestMoves();
    }

    selectedInStack(selectionInfo: SelectionInfo) {
       this.selectionInfo = selectionInfo;
    }

    //events from board
    chooseValidMove(moveIndex: number) {
        if(!this.selectionInfo) return;

        this.selectedMove = this.selectionInfo.moves[moveIndex];
    }

    makeBestMove(moveIndex: number) {
        if (!this.bestMoves) return;

        const moveGroup = this.bestMoves[moveIndex];

        const move: Move = {
            position: moveGroup.position,
            direction: moveGroup.groupInfos[0].direction,
            tiles: moveGroup.tiles
        };

        this.makeMove(move);
    }

    makeSelectedMove(direction: Direction) {
        if (!this.selectedMove || !this.selectionInfo) return;

        const move: Move = {
            position: this.selectedMove.position,
            direction: direction,
            tiles: this.selectedMove.tiles
        }
        this.selectedMove = null;
        this.selectionInfo = null;

        this.makeMove(move, this.editMode);
    }

    getTilePositionStyle(position: Position) {
        return {
            left: `${position.x * this.tileSize - this.tileSize / 2}px`,
            bottom: `${position.y * this.tileSize - this.tileSize / 2}px`,
            width: `${this.tileSize}px`,
            height: `${this.tileSize}px`
        }
    }

    getValidMoveGroupStyle(moveGroup: MoveGroup) {
        const borderMap: Record<Direction, string> = {
            [Direction.UP]: 'border-top-width',
            [Direction.RIGHT]: 'border-right-width',
            [Direction.DOWN]: 'border-bottom-width',
            [Direction.LEFT]: 'border-left-width',
        };
        let borderWidth = 4;
        if (moveGroup.tiles.length === 1) {
            borderWidth = 1;
        }

        const style: Record<string, string> = {
            ...this.getTilePositionStyle(moveGroup.position)
        }

        for (const groupInfo of moveGroup.groupInfos) {
            const cssProp = borderMap[groupInfo.direction];
            if (cssProp) {
                style[cssProp] = `${borderWidth}px`;
            }
        }

        return style;
    }

    private calculateCenter() {
        if (this.board) {
            const board = this.board.elementRef.nativeElement as HTMLElement;
            this.localCenter.x = board.clientWidth / 2;
            this.localCenter.y = board.clientHeight / 2;
        }
    }


    //requests
    protected undoMove() {
        if(this.gameState.moves.length === 0) return;

        this.qwirkleService.undoMove().subscribe(res => {
            this.gameState = res;
        })
    }

    private findBestMoves() {
        this.qwirkleService.getBestMoves().subscribe({
            next: res => {
                this.bestMoves = res;
            }
        })
    }

    private getSession() {
        this.qwirkleService.getSession().subscribe({
            next: res => {
                this.gameState = res;

                this.findBestMoves();

                //calculate center in next tick
                setTimeout(() => this.calculateCenter(), 1);
            },
            error: err => {
                this.router.navigate(['projects/qwirkle']);
            }
        });
    }

    private makeMove(move: Move, fromStack: boolean = false) {
        this.qwirkleService.makeMove(move, fromStack).subscribe(res => {
            this.gameState = res;
            this.findBestMoves();
        });
    }
}
