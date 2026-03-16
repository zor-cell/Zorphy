import {Component, computed, input, Signal} from '@angular/core';
import {DuelResultState} from "../../dto/result/DuelResultState";
import {ReactiveFormsModule} from "@angular/forms";
import {DuelResultTeamState} from "../../dto/result/DuelResultTeamState";
import {Team} from "../../../../main/core/dto/Team";

@Component({
  selector: 'seven-wonders-result-table',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './result-table.component.html',
  styleUrl: './result-table.component.css',
})
export class SevenWondersResultTableComponent {
  public resultState = input.required<DuelResultState>();

  protected teams: Signal<DuelResultTeamState[]> = computed(() => {
    if(!this.resultState()) return [];

    return [...this.resultState().teams];
  });

  protected maxScore = computed(() =>{
    return Math.max(...this.resultState().teams.map(t => t.score));
  });

  protected isWinner(teamName: string) {
    const team = this.resultState().teams.find(t => t.team.name === teamName);
    if(!team) return false;

    if(team.wonWithScience || team.wonWithWar) return true;

    //check if anyone won with instant wins
    if(this.resultState().teams.some(t => t.wonWithWar || t.wonWithScience)) {
      return false;
    }

    return team.score === this.maxScore();
  }
}
