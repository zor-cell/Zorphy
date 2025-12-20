import {Component, effect, inject, input, output} from '@angular/core';
import { NgStyle } from "@angular/common";
import {QwirkleTileComponent} from "../tile/tile.component";
import {Tile} from "../../dto/tile/Tile";
import {QwirkleService} from "../../qwirkle.service";
import {SelectionInfo} from "../../dto/SelectionInfo";
import {GameState} from "../../dto/game/GameState";

@Component({
    selector: 'qwirkle-hand',
    imports: [
    QwirkleTileComponent,
    NgStyle
],
    templateUrl: './hand.component.html',
    standalone: true,
    styleUrl: './hand.component.css'
})
export class QwirkleHandComponent {
    hand = input.required<Tile[]>();
    handCleared = output<GameState>();
    tilesSelected = output<SelectionInfo>();

    tileSize: number = 40;
    selected: Tile[] = [];
    selectionInfo: SelectionInfo | null = null;

    get paddedHand() {
        const maxHandSize = 6;
        const padded: (Tile | null)[] = [...this.hand()];
        while (padded.length < maxHandSize) {
            padded.push(null);
        }
        return padded;
    }

    private changeEffect = effect(() => {
        const change = this.hand();
        this.selected = [];
        this.getSelectionInfo();
    });

    private qwirkleService = inject(QwirkleService);

    selectTile(tileIndex: number) {
        if (tileIndex < 0 || tileIndex > this.hand().length - 1) return;

        const tile = this.hand()[tileIndex];
        const selectedIndex = this.selected.indexOf(tile);

        if (selectedIndex > -1) {
            this.selected.splice(selectedIndex, 1);
        } else {
            this.selected.push(tile);
        }

        this.getSelectionInfo();
    }

    protected clearHand() {
        this.qwirkleService.clearHand().subscribe(res => {
            this.handCleared.emit(res);
        })
    }

    private getSelectionInfo() {
        this.qwirkleService.getSelectionInfo(this.selected, false).subscribe(res => {
            this.selectionInfo = res;
            this.tilesSelected.emit(res);
        });
    }
}
