import {Component, inject, Injector, input, PipeTransform, ProviderToken, Type} from '@angular/core';
import {LinkedGameStats} from "../../../../dto/games/stats/LinkedGameStats";
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {DurationPipe} from "../../../../pipes/DurationPipe";
import {GameStatsStreak} from "../../../../dto/games/stats/GameStatsStreak";

@Component({
  selector: 'game-stats-meta',
  imports: [
    RouterLink,
    NgIf
  ],
  providers: [DurationPipe],
  templateUrl: './game-stats-meta.component.html',
  styleUrl: './game-stats-meta.component.css'
})
export class GameStatsMetaComponent {
  private injector = inject(Injector);

  public data = input.required<undefined | string | LinkedGameStats<any>>();
  public label = input.required<string>();

  public subLabel = input<string>('');
  public pipe = input<Type<PipeTransform>>();
  public defaultValue = input<string>('None');

  protected isLinkedGameStats(value: undefined | string | LinkedGameStats<any>) {
    if(!value) {
      return null;
    } else if(typeof value == 'object' && value.gameId !== undefined && value.value !== undefined) {
      return value as LinkedGameStats<any>;
    }
    return null;
  }

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
