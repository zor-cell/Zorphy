import {Component, input} from '@angular/core';
import {GameStatsMetaComponent} from "../game-stats-meta/game-stats-meta.component";

@Component({
  selector: 'game-stats-simple',
  imports: [
    GameStatsMetaComponent
  ],
  templateUrl: './game-stats-simple.component.html',
  styleUrl: './game-stats-simple.component.css'
})
export class GameStatsSimpleComponent {
  public text = input.required<string | undefined>();
  public label = input.required<string>();
  public subLabel = input<string>('');
  public defaultValue = input<string>('None');
}
