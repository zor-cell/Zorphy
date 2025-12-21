import {Component, input} from '@angular/core';
import {DiceRoll} from "../../dto/DiceRoll";

import {GameMode} from "../../dto/enums/GameMode";

@Component({
    selector: 'catan-dice-roll',
    imports: [],
    templateUrl: './dice-roll.component.html',
    
    styleUrl: './dice-roll.component.css'
})
export class CatanDiceRollComponent {
    public diceRoll = input.required<DiceRoll | null>();
    public gameMode = input.required<GameMode>();

    protected readonly GameMode = GameMode;
}
