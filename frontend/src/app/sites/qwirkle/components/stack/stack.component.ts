import {Component, effect, inject, input, output, signal, untracked} from '@angular/core';
import {StackTile} from "../../dto/tile/StackTile";
import {QwirkleTileComponent} from "../tile/tile.component";

import {Tile} from "../../dto/tile/Tile";
import {FormsModule} from "@angular/forms";
import {QwirkleService} from "../../qwirkle.service";
import {GameState} from "../../dto/game/GameState";
import {SelectionInfo} from "../../dto/SelectionInfo";

@Component({
    selector: 'qwirkle-stack',
    imports: [
    QwirkleTileComponent,
    FormsModule
],
    templateUrl: './stack.component.html',
    styleUrl: './stack.component.css'
})
export class QwirkleStackComponent {
    public stack = input.required<StackTile[]>();
    public tileDrawn = output<GameState>();
    public tileSelected = output<SelectionInfo>();
    public editModeChanged = output<boolean>();

    protected editMode: boolean = false;
    protected selected = signal<Tile[]>([]);

    private changeEffect = effect(() => {
        //detect stack changes
        const change = this.stack();
        this.resetSelection();
    });
    private qwirkleService = inject(QwirkleService);

    changeEditMode(event: Event) {
        let el = event.target as HTMLInputElement;
        const editMode = el.checked;

        this.resetSelection();

        this.editModeChanged.emit(editMode);
        this.editMode = editMode;
    }

    selectTile(tileIndex: number) {
        if (tileIndex < 0 || tileIndex > this.stack().length - 1) return;

        const stackTile = this.stack()[tileIndex];
        if (stackTile.count <= 0) return;

        if (this.editMode) {
            const tile = stackTile.tile;
            this.selected.update(prev => {
                const selectedIndex = prev.indexOf(tile);
                if(selectedIndex > -1) {
                    return prev.filter(t => t != tile);
                } else {
                    return [...prev, tile];
                }
            })

            this.getSelectionInfo(this.selected());
        } else {
            this.drawTile(stackTile.tile);
        }
    }

    private resetSelection() {
        this.selected.set([]);
        if(this.editMode) {
            const selected = untracked(() => this.selected());
            this.getSelectionInfo(selected);
        }
    }

    private drawTile(tile: Tile) {
        this.qwirkleService.drawTile(tile).subscribe(res => {
            this.tileDrawn.emit(res);
        });
    }

    private getSelectionInfo(selected: Tile[]) {
        this.qwirkleService.getSelectionInfo(selected, true).subscribe(res => {
            this.tileSelected.emit(res);
        });
    }
}
