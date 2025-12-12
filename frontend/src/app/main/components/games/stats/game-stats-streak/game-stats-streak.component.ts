import {Component, input} from '@angular/core';
import {GameStatsMetaComponent} from "../game-stats-meta/game-stats-meta.component";
import {GameStatsStreak} from "../../../../dto/games/stats/GameStatsStreak";
import {RouterLink} from "@angular/router";

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
}
