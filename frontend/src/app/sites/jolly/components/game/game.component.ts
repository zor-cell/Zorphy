import {Component, computed, inject, OnInit, signal, viewChild} from '@angular/core';
import {JollyService} from "../../jolly.service";
import {GameSessionGameComponent} from "../../../all/components/game-session-game.component";
import {GameState} from "../../dto/game/GameState";
import {AuthService} from "../../../../main/core/services/auth.service";

import {Router} from "@angular/router";
import {RoundPopupComponent} from "../popups/round-popup/round-popup.component";
import {RoundResult} from "../../dto/RoundResult";
import {ReactiveFormsModule} from "@angular/forms";
import {JollyRoundTableComponent} from "../rounds-table/round-table.component";
import {WithFile} from "../../../../main/core/dto/WithFile";

@Component({
  selector: 'jolly-game',
  imports: [
    GameSessionGameComponent,
    RoundPopupComponent,
    ReactiveFormsModule,
    JollyRoundTableComponent
],
  templateUrl: './game.component.html',
  
  styleUrl: './game.component.css'
})
export class JollyGameComponent implements OnInit {
  private router = inject(Router);
  protected jollyService = inject(JollyService);
  protected authService = inject(AuthService);

  protected roundPopup = viewChild.required<RoundPopupComponent>("roundPopup");
  protected gameState = signal<GameState | null>(null);

  protected saveScores = computed<Record<string, number>>(() => {
    const state = this.gameState();
    if (!state) return {};

    const scores: Record<string, number> = {};

    // initialize all team scores with 0
    for (const team of state.gameConfig.teams) {
      scores[team.name] = 0;
    }

    // accumulate round results
    for (const round of state.rounds) {
      for (const res of round.results) {
        const teamName = res.team.name;
        scores[teamName] = (scores[teamName] ?? 0) + (res.score ?? 0);
      }
    }

    return scores;
  });

  ngOnInit() {
    this.getSession();
  }

  private getSession() {
    this.jollyService.getSession().subscribe({
      next: res => {
        this.gameState.set(res);
      },
      error: err => {
        this.router.navigate(['projects/jolly']);
      }
    });
  }

  protected openRoundPopup() {
    this.roundPopup().openPopup();
  }

  protected addRound(event: WithFile<RoundResult[]>) {
    this.jollyService.saveRound(event.data, event.file).subscribe(res => {
      this.gameState.set(res);
    });
  }

  protected updatedRounds(res: GameState) {
    this.gameState.set(res);
  }

  protected roundLimitReached() {
    if(this.gameState()!.gameConfig.noRoundLimit) {
      return false;
    }

    return this.gameState()!.rounds.length >= this.gameState()!.gameConfig.roundLimit;
  }

}
