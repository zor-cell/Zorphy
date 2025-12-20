import {Component, inject, OnInit} from '@angular/core';
import {GameState} from "../../dto/game/GameState";
import { NgClass } from "@angular/common";
import {CatanService} from "../../catan.service";
import {CatanDiceRollComponent} from "../dice-roll/dice-roll.component";
import {DiceRoll} from "../../dto/DiceRoll";
import {CatanHistogramComponent} from "../histogram/histogram.component";
import {ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {Team} from "../../../../main/dto/all/Team";
import {AuthService} from "../../../../main/services/auth.service";
import {GameMode} from "../../dto/enums/GameMode";
import {GameSessionGameComponent} from "../../../all/components/game-session-game.component";

@Component({
    selector: 'catan-game',
    imports: [
    NgClass,
    CatanDiceRollComponent,
    CatanHistogramComponent,
    ReactiveFormsModule,
    GameSessionGameComponent
],
    templateUrl: './game.component.html',
    standalone: true,
    styleUrl: './game.component.css'
})
export class CatanGameComponent implements OnInit {
    gameState!: GameState;
    showChart: boolean = false;

    protected catanService = inject(CatanService);
    protected authService = inject(AuthService);
    private router = inject(Router);

    get currentRoll(): DiceRoll | null {
        if (!this.gameState) return null;

        if (this.gameState.diceRolls.length === 0) return {
            dicePair: {
                dice1: 4,
                dice2: 3,
                event: '-',
            },
            diceEvent: 'b',
            teamName: '',
            rollTime: ''
        };

        return this.gameState.diceRolls[this.gameState.diceRolls.length - 1];
    }

    get lastPlayer(): Team | null {
        if (!this.gameState || this.gameState.gameConfig.teams.length === 0 || this.gameState.diceRolls.length === 0) return null;

        const lastRollTeam = this.gameState.diceRolls[this.gameState.diceRolls.length - 1].teamName;
        const found = this.gameState.gameConfig.teams.find(team => team.name === lastRollTeam);
        if (found === undefined) {
            return null;
        }

        return found;
    }

    get attackText(): string {
        return 'CHARGE ';
    }

    ngOnInit() {
        this.getSession();
    }

    protected rollDice(isAlchemist = false) {
        this.catanService.rollDice(isAlchemist).subscribe(res => {
                this.gameState = res;
        });
    }

    protected undoRoll() {
        this.catanService.undoRoll().subscribe(res => {
            this.gameState = res;
        });
    }

    protected toggleChart() {
        this.showChart = !this.showChart;
    }

    private getSession() {
        this.catanService.getSession().subscribe({
            next: res => {
                this.gameState = res;
            },
            error: err => {
                this.router.navigate(['projects/catan']);
            }
        });
    }

    protected readonly GameMode = GameMode;
}
