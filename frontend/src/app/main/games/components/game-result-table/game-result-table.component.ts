import {Component, computed, input} from '@angular/core';

import {DefaultResultTeamState} from "../../../../sites/core/http/dto/result/DefaultResultTeamState";
import {DefaultResultState} from "../../../../sites/core/http/dto/result/DefaultResultState";

@Component({
  selector: 'game-result-table',
    imports: [],
  templateUrl: './game-result-table.component.html',
    
  styleUrl: './game-result-table.component.css'
})
export class GameResultTableComponent {
    public resultState = input.required<DefaultResultState>();
    public maxTeamSize = input<number>(4);

    protected maxScore = computed(() =>{
        return Math.max(...this.resultState().teams.map(t => t.score));
    });

    protected paddedTeams = computed(() =>{
        if(!this.resultState()) return [];

        const padded: (DefaultResultTeamState | null)[] = [...this.resultState().teams];
        while (padded.length < this.maxTeamSize()) {
            padded.push(null);
        }
        return padded;
    });
}
