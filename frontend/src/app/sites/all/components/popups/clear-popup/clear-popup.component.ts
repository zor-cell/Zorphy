import {Component, inject, output, TemplateRef, viewChild} from '@angular/core';
import {PopupService} from "../../../../../main/core/services/popup.service";
import {PopupResultType} from "../../../../../main/core/dto/PopupResultType";

@Component({
    selector: 'game-session-clear-popup',
    imports: [],
    templateUrl: './clear-popup.component.html',
    
    styleUrl: './clear-popup.component.css'
})
export class GameSessionClearPopupComponent {
    private popupService = inject(PopupService);

    private clearTemplate = viewChild.required<TemplateRef<any>>('clearPopup');
    public clearSessionEvent = output<void>();

    public openPopup() {
        this.popupService.createPopup(
            'Clear Game Data',
            this.clearTemplate(),
            this.callback.bind(this),
            undefined,
            'Clear'
        );
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.clearSessionEvent.emit();
        }
    }
}
