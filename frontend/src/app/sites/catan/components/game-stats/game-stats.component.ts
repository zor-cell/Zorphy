import {Component, input} from '@angular/core';
import {GameStats} from "../../dto/game/GameStats";
import {CatanHistogramComponent} from "../histogram/histogram.component";
import {DurationPipe} from "../../../../main/pipes/DurationPipe";
import {
    GameStatsMetricsComponent
} from "../../../../main/components/games/stats/game-stats-metrics/game-stats-metrics.component";
import {
    GameStatsSimpleComponent
} from "../../../../main/components/games/stats/game-stats-simple/game-stats-simple.component";

@Component({
    selector: 'catan-game-stats',
    imports: [
        CatanHistogramComponent,
        GameStatsMetricsComponent,
        GameStatsSimpleComponent
    ],
    templateUrl: './game-stats.component.html',
    styleUrl: './game-stats.component.css',
    standalone: true
})
export class CatanGameStatsComponent {
    public stats = input.required<GameStats>();
    protected readonly DurationPipe = DurationPipe;
}
