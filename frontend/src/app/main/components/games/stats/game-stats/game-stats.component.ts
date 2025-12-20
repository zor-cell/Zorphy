import {Component, computed, effect, inject, signal} from '@angular/core';
import {MainHeaderComponent} from "../../../all/main-header/main-header.component";
import {GameSearchComponent} from "../../game-search/game-search.component";
import {GameFilters} from "../../../../dto/games/GameFilters";
import {GameStats} from "../../../../dto/games/stats/GameStats";
import { NgComponentOutlet } from "@angular/common";
import {GameService} from "../../../../services/game.service";
import {GameComponentRegistryService} from "../../../../services/game-component-registry.service";
import {CorrelationChartComponent} from "../correlation-chart/correlation-chart.component";
import {DurationPipe} from "../../../../pipes/DurationPipe";
import {GameStatsMetaComponent} from "../game-stats-meta/game-stats-meta.component";
import {GameStatsMetricsComponent} from "../game-stats-metrics/game-stats-metrics.component";
import {DataChartComponent} from "../data-chart/data-chart.component";
import {GameStatsStreakComponent} from "../game-stats-streak/game-stats-streak.component";
import {GameStatsSimpleComponent} from "../game-stats-simple/game-stats-simple.component";

@Component({
    selector: 'game-stats',
    imports: [
    MainHeaderComponent,
    GameSearchComponent,
    NgComponentOutlet,
    CorrelationChartComponent,
    CorrelationChartComponent,
    GameStatsMetaComponent,
    DurationPipe,
    GameStatsMetricsComponent,
    DataChartComponent,
    GameStatsStreakComponent,
    GameStatsSimpleComponent
],
    templateUrl: './game-stats.component.html',
    
    styleUrl: './game-stats.component.css'
})
export class GameStatsComponent {
    private gameService = inject(GameService);
    private componentRegistryService = inject(GameComponentRegistryService);

    protected gameStats = signal<GameStats[]>([]);
    protected gameFilters = signal<GameFilters | null>(null);

    protected gameType = computed(() => {
        const gameTypes = this.gameFilters()?.gameTypes;
        if (!gameTypes || gameTypes.length != 1) {
            return null;
        }

        return gameTypes[0];
    });

    protected gameStatsComponent = computed(() => {
        const gameType = this.gameType();
        if (!gameType) return null;

        return this.componentRegistryService.getStatsComponent(gameType);
    });

    protected searchFiltersChanged(filters: GameFilters) {
        this.getStats(filters);
        this.gameFilters.set(filters);
    }

    private getStats(filters: GameFilters) {
        this.gameService.getStats(filters).subscribe(res => {
            this.gameStats.set(res);
        })
    }

    protected readonly DurationPipe = DurationPipe;
}
