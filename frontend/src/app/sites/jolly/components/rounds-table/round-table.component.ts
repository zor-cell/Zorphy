import {Component, inject, input, OnInit, output, viewChild} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {GameState} from "../../dto/game/GameState";
import {Team} from "../../../../main/core/dto/Team";
import {LightboxDirective} from "ng-gallery/lightbox";
import {Gallery, ImageItem} from "ng-gallery";
import {DurationPipe} from "../../../../main/core/pipes/DurationPipe";
import {RoundPopupComponent} from "../popups/round-popup/round-popup.component";
import {WithFile} from "../../../../main/core/dto/WithFile";
import {RoundResult} from "../../dto/RoundResult";
import {JollyService} from "../../jolly.service";

@Component({
  selector: 'jolly-round-table',
  imports: [
    LightboxDirective,
    NgOptimizedImage,
    RoundPopupComponent
],
  templateUrl: './round-table.component.html',
  styleUrl: './round-table.component.css'
})
export class JollyRoundTableComponent implements OnInit {
  private jollyService = inject(JollyService);
  private gallery = inject(Gallery);
  protected readonly galleryName = "roundTableGallery";

  public gameState = input.required<GameState>();
  public showImages = input<boolean>(false);
  public isEditable = input<boolean>(false);
  public updateRounds = output<GameState>();

  private updateRoundPopup = viewChild.required<RoundPopupComponent>("updateRoundPopup");

  ngOnInit() {
    const roundImages = this.gameState().rounds.map(round => new ImageItem({
      src: round.imageUrl,
      thumb: round.imageUrl
    }));

    const galleryRef = this.gallery.ref(this.galleryName);
    galleryRef.load(roundImages);
  }

  private getDurationInSeconds(index: number) {
    if(index < 0 || index >= this.gameState().rounds.length) return 0;

    const curRound = this.gameState().rounds[index];

    const start = index > 0 ? this.gameState().rounds[index - 1].endTime : this.gameState().startTime;
    const durationMs = DurationPipe.toDurationMsWithPauses(start, curRound.endTime, this.gameState().pauseEntries);

    return Math.floor(durationMs / 1000);
  }

  protected openRoundPopup(roundIndex: number) {
    this.updateRoundPopup().openPopup(roundIndex);
  }

  protected getDuration(index: number) {
    const seconds = this.getDurationInSeconds(index)
    return DurationPipe.fromSeconds(seconds);
  }

  protected getTotalDuration() {
    const total = this.gameState().rounds
      .map((_, i) => this.getDurationInSeconds(i))
      .reduce((a, b) => a + b, 0);

    return DurationPipe.fromSeconds(total);
  }

  protected getTotalScore(team: Team): number {
    return this.gameState().rounds
        .map(r => r.results.find(res => res.team.name === team.name)?.score ?? 0)
        .reduce((a, b) => a + b, 0);
  }

  protected updateRound(event: { data: WithFile<RoundResult[]>, roundIndex: number }) {
    this.jollyService.updateRound(event.roundIndex, event.data.data, event.data.file).subscribe(res => {
      this.updateRounds.emit(res);
    });
  }
}
