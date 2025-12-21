import {Component, input} from '@angular/core';

@Component({
  selector: 'game-stats-meta',
  imports: [],
  templateUrl: './game-stats-meta.component.html',
  styleUrl: './game-stats-meta.component.css'
})
export class GameStatsMetaComponent {
  public label = input.required<string>();
  public subLabel = input<string>('');
}
