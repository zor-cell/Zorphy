import {Component, inject, output, TemplateRef, viewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {PopupService} from "../../../core/services/popup.service";
import {PopupResultType} from "../../../core/dto/PopupResultType";

@Component({
  selector: 'game-delete-popup',
    imports: [
        FormsModule,
    ],
  templateUrl: './delete-popup.component.html',
  styleUrl: './delete-popup.component.css'
})
export class DeletePopupComponent {
    private popupService = inject(PopupService);

    private deletePopup = viewChild.required<TemplateRef<any>>('deletePopup');
    public deleteGameEvent = output<void>();

    public openPopup() {
        this.popupService.createPopup(
            'Delete Game',
            this.deletePopup(),
            this.callback.bind(this),
            undefined,
            'Delete'
        );
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            this.deleteGameEvent.emit();
        }
    }
}
