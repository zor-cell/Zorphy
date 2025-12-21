import {Component, inject, Injector, input, PipeTransform, ProviderToken, Type} from '@angular/core';
import {GameStatsMetrics} from "../../../../dto/games/stats/GameStatsMetrics";
import {GameStatsMetaComponent} from "../game-stats-meta/game-stats-meta.component";
import {RouterLink} from "@angular/router";
import {DurationPipe} from "../../../../pipes/DurationPipe";

@Component({
  selector: 'game-stats-metrics',
    imports: [
        GameStatsMetaComponent,
        RouterLink
    ],
  providers: [DurationPipe],
  templateUrl: './game-stats-metrics.component.html',
  
  styleUrl: './game-stats-metrics.component.css'
})
export class GameStatsMetricsComponent {
  private injector = inject(Injector);

  public metric = input.required<GameStatsMetrics<any>>();
  public label = input.required<string>();
  public pipe = input<Type<any>>();

  protected transformValue(value: any) {
    const pipeClass = this.pipe();

    //transform with pipe if given
    if(pipeClass) {
      const token = pipeClass as ProviderToken<PipeTransform>;

      const pipeInstance = this.injector.get(token) as PipeTransform;
      return pipeInstance.transform(value);
    }

    //truncate floats
    if(this.isFloat(value)) {
      return value.toFixed(2);
    }

    return value;
  }

  private isFloat(value: any): boolean {
    // First, ensure the value is a number and not Infinity or NaN
    if (typeof value !== 'number' || !isFinite(value)) {
      return false;
    }

    // Check if the number is NOT equal to the number truncated/floored.
    // This is true only if there is a non-zero decimal part.
    return value !== Math.floor(value);
  }
}
