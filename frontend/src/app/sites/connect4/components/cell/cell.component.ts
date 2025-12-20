import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from "@angular/common";
import {Position} from "../../dto/data";

@Component({
    selector: 'connect4-cell',
    imports: [
        NgClass
    ],
    templateUrl: './cell.component.html',
    
    styleUrl: './cell.component.css'
})
export class CellComponent {
    @Input({required: true}) cellPosition!: Position;
    @Input() cellValue: number = 0;
    @Input() isLastMove: boolean = false;
    @Output() clickEvent = new EventEmitter<number>();

    cellColor() {
        if (this.cellValue === 1) {
            return 'red-circle';
        } else if (this.cellValue === -1) {
            return 'yellow-circle';
        } else {
            return 'white-circle';
        }
    }

    handleClick() {
        this.clickEvent.emit(this.cellPosition.j);
    }
}
