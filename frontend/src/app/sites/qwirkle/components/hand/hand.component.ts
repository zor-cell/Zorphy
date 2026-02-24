import {Component, computed, effect, inject, input, output, signal, untracked} from '@angular/core';
import {NgStyle} from "@angular/common";
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
    styleUrl: './hand.component.css'
})
export class QwirkleHandComponent {
    private qwirkleService = inject(QwirkleService);

    public hand = input.required<Tile[]>();
    public handCleared = output<GameState>();
    public tilesSelected = output<SelectionInfo>();

    protected selectionInfo = signal<SelectionInfo | null>(null);
    protected selected = signal<Tile[]>([]);
    tileSize: number = 40;

    protected paddedHand = computed(() => {
        const maxHandSize = 6;
        const padded: (Tile | null)[] = [...this.hand()];
        while (padded.length < maxHandSize) {
            padded.push(null);
        }
        return padded;
    })

    constructor() {
        effect(() => {
            const change = this.hand();
            this.selected.set([]);

            const selected = untracked(() => this.selected());
            this.getSelectionInfo(selected);
        });
    }

    protected selectTile(tileIndex: number) {
        if (tileIndex < 0 || tileIndex > this.hand().length - 1) return;

        const tile = this.hand()[tileIndex];
        this.selected.update(prev => {
            const selectedIndex = prev.indexOf(tile);

            if (selectedIndex > -1) {
                return prev.filter(t => t !== tile);
            } else {
                return [...prev, tile];
            }
        });

        this.getSelectionInfo(this.selected());
    }

    protected clearHand() {
        this.qwirkleService.clearHand().subscribe(res => {
            this.handCleared.emit(res);
        })
    }

    private getSelectionInfo(selected: Tile[]) {
        this.qwirkleService.getSelectionInfo(selected, false).subscribe(res => {
            this.selectionInfo.set(res);
            this.tilesSelected.emit(res);
        });
    }
}
