import {Component, input} from '@angular/core';
import {GameStats} from "../../dto/game/GameStats";
import {DurationPipe} from "../../../../main/pipes/DurationPipe";
import {GameStatsMetaComponent} from "../../../../main/components/games/stats/game-stats-meta/game-stats-meta.component";
import {
    GameStatsMetricsComponent
} from "../../../../main/components/games/stats/game-stats-metrics/game-stats-metrics.component";
import {
    GameStatsSimpleComponent
} from "../../../../main/components/games/stats/game-stats-simple/game-stats-simple.component";

@Component({
  selector: 'jolly-game-stats',
    imports: [
        DurationPipe,
        GameStatsMetaComponent,
        GameStatsMetricsComponent,
        GameStatsSimpleComponent
    ],
  templateUrl: './game-stats.component.html',
  styleUrl: './game-stats.component.css',
  standalone: true
})
export class JollyGameStatsComponent {
  public stats = input.required<GameStats>();
    protected readonly DurationPipe = DurationPipe;
}
