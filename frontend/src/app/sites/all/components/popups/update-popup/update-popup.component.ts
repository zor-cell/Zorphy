import {Component, inject, input, output, TemplateRef, viewChild} from '@angular/core';
import {PopupService} from "../../../../../main/services/popup.service";
import {PopupResultType} from "../../../../../main/dto/all/PopupResultType";

@Component({
    selector: 'game-session-update-popup',
    imports: [],
    templateUrl: './update-popup.component.html',
    
    styleUrl: './update-popup.component.css'
})
export class GameSessionUpdatePopupComponent {
    private popupService = inject(PopupService);

    private updateTemplate = viewChild.required<TemplateRef<any>>('updatePopup');
    public canUpdate = input<boolean>(false);
    public updateSessionEvent = output<boolean>();

    public openPopup() {
        this.popupService.createPopup(
            'Update Game Data',
            this.updateTemplate(),
            this.callback.bind(this),
            () => this.canUpdate(),
            'Update',
            'Discard'
        );
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.updateSessionEvent.emit(true);
        } else if(result == PopupResultType.DISCARD) {
            this.updateSessionEvent.emit(false);
        }
    }
}
