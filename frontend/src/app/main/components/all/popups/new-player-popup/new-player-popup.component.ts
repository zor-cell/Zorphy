import {Component, inject, OnInit, output, TemplateRef, viewChild} from '@angular/core';
import {
    NonNullableFormBuilder,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import {PopupService} from "../../../../services/popup.service";
import {PopupResultType} from "../../../../dto/all/PopupResultType";
import {PlayerCreate} from "../../../../dto/all/PlayerCreate";

@Component({
    selector: 'app-new-player-popup',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './new-player-popup.component.html',
    
    styleUrl: './new-player-popup.component.css'
})
export class NewPlayerPopupComponent {
    private popupService = inject(PopupService);
    private fb = inject(NonNullableFormBuilder);

    private playerTemplate = viewChild.required<TemplateRef<any>>('playerPopup');
    public newPlayerEvent = output<PlayerCreate>();

    protected playerForm = this.fb.group({
        name: this.fb.control('', Validators.required),
    });

    public openPopup() {
        this.popupService.createPopup(
            'Create New Player',
            this.playerTemplate(),
            this.callback.bind(this),
            () => this.playerForm.valid,
            'Create');
    }

    private callback(result: PopupResultType) {
        if (result === PopupResultType.SUBMIT) {
            const player = this.playerForm.getRawValue() as PlayerCreate;
            this.newPlayerEvent.emit(player);
        }

        this.playerForm.reset();
    }
}
