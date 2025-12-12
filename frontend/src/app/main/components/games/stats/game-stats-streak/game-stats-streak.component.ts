import {Component, input} from '@angular/core';
import {GameStatsMetaComponent} from "../game-stats-meta/game-stats-meta.component";
import {GameStatsStreak} from "../../../../dto/games/stats/GameStatsStreak";
import {Params, RouterLink} from "@angular/router";
import {start} from "@popperjs/core";

@Component({
  selector: 'game-stats-streak',
  imports: [
    GameStatsMetaComponent,
    RouterLink
  ],
  templateUrl: './game-stats-streak.component.html',
  styleUrl: './game-stats-streak.component.css'
})
export class GameStatsStreakComponent {
  public streak = input.required<GameStatsStreak>();
  public label = input.required<string>();

  protected getQueryParams(): Params {
    const str = this.streak();

    if(str.start && str.end) {
      return {
        dateFrom: this.formatDateToInput(new Date(str.start.metadata.playedAt)),
        dateTo: this.formatDateToInput(new Date(str.end.metadata.playedAt)),
        players: [str.playerId],
        gameTypes: [str.start.metadata.gameType]
      };
    } else if(str.start) {
      return {
        dateFrom: this.formatDateToInput(new Date(str.start.metadata.playedAt)),
        players: [str.playerId],
        gameTypes: [str.start.metadata.gameType]
      };
    } else return {};
  }

  private formatDateToInput(date: Date): string {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
