import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {GameState} from "../../dto/game/GameState";
import {NgClass} from "@angular/common";
import {CatanService} from "../../catan.service";
import {CatanDiceRollComponent} from "../dice-roll/dice-roll.component";
import {CatanHistogramComponent} from "../histogram/histogram.component";
import {ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
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
    
    styleUrl: './game.component.css'
})
export class CatanGameComponent implements OnInit {
    protected catanService = inject(CatanService);
    protected authService = inject(AuthService);
    private router = inject(Router);

    protected gameState = signal<GameState | null>(null);
    protected showChart = signal<boolean>(false);

    protected currentRoll = computed(() => {
        const state = this.gameState();
        if(!state) return null;

        if (state.diceRolls.length === 0) return {
            dicePair: {
                dice1: 4,
                dice2: 3,
                event: '-',
            },
            diceEvent: 'b',
            teamName: '',
            rollTime: ''
        };

        return state.diceRolls[state.diceRolls.length - 1];
    });

    protected lastPlayer = computed(() => {
        const state = this.gameState();
        if (!state || state.gameConfig.teams.length === 0 || state.diceRolls.length === 0) return null;

        const lastRollTeam = state.diceRolls[state.diceRolls.length - 1].teamName;
        const found = state.gameConfig.teams.find(team => team.name === lastRollTeam);
        if (found === undefined) {
            return null;
        }

        return found;
    });

    protected readonly attackText = 'CHARGE ';

    ngOnInit() {
        this.getSession();
    }

    protected rollDice(isAlchemist = false) {
        this.catanService.rollDice(isAlchemist).subscribe(res => {
                this.gameState.set(res);
        });
    }

    protected undoRoll() {
        this.catanService.undoRoll().subscribe(res => {
            this.gameState.set(res);
        });
    }

    protected toggleChart() {
        this.showChart.update(value => !value);
    }

    private getSession() {
        this.catanService.getSession().subscribe({
            next: res => {
                this.gameState.set(res);
            },
            error: err => {
                this.router.navigate(['projects/catan']);
            }
        });
    }

    protected readonly GameMode = GameMode;
}
