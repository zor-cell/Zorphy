import {Component, computed, inject, signal} from '@angular/core';
import {MainHeaderComponent} from "../../../../core/components/main-header/main-header.component";
import {GameSearchComponent} from "../../game-search/game-search.component";
import {GameFilters} from "../../../dto/GameFilters";
import {GameStats} from "../../../dto/stats/GameStats";
import {NgComponentOutlet} from "@angular/common";
import {GameService} from "../../../game.service";
import {GameComponentRegistryService} from "../../../../core/services/game-component-registry.service";
import {DurationPipe} from "../../../../core/pipes/DurationPipe";
import {GameStatsMetricsComponent} from "../game-stats-metrics/game-stats-metrics.component";
import {ScoreChartComponent} from "../data-chart/score-chart.component";
import {GameStatsStreakComponent} from "../game-stats-streak/game-stats-streak.component";
import {GameStatsSimpleComponent} from "../game-stats-simple/game-stats-simple.component";

@Component({
    selector: 'game-stats',
    imports: [
        MainHeaderComponent,
        GameSearchComponent,
        NgComponentOutlet,
        GameStatsMetricsComponent,
        ScoreChartComponent,
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
