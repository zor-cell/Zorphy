import {Component, inject, Injector, input, PipeTransform, ProviderToken, Type} from '@angular/core';
import {LinkedGameStats} from "../../../../dto/games/stats/LinkedGameStats";
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {DurationPipe} from "../../../../pipes/DurationPipe";
import {GameStatsStreak} from "../../../../dto/games/stats/GameStatsStreak";

@Component({
  selector: 'game-stats-meta',
  imports: [
    NgIf
  ],
  templateUrl: './game-stats-meta.component.html',
  styleUrl: './game-stats-meta.component.css'
})
export class GameStatsMetaComponent {
  public label = input.required<string>();
  public subLabel = input<string>('');
}
