import {Component, computed, input} from '@angular/core';

import {ResultTeamState} from "../../../core/dto/result/ResultTeamState";
import {ResultState} from "../../../core/dto/result/ResultState";

@Component({
  selector: 'game-result-table',
    imports: [],
  templateUrl: './game-result-table.component.html',
    
  styleUrl: './game-result-table.component.css'
})
export class GameResultTableComponent {
    public resultState = input.required<ResultState>();
    public maxTeamSize = input<number>(4);

    protected maxScore = computed(() =>{
        return Math.max(...this.resultState().teams.map(t => t.score));
    });

    protected paddedTeams = computed(() =>{
        if(!this.resultState()) return [];

        const padded: (ResultTeamState | null)[] = [...this.resultState().teams];
        while (padded.length < this.maxTeamSize()) {
            padded.push(null);
        }
        return padded;
    });
}
